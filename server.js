require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const { google } = require('googleapis');
const speech = require('@google-cloud/speech');
const axios = require('axios');
const Chat = require('./models/Chat');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = process.env.UPLOAD_DIR || 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filters
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
};

const audioFilter = (req, file, cb) => {
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only WAV, MP3, OGG, and WebM audio files are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Initialize Google Custom Search
const customSearch = google.customsearch('v1');

// Initialize Google Cloud Speech-to-Text
const speechClient = new speech.SpeechClient();

// Routes

// 1. Chat Management
app.get('/api/chats', async (req, res) => {
    try {
        const chats = await Chat.find().sort({ updatedAt: -1 });
        res.json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});

app.post('/api/chats', async (req, res) => {
    try {
        const chat = new Chat({
            title: req.body.title || 'New Chat',
            theme: req.body.theme || 'light',
            language: req.body.language || 'en'
        });
        await chat.save();
        res.json(chat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ error: 'Failed to create chat' });
    }
});

app.get('/api/chats/:id', async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.json(chat);
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ error: 'Failed to fetch chat' });
    }
});

// 2. Chat with text input
app.post('/api/chats/:id/messages', async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        const { message, mode } = req.body;
        let response;

        // Add user message
        await chat.addMessage(message, true);

        if (mode === 'think') {
            // Add thinking step before generating response
            response = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL,
                messages: [
                    { role: "system", content: "You are a thoughtful AI assistant. Take a moment to think before responding." },
                    { role: "user", content: message }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });
        } else if (mode === 'browse') {
            // Search for information before responding
            const searchResults = await customSearch.cse.list({
                auth: process.env.GOOGLE_API_KEY,
                cx: process.env.GOOGLE_CSE_ID,
                q: message
            });

            const searchContext = searchResults.data.items
                .map(item => item.snippet)
                .join('\n');

            response = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL,
                messages: [
                    { role: "system", content: "You are a helpful AI assistant. Use the provided search results to enhance your response." },
                    { role: "user", content: `Search results:\n${searchContext}\n\nUser question: ${message}` }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });
        } else {
            // Regular chat mode
            response = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL,
                messages: [
                    { role: "user", content: message }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });
        }

        // Add bot response
        await chat.addMessage(response.choices[0].message.content, false);
        res.json(chat);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

// 3. Upload and analyze image
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const imagePath = req.file.path;
        const imageBuffer = fs.readFileSync(imagePath);

        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Please analyze this image and describe what you see."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 1000
        });

        // Clean up uploaded file
        fs.unlinkSync(imagePath);

        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error('Image analysis error:', error);
        // Clean up file if it exists
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.error('Error cleaning up file:', e);
            }
        }
        res.status(500).json({ error: error.message || 'Failed to analyze image' });
    }
});

// 4. Speech-to-text conversion
app.post('/api/speech-to-text', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        const audio = {
            content: fs.readFileSync(req.file.path).toString('base64'),
        };

        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
            enableAutomaticPunctuation: true,
            model: 'default',
            useEnhanced: true
        };

        const request = {
            audio: audio,
            config: config,
        };

        const [response] = await speechClient.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({ transcription });
    } catch (error) {
        console.error('Speech-to-text error:', error);
        // Clean up file if it exists
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.error('Error cleaning up file:', e);
            }
        }
        res.status(500).json({ error: error.message || 'Failed to convert speech to text' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 