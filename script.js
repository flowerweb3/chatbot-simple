// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const themeSelect = document.getElementById('themeSelect');
const languageSelect = document.getElementById('languageSelect');
const clearHistoryBtn = document.getElementById('clearHistory');
const newChatBtn = document.getElementById('newChat');
const typingIndicator = document.getElementById('typingIndicator');
const toggleTTSBtn = document.getElementById('toggleTTS');
const toggleVoiceInputBtn = document.getElementById('toggleVoiceInput');

// Multilingual responses for the chatbot
const botResponses = {
    en: [
        "I understand what you're saying. Could you tell me more?",
        "That's interesting! How can I help you with that?",
        "I'm here to assist you. What would you like to know?",
        "Let me help you with that. Could you provide more details?",
        "I see! Is there anything specific you'd like to discuss?",
        "That's fascinating! How can I be of service?",
        "I'm here to help! What more would you like to know?",
        "Interesting point! Let's explore that further.",
        "I understand. How can I assist you better?",
        "That's a great question! Let me help you with that."
    ],
    id: [
        "Saya mengerti apa yang Anda katakan. Bisa tolong jelaskan lebih detail?",
        "Menarik! Bagaimana saya bisa membantu Anda?",
        "Saya siap membantu. Apa yang ingin Anda ketahui?",
        "Mari saya bantu. Bisakah Anda memberikan detail lebih lanjut?",
        "Saya mengerti. Apakah ada hal spesifik yang ingin Anda diskusikan?",
        "Fascinating! Apa yang bisa saya bantu?",
        "Saya siap membantu! Apa lagi yang ingin Anda ketahui?",
        "Poin yang menarik! Mari kita bahas lebih lanjut.",
        "Saya mengerti. Bagaimana saya bisa membantu Anda dengan lebih baik?",
        "Pertanyaan yang bagus! Mari saya bantu dengan itu."
    ],
    es: [
        "Entiendo lo que dices. ¿Podrías contarme más?",
        "¡Interesante! ¿Cómo puedo ayudarte con eso?",
        "Estoy aquí para ayudarte. ¿Qué te gustaría saber?",
        "Déjame ayudarte con eso. ¿Podrías proporcionar más detalles?",
        "¡Ya veo! ¿Hay algo específico que te gustaría discutir?",
        "¡Fascinante! ¿Cómo puedo ser de ayuda?",
        "¡Estoy aquí para ayudar! ¿Qué más te gustaría saber?",
        "¡Punto interesante! Exploremos eso más a fondo.",
        "Entiendo. ¿Cómo puedo ayudarte mejor?",
        "¡Excelente pregunta! Déjame ayudarte con eso."
    ],
    fr: [
        "Je comprends ce que vous dites. Pourriez-vous m'en dire plus?",
        "Intéressant! Comment puis-je vous aider avec ça?",
        "Je suis là pour vous aider. Que souhaitez-vous savoir?",
        "Laissez-moi vous aider avec ça. Pourriez-vous donner plus de détails?",
        "Je vois! Y a-t-il quelque chose de spécifique que vous aimeriez discuter?",
        "Fascinant! Comment puis-je vous être utile?",
        "Je suis là pour aider! Que souhaitez-vous savoir d'autre?",
        "Point intéressant! Explorons cela plus en détail.",
        "Je comprends. Comment puis-je mieux vous aider?",
        "Excellente question! Laissez-moi vous aider avec ça."
    ],
    ja: [
        "お話の内容は理解できました。もう少し詳しく教えていただけますか？",
        "面白いですね！どのようにお手伝いできますか？",
        "お手伝いさせていただきます。何を知りたいですか？",
        "お手伝いさせていただきます。もう少し詳しく教えていただけますか？",
        "なるほど！具体的に何について話し合いたいですか？",
        "素晴らしいですね！どのようにお手伝いできますか？",
        "お手伝いさせていただきます！他に何か知りたいことはありますか？",
        "興味深い点ですね！もっと詳しく探ってみましょう。",
        "理解しました。どのようにお手伝いできますか？",
        "素晴らしい質問ですね！お手伝いさせていただきます。"
    ]
};

// Welcome messages in different languages
const welcomeMessages = {
    en: "Hello! I'm your friendly chatbot. How can I help you today? 😊",
    id: "Halo! Saya chatbot yang ramah. Apa yang bisa saya bantu hari ini? 😊",
    es: "¡Hola! Soy tu chatbot amigable. ¿En qué puedo ayudarte hoy? 😊",
    fr: "Bonjour! Je suis votre chatbot amical. Comment puis-je vous aider aujourd'hui? 😊",
    ja: "こんにちは！私はフレンドリーなチャットボットです。今日はどのようにお手伝いできますか？😊"
};

// Theme configuration
const themes = {
    light: 'light-mode',
    dark: 'dark-mode',
    pink: 'pink-mode',
    neon: 'neon-mode'
};

// Initialize theme and language from localStorage or default
const currentTheme = localStorage.getItem('theme') || 'light';
const currentLanguage = localStorage.getItem('language') || 'en';

document.body.className = themes[currentTheme];
themeSelect.value = currentTheme;
languageSelect.value = currentLanguage;

// Update input placeholder based on language
const inputPlaceholders = {
    en: "Type your message here...",
    id: "Ketik pesan Anda di sini...",
    es: "Escribe tu mensaje aquí...",
    fr: "Écrivez votre message ici...",
    ja: "メッセージを入力してください..."
};

function updateInputPlaceholder() {
    userInput.placeholder = inputPlaceholders[languageSelect.value];
}

// Profanity Filter
const profanityFilter = {
    words: new Set([
        // English profanity
        'shit', 'fuck', 'bitch', 'ass', 'damn', 'hell', 'crap', 'piss',
        // Indonesian profanity
        'bangsat', 'bajingan', 'anjing', 'bego', 'goblok', 'bangsat',
        // Spanish profanity
        'mierda', 'puta', 'coño', 'verga', 'chingón',
        // French profanity
        'merde', 'putain', 'conneries', 'bordel',
        // German profanity
        'scheiße', 'hure', 'arsch', 'fick'
    ]),

    init() {
        this.loadCustomWords();
    },

    loadCustomWords() {
        const savedWords = localStorage.getItem('customProfanityWords');
        if (savedWords) {
            const customWords = JSON.parse(savedWords);
            customWords.forEach(word => this.words.add(word.toLowerCase()));
        }
    },

    saveCustomWords() {
        const customWords = Array.from(this.words);
        localStorage.setItem('customProfanityWords', JSON.stringify(customWords));
    },

    addWord(word) {
        this.words.add(word.toLowerCase());
        this.saveCustomWords();
    },

    removeWord(word) {
        this.words.delete(word.toLowerCase());
        this.saveCustomWords();
    },

    containsProfanity(text) {
        const words = text.toLowerCase().split(/\s+/);
        return words.some(word => this.words.has(word));
    },

    filterText(text) {
        if (!this.containsProfanity(text)) {
            return text;
        }

        const words = text.split(/\s+/);
        return words.map(word => {
            if (this.words.has(word.toLowerCase())) {
                return '*'.repeat(word.length);
            }
            return word;
        }).join(' ');
    }
};

// Chat History Management
const chatHistory = {
    chats: [],
    currentChatId: null,
    maxChats: 5,
    messages: [],
    maxMessages: 100,

    init() {
        this.loadChats();
        this.renderChatList();
        this.setupEventListeners();
        this.loadHistory();
    },

    loadChats() {
        const savedChats = localStorage.getItem('chatHistory');
        if (savedChats) {
            this.chats = JSON.parse(savedChats);
        }
    },

    saveChats() {
        localStorage.setItem('chatHistory', JSON.stringify(this.chats));
    },

    createNewChat() {
        const newChat = {
            id: Date.now(),
            title: 'New Chat',
            messages: [],
            timestamp: new Date().toISOString()
        };
        this.chats.unshift(newChat);
        if (this.chats.length > this.maxChats) {
            this.chats.pop();
        }
        this.currentChatId = newChat.id;
        this.saveChats();
        this.renderChatList();
        this.clearChatbox();
        this.addMessage(welcomeMessages[languageSelect.value], false);
    },

    loadChat(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (chat) {
            this.currentChatId = chatId;
            this.renderChatList();
            this.clearChatbox();
            chat.messages.forEach(msg => this.displayMessage(msg.text, msg.isUser));
        }
    },

    addMessage(text, isUser) {
        if (!this.currentChatId) {
            this.createNewChat();
        }
        const chat = this.chats.find(c => c.id === this.currentChatId);
        if (chat) {
            chat.messages.push({ text, isUser });
            chat.timestamp = new Date().toISOString();
            chat.title = this.generateChatTitle(chat.messages);
            this.saveChats();
            this.renderChatList();
            this.displayMessage(text, isUser);
        }
    },

    generateChatTitle(messages) {
        const userMessages = messages.filter(m => m.isUser);
        if (userMessages.length === 0) return 'New Chat';
        const lastUserMessage = userMessages[userMessages.length - 1].text;
        return lastUserMessage.length > 30 ? lastUserMessage.substring(0, 30) + '...' : lastUserMessage;
    },

    renderChatList() {
        const chatList = document.getElementById('chatList');
        chatList.innerHTML = '';
        
        this.chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = `chat-item theme-specific ${chat.id === this.currentChatId ? 'active' : ''}`;
            chatItem.innerHTML = `
                <div class="chat-item-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="chat-item-info">
                    <div class="chat-item-title">${chat.title}</div>
                    <div class="chat-item-preview">${this.getLastMessage(chat.messages)}</div>
                </div>
            `;
            chatItem.addEventListener('click', () => this.loadChat(chat.id));
            chatList.appendChild(chatItem);
        });
    },

    getLastMessage(messages) {
        if (messages.length === 0) return 'No messages';
        const lastMessage = messages[messages.length - 1];
        return lastMessage.text.length > 50 ? lastMessage.text.substring(0, 50) + '...' : lastMessage.text;
    },

    setupEventListeners() {
        const newChatBtn = document.getElementById('newChat');
        newChatBtn.addEventListener('click', () => this.createNewChat());

        const clearButton = document.getElementById('clearHistory');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all chat history?')) {
                    this.clearHistory();
                }
            });
        }
    },

    clearChatbox() {
        const chatbox = document.getElementById('chatMessages');
        chatbox.innerHTML = '';
    },

    loadHistory() {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            this.messages = JSON.parse(savedHistory);
            this.displayHistory();
        }
    },

    displayHistory() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = ''; // Clear existing messages

        this.messages.forEach(message => {
            this.displayMessage(message);
        });
    },

    displayMessage(messageObj) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${messageObj.isUser ? 'user' : 'bot'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = messageObj.text;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    clearHistory() {
        this.messages = [];
        this.chats = [];
        localStorage.removeItem('chatHistory');
        this.displayHistory();
        notificationSystem.show('Chat history cleared', 'info');
    }
};

// Voice Settings
const voiceSettings = {
    isEnabled: false,
    ttsEnabled: false,
    voiceInputEnabled: false,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    voice: null,
    recognition: null,

    init() {
        this.loadSettings();
        this.setupVoiceSettings();
        this.setupEventListeners();
    },

    loadSettings() {
        const savedSettings = localStorage.getItem('voiceSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.rate = settings.rate || 1.0;
            this.pitch = settings.pitch || 1.0;
            this.volume = settings.volume || 1.0;
            this.ttsEnabled = settings.ttsEnabled || false;
            this.voiceInputEnabled = settings.voiceInputEnabled || false;
        }
    },

    saveSettings() {
        const settings = {
            rate: this.rate,
            pitch: this.pitch,
            volume: this.volume,
            ttsEnabled: this.ttsEnabled,
            voiceInputEnabled: this.voiceInputEnabled
        };
        localStorage.setItem('voiceSettings', JSON.stringify(settings));
    },

    setupVoiceSettings() {
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'voice-settings';
        settingsContainer.innerHTML = `
            <h3>Voice Settings</h3>
            <div class="voice-controls">
                <div class="voice-toggle">
                    <button id="ttsToggle" class="voice-btn ${this.ttsEnabled ? 'active' : ''}">
                        <i class="fas fa-volume-up"></i>
                        <span>Text-to-Speech</span>
                    </button>
                    <button id="voiceInputToggle" class="voice-btn ${this.voiceInputEnabled ? 'active' : ''}">
                        <i class="fas fa-microphone"></i>
                        <span>Voice Input</span>
                    </button>
                </div>
                <div class="voice-parameters">
                    <div class="parameter-group">
                        <label for="rateRange">Speech Rate</label>
                        <input type="range" id="rateRange" min="0.5" max="2" step="0.1" value="${this.rate}">
                        <span class="parameter-value">${this.rate}</span>
                    </div>
                    <div class="parameter-group">
                        <label for="pitchRange">Pitch</label>
                        <input type="range" id="pitchRange" min="0.5" max="2" step="0.1" value="${this.pitch}">
                        <span class="parameter-value">${this.pitch}</span>
                    </div>
                    <div class="parameter-group">
                        <label for="volumeRange">Volume</label>
                        <input type="range" id="volumeRange" min="0" max="1" step="0.1" value="${this.volume}">
                        <span class="parameter-value">${this.volume}</span>
                    </div>
                </div>
                <div class="voice-selection">
                    <label for="voiceSelect">Voice</label>
                    <select id="voiceSelect"></select>
                </div>
            </div>
        `;

        document.querySelector('.settings-panel').appendChild(settingsContainer);
        this.loadVoices();
    },

    setupEventListeners() {
        const ttsToggle = document.getElementById('ttsToggle');
        const voiceInputToggle = document.getElementById('voiceInputToggle');
        const rateRange = document.getElementById('rateRange');
        const pitchRange = document.getElementById('pitchRange');
        const volumeRange = document.getElementById('volumeRange');
        const voiceSelect = document.getElementById('voiceSelect');

        ttsToggle.addEventListener('click', () => this.toggleTTS());
        voiceInputToggle.addEventListener('click', () => this.toggleVoiceInput());
        
        rateRange.addEventListener('input', (e) => {
            this.rate = parseFloat(e.target.value);
            this.updateParameterValue('rateRange', this.rate);
            this.saveSettings();
        });

        pitchRange.addEventListener('input', (e) => {
            this.pitch = parseFloat(e.target.value);
            this.updateParameterValue('pitchRange', this.pitch);
            this.saveSettings();
        });

        volumeRange.addEventListener('input', (e) => {
            this.volume = parseFloat(e.target.value);
            this.updateParameterValue('volumeRange', this.volume);
            this.saveSettings();
        });

        voiceSelect.addEventListener('change', (e) => {
            this.setVoice(e.target.value);
        });
    },

    loadVoices() {
        const voiceSelect = document.getElementById('voiceSelect');
        voiceSelect.innerHTML = '';

        const voices = speechSynthesis.getVoices();
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });

        // Set default voice based on current language
        const currentLang = languageManager.currentLanguage;
        const defaultVoice = voices.find(voice => voice.lang.startsWith(currentLang));
        if (defaultVoice) {
            voiceSelect.value = defaultVoice.name;
            this.voice = defaultVoice;
        }
    },

    updateParameterValue(rangeId, value) {
        const range = document.getElementById(rangeId);
        const valueDisplay = range.nextElementSibling;
        valueDisplay.textContent = value.toFixed(1);
    },

    toggleTTS() {
        this.ttsEnabled = !this.ttsEnabled;
        const ttsToggle = document.getElementById('ttsToggle');
        ttsToggle.classList.toggle('active', this.ttsEnabled);
        this.saveSettings();
    },

    toggleVoiceInput() {
        if (!this.recognition) {
            this.initializeRecognition();
        }

        this.voiceInputEnabled = !this.voiceInputEnabled;
        const voiceInputToggle = document.getElementById('voiceInputToggle');
        voiceInputToggle.classList.toggle('active', this.voiceInputEnabled);

        if (this.voiceInputEnabled) {
            this.startVoiceInput();
        } else {
            this.stopVoiceInput();
        }

        this.saveSettings();
    },

    initializeRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = languageManager.currentLanguage;

            this.recognition.onresult = (event) => {
                const result = event.results[0][0].transcript;
                userInput.value = result;
                toggleVoiceInputBtn.classList.remove('active');
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                notificationSystem.show('Speech recognition error: ' + event.error, 'error');
                toggleVoiceInputBtn.classList.remove('active');
            };

            this.recognition.onend = () => {
                toggleVoiceInputBtn.classList.remove('active');
            };
        } else {
            notificationSystem.show('Speech recognition is not supported in your browser', 'warning');
        }
    },

    startVoiceInput() {
        if (!this.recognition) {
            this.initializeRecognition();
        }
        
        try {
            this.recognition.start();
            toggleVoiceInputBtn.classList.add('active');
        } catch (error) {
            console.error('Error starting voice input:', error);
            notificationSystem.show('Failed to start voice input', 'error');
        }
    },

    stopVoiceInput() {
        if (this.recognition) {
            this.recognition.stop();
            toggleVoiceInputBtn.classList.remove('active');
        }
    },

    setVoice(voiceName) {
        const voices = speechSynthesis.getVoices();
        this.voice = voices.find(voice => voice.name === voiceName);
    },

    speak(text) {
        if (!this.ttsEnabled || !this.voice) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;

        speechSynthesis.speak(utterance);
    }
};

// AI Service Integration
const aiService = {
    apiKey: null,
    model: 'gpt-3.5-turbo',
    maxTokens: 150,
    temperature: 0.7,
    contextWindow: 5, // Number of previous messages to include in context

    init() {
        this.loadApiKey();
        this.setupEventListeners();
    },

    loadApiKey() {
        this.apiKey = localStorage.getItem('openaiApiKey');
    },

    setupEventListeners() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('change', (e) => {
                this.apiKey = e.target.value;
                localStorage.setItem('openaiApiKey', this.apiKey);
            });
        }
    },

    async getResponse(message, language = 'en') {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not found');
        }

        const context = this.getContext();
        const prompt = this.buildPrompt(message, context, language);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: this.getSystemPrompt(language)
                        },
                        ...context,
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: this.maxTokens,
                    temperature: this.temperature
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('AI Service Error:', error);
            return this.getFallbackResponse(language);
        }
    },

    getContext() {
        const messages = chatHistory.getCurrentChatMessages();
        return messages.slice(-this.contextWindow).map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
        }));
    },

    buildPrompt(message, context, language) {
        const languageNames = {
            en: 'English',
            id: 'Indonesian',
            es: 'Spanish',
            fr: 'French',
            de: 'German'
        };

        return `Please respond in ${languageNames[language] || 'English'}. 
                Previous context: ${context.map(c => c.content).join(' | ')}
                User message: ${message}`;
    },

    getSystemPrompt(language) {
        const prompts = {
            en: 'You are a helpful and friendly AI assistant. Provide clear, concise, and accurate responses.',
            id: 'Anda adalah asisten AI yang membantu dan ramah. Berikan respons yang jelas, ringkas, dan akurat.',
            es: 'Eres un asistente de IA servicial y amigable. Proporciona respuestas claras, concisas y precisas.',
            fr: 'Vous êtes un assistant IA serviable et amical. Fournissez des réponses claires, concises et précises.',
            de: 'Sie sind ein hilfreicher und freundlicher KI-Assistent. Geben Sie klare, prägnante und präzise Antworten.'
        };

        return prompts[language] || prompts['en'];
    },

    getFallbackResponse(language) {
        const responses = {
            en: [
                "I apologize, but I'm having trouble processing your request right now. Please try again later.",
                "I'm not sure I understand. Could you please rephrase that?",
                "I'm experiencing some technical difficulties. Please try again in a moment."
            ],
            id: [
                "Maaf, saya sedang mengalami kesulitan memproses permintaan Anda. Silakan coba lagi nanti.",
                "Saya tidak yakin memahami maksud Anda. Bisakah Anda mengungkapkannya dengan cara lain?",
                "Saya sedang mengalami beberapa kesulitan teknis. Silakan coba lagi sebentar lagi."
            ],
            es: [
                "Lo siento, pero estoy teniendo problemas para procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde.",
                "No estoy seguro de entender. ¿Podrías reformular eso?",
                "Estoy experimentando algunas dificultades técnicas. Por favor, inténtalo de nuevo en un momento."
            ],
            fr: [
                "Je m'excuse, mais j'ai des difficultés à traiter votre demande en ce moment. Veuillez réessayer plus tard.",
                "Je ne suis pas sûr de comprendre. Pourriez-vous reformuler cela ?",
                "Je rencontre des difficultés techniques. Veuillez réessayer dans un moment."
            ],
            de: [
                "Entschuldigung, aber ich habe derzeit Probleme, Ihre Anfrage zu verarbeiten. Bitte versuchen Sie es später erneut.",
                "Ich bin mir nicht sicher, ob ich das verstehe. Könnten Sie das anders formulieren?",
                "Ich habe derzeit technische Schwierigkeiten. Bitte versuchen Sie es in einem Moment erneut."
            ]
        };

        const langResponses = responses[language] || responses['en'];
        return langResponses[Math.floor(Math.random() * langResponses.length)];
    }
};

// Event Listeners
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});

themeSelect.addEventListener('change', handleThemeChange);
languageSelect.addEventListener('change', handleLanguageChange);
clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
        clearChatHistory();
    }
});

newChatBtn.addEventListener('click', () => {
    if (confirm('Start a new chat? This will clear the current conversation.')) {
        startNewChat();
    }
});

toggleTTSBtn.addEventListener('click', () => voiceSettings.toggleTTS());
toggleVoiceInputBtn.addEventListener('click', () => voiceSettings.toggleVoiceInput());

// Functions
async function handleSendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // Filter user message
    const filteredMessage = profanityFilter.filterText(message);
    
    // Add user message
    addMessage(filteredMessage, 'user');
    userInput.value = '';

    // Show typing indicator
    typingIndicator.classList.add('active');

    try {
        // Get AI response
        const botResponse = await aiService.getResponse(filteredMessage, languageSelect.value);
        
        // Remove typing indicator and add bot response
        typingIndicator.classList.remove('active');
        addMessage(botResponse, 'bot');
        
        // Speak the response if TTS is enabled
        voiceSettings.speak(botResponse);
    } catch (error) {
        console.error('Error getting AI response:', error);
        typingIndicator.classList.remove('active');
        addMessage(getRandomResponse(), 'bot');
    }
}

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Save message to chat history
    chatHistory.addMessage({
        content: content,
        sender: sender,
        timestamp: new Date().toISOString(),
        language: languageSelect.value
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Speak the message if it's from bot and TTS is enabled
    if (sender === 'bot' && voiceSettings.ttsEnabled) {
        voiceSettings.speak(content);
    }
}

function getRandomResponse() {
    const currentLang = languageSelect.value;
    const responses = botResponses[currentLang];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

function handleThemeChange() {
    const selectedTheme = themeSelect.value;
    document.body.className = themes[selectedTheme];
    localStorage.setItem('theme', selectedTheme);
}

function handleLanguageChange() {
    const selectedLanguage = languageSelect.value;
    localStorage.setItem('language', selectedLanguage);
    updateInputPlaceholder();
    
    // Update voice for TTS
    voiceSettings.setVoice(selectedLanguage);
    
    // Update welcome message if it's the first message
    const messages = chatMessages.children;
    if (messages.length === 1) {
        const welcomeMessage = messages[0].querySelector('.message-content');
        welcomeMessage.textContent = welcomeMessages[selectedLanguage];
    }
}

// Function to load chat history with pagination
function loadChatHistory() {
    const messages = chatHistory.load();
    chatMessages.innerHTML = ''; // Clear existing messages
    
    // Show only the last messagesPerPage messages
    const startIndex = Math.max(0, messages.length - chatHistory.messagesPerPage);
    const endIndex = messages.length;
    const messagesToShow = messages.slice(startIndex, endIndex);
    
    messagesToShow.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = msg.content;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
    });
    
    // Show/hide load more button
    loadMoreBtn.style.display = messages.length > chatHistory.messagesPerPage ? 'flex' : 'none';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to load more messages
function loadMoreMessages() {
    const messages = chatHistory.load();
    const currentMessages = chatMessages.children.length;
    
    // Calculate the next batch of messages to show
    const startIndex = Math.max(0, messages.length - currentMessages - chatHistory.messagesPerPage);
    const endIndex = messages.length - currentMessages;
    
    if (startIndex < endIndex) {
        const messagesToAdd = messages.slice(startIndex, endIndex);
        
        // Add messages at the beginning of the chat
        messagesToAdd.reverse().forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}`;
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.textContent = msg.content;
            
            messageDiv.appendChild(messageContent);
            chatMessages.insertBefore(messageDiv, chatMessages.firstChild);
        });
        
        // Hide load more button if all messages are shown
        if (startIndex === 0) {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// Function to start a new chat
function startNewChat() {
    chatHistory.clear();
    chatMessages.innerHTML = '';
    addMessage(welcomeMessages[languageSelect.value], 'bot');
    loadMoreBtn.style.display = 'none';
}

// Add clear history button functionality
function clearChatHistory() {
    chatHistory.clear();
    loadChatHistory();
}

// Initialize
updateInputPlaceholder();
loadChatHistory();

// If no messages in history, add welcome message
if (chatMessages.children.length === 0) {
    addMessage(welcomeMessages[currentLanguage], 'bot');
}

// Initialize voice settings
voiceSettings.init();

// Initialize AI service when the page loads
document.addEventListener('DOMContentLoaded', () => {
    aiService.init();
    // ... rest of the initialization code ...
});

// Typing Animation
const typingAnimation = {
    isTyping: false,
    speed: 30, // milliseconds per character
    currentText: '',
    targetText: '',
    currentIndex: 0,
    element: null,

    init() {
        this.element = document.createElement('div');
        this.element.className = 'typing-indicator';
        this.element.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        document.getElementById('chatbox').appendChild(this.element);
        this.element.style.display = 'none';
    },

    start(text) {
        this.isTyping = true;
        this.targetText = text;
        this.currentIndex = 0;
        this.element.style.display = 'flex';
        this.element.querySelector('.typing-text').textContent = languageManager.getTranslation('typing');
        this.typeNextCharacter();
    },

    typeNextCharacter() {
        if (!this.isTyping || this.currentIndex >= this.targetText.length) {
            this.stop();
            return;
        }

        this.currentText += this.targetText[this.currentIndex];
        this.currentIndex++;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot';
        messageElement.textContent = this.currentText;
        
        // Replace or append the message
        const lastMessage = document.querySelector('.message.bot:last-child');
        if (lastMessage) {
            lastMessage.replaceWith(messageElement);
        } else {
            document.getElementById('chatbox').appendChild(messageElement);
        }

        setTimeout(() => this.typeNextCharacter(), this.speed);
    },

    stop() {
        this.isTyping = false;
        this.element.style.display = 'none';
        this.currentText = '';
    }
};

// Update the displayMessage function to use typing animation for bot messages
function displayMessage(text, isUser) {
    const chatbox = document.getElementById('chatbox');
    
    if (isUser) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user';
        messageElement.textContent = text;
        chatbox.appendChild(messageElement);
    } else {
        typingAnimation.start(text);
        if (voiceSettings.ttsEnabled) {
            voiceSettings.speak(text);
        }
    }
    
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Add typing animation styles
const style = document.createElement('style');
style.textContent = `
    .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 10px;
        margin: 10px 0;
    }

    .typing-dot {
        width: 8px;
        height: 8px;
        background-color: #666;
        border-radius: 50%;
        animation: typing 1s infinite ease-in-out;
    }

    .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
    }

    .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes typing {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(style);

// Initialize typing animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    typingAnimation.init();
    // ... rest of the initialization code ...
});

// Language Management
const languageManager = {
    currentLanguage: 'en',
    supportedLanguages: {
        en: { name: 'English', code: 'en' },
        id: { name: 'Indonesia', code: 'id' },
        es: { name: 'Español', code: 'es' },
        fr: { name: 'Français', code: 'fr' },
        de: { name: 'Deutsch', code: 'de' }
    },

    init() {
        this.detectLanguage();
        this.setupLanguageSelector();
        this.setupEventListeners();
    },

    detectLanguage() {
        // Try to detect language from browser
        const browserLang = navigator.language.split('-')[0];
        if (this.supportedLanguages[browserLang]) {
            this.currentLanguage = browserLang;
        }
        
        // Try to get saved language preference
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && this.supportedLanguages[savedLang]) {
            this.currentLanguage = savedLang;
        }
    },

    setupLanguageSelector() {
        const selector = document.getElementById('languageSelector');
        selector.innerHTML = '';
        
        Object.values(this.supportedLanguages).forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            option.selected = lang.code === this.currentLanguage;
            selector.appendChild(option);
        });
    },

    setupEventListeners() {
        const selector = document.getElementById('languageSelector');
        selector.addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });
    },

    setLanguage(langCode) {
        if (this.supportedLanguages[langCode]) {
            this.currentLanguage = langCode;
            localStorage.setItem('preferredLanguage', langCode);
            
            // Update UI elements
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                element.textContent = this.getTranslation(key);
            });
            
            // Update voice settings
            if (voiceSettings.isEnabled) {
                voiceSettings.updateVoice();
            }
        }
    },

    getTranslation(key) {
        const translations = {
            en: {
                'newChat': 'New Chat',
                'chatHistory': 'Chat History',
                'sendMessage': 'Send Message',
                'typeMessage': 'Type your message...',
                'clearHistory': 'Clear History',
                'loadMore': 'Load More',
                'typing': 'Typing...',
                'voiceEnabled': 'Voice Enabled',
                'voiceDisabled': 'Voice Disabled'
            },
            id: {
                'newChat': 'Chat Baru',
                'chatHistory': 'Riwayat Chat',
                'sendMessage': 'Kirim Pesan',
                'typeMessage': 'Ketik pesan Anda...',
                'clearHistory': 'Hapus Riwayat',
                'loadMore': 'Muat Lebih Banyak',
                'typing': 'Mengetik...',
                'voiceEnabled': 'Suara Diaktifkan',
                'voiceDisabled': 'Suara Dinonaktifkan'
            },
            es: {
                'newChat': 'Nuevo Chat',
                'chatHistory': 'Historial de Chat',
                'sendMessage': 'Enviar Mensaje',
                'typeMessage': 'Escribe tu mensaje...',
                'clearHistory': 'Borrar Historial',
                'loadMore': 'Cargar Más',
                'typing': 'Escribiendo...',
                'voiceEnabled': 'Voz Activada',
                'voiceDisabled': 'Voz Desactivada'
            },
            fr: {
                'newChat': 'Nouveau Chat',
                'chatHistory': 'Historique des Chats',
                'sendMessage': 'Envoyer',
                'typeMessage': 'Écrivez votre message...',
                'clearHistory': 'Effacer l\'Historique',
                'loadMore': 'Charger Plus',
                'typing': 'En train d\'écrire...',
                'voiceEnabled': 'Voix Activée',
                'voiceDisabled': 'Voix Désactivée'
            },
            de: {
                'newChat': 'Neuer Chat',
                'chatHistory': 'Chat-Verlauf',
                'sendMessage': 'Senden',
                'typeMessage': 'Geben Sie Ihre Nachricht ein...',
                'clearHistory': 'Verlauf Löschen',
                'loadMore': 'Mehr Laden',
                'typing': 'Schreibt...',
                'voiceEnabled': 'Sprache Aktiviert',
                'voiceDisabled': 'Sprache Deaktiviert'
            }
        };

        return translations[this.currentLanguage]?.[key] || translations['en'][key];
    }
};

// Update the getResponse function to use the AI service
async function getResponse(message) {
    try {
        const response = await aiService.getResponse(message, languageManager.currentLanguage);
        return response;
    } catch (error) {
        console.error('Error getting AI response:', error);
        return aiService.getFallbackResponse(languageManager.currentLanguage);
    }
}

// Theme Management
const themeManager = {
    currentTheme: 'light',
    themes: {
        light: {
            name: 'Light',
            colors: {
                primary: '#007bff',
                secondary: '#6c757d',
                background: '#ffffff',
                surface: '#f8f9fa',
                text: '#333333',
                border: '#dee2e6',
                hover: '#e9ecef'
            }
        },
        dark: {
            name: 'Dark',
            colors: {
                primary: '#0d6efd',
                secondary: '#adb5bd',
                background: '#1a1a1a',
                surface: '#2d2d2d',
                text: '#ffffff',
                border: '#404040',
                hover: '#3d3d3d'
            }
        },
        pink: {
            name: 'Pink Aesthetic',
            colors: {
                primary: '#ff69b4',
                secondary: '#ffb6c1',
                background: '#fff5f8',
                surface: '#ffffff',
                text: '#8b4513',
                border: '#ffd1dc',
                hover: '#ffe4e8'
            }
        },
        neon: {
            name: 'Neon',
            colors: {
                primary: '#00ff00',
                secondary: '#00ffff',
                background: '#000000',
                surface: '#1a1a1a',
                text: '#ffffff',
                border: '#333333',
                hover: '#2d2d2d'
            }
        }
    },

    init() {
        this.detectTheme();
        this.setupThemeSelector();
        this.setupEventListeners();
        this.applyTheme();
    },

    detectTheme() {
        // Try to get saved theme preference
        const savedTheme = localStorage.getItem('preferredTheme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
        
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark && !savedTheme) {
            this.currentTheme = 'dark';
        }
    },

    setupThemeSelector() {
        const selector = document.getElementById('themeSelector');
        selector.innerHTML = '';
        
        Object.entries(this.themes).forEach(([code, theme]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = theme.name;
            option.selected = code === this.currentTheme;
            selector.appendChild(option);
        });
    },

    setupEventListeners() {
        const selector = document.getElementById('themeSelector');
        selector.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('preferredTheme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    setTheme(themeCode) {
        if (this.themes[themeCode]) {
            this.currentTheme = themeCode;
            localStorage.setItem('preferredTheme', themeCode);
            this.applyTheme();
        }
    },

    applyTheme() {
        const theme = this.themes[this.currentTheme];
        const root = document.documentElement;

        // Apply CSS variables
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--${key}-color`, value);
        });

        // Update theme-specific classes
        document.body.className = `${this.currentTheme}-mode`;
        
        // Update theme-specific elements
        document.querySelectorAll('.theme-specific').forEach(element => {
            element.className = `theme-specific ${this.currentTheme}-mode`;
        });
    }
};

// Initialize theme manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
    // ... rest of the initialization code ...
});

// Chat History Export
const chatExporter = {
    formats: {
        txt: {
            name: 'Plain Text',
            extension: '.txt',
            export: (chats) => this.exportToText(chats)
        },
        json: {
            name: 'JSON',
            extension: '.json',
            export: (chats) => this.exportToJSON(chats)
        },
        html: {
            name: 'HTML',
            extension: '.html',
            export: (chats) => this.exportToHTML(chats)
        }
    },

    init() {
        this.setupExportUI();
    },

    setupExportUI() {
        const exportContainer = document.createElement('div');
        exportContainer.className = 'export-settings';
        exportContainer.innerHTML = `
            <h3>Export Chat History</h3>
            <div class="export-options">
                <select id="exportFormat">
                    <option value="txt">Plain Text</option>
                    <option value="json">JSON</option>
                    <option value="html">HTML</option>
                </select>
                <button id="exportButton">Export</button>
            </div>
        `;

        document.querySelector('.settings-panel').appendChild(exportContainer);

        const exportButton = document.getElementById('exportButton');
        const formatSelect = document.getElementById('exportFormat');

        exportButton.addEventListener('click', () => {
            const format = formatSelect.value;
            const chats = chatHistory.chats;
            this.exportChats(chats, format);
        });
    },

    exportChats(chats, format) {
        const exporter = this.formats[format];
        if (!exporter) return;

        const content = exporter.export(chats);
        const blob = new Blob([content], { type: this.getMimeType(format) });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history${exporter.extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    getMimeType(format) {
        const mimeTypes = {
            txt: 'text/plain',
            json: 'application/json',
            html: 'text/html'
        };
        return mimeTypes[format] || 'text/plain';
    },

    exportToText(chats) {
        let content = 'Chat History\n\n';
        chats.forEach((chat, index) => {
            content += `Chat ${index + 1}\n`;
            content += `Date: ${new Date(chat.timestamp).toLocaleString()}\n`;
            content += `Title: ${chat.title}\n\n`;
            
            chat.messages.forEach(msg => {
                content += `${msg.isUser ? 'User' : 'Bot'}: ${msg.text}\n`;
            });
            
            content += '\n' + '-'.repeat(50) + '\n\n';
        });
        return content;
    },

    exportToJSON(chats) {
        return JSON.stringify(chats, null, 2);
    },

    exportToHTML(chats) {
        const theme = themeManager.currentTheme;
        const styles = this.getThemeStyles(theme);
        
        let content = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Chat History</title>
                <style>
                    ${styles}
                </style>
            </head>
            <body class="${theme}-mode">
                <div class="chat-history">
                    <h1>Chat History</h1>
                    ${this.generateHTMLContent(chats)}
                </div>
            </body>
            </html>
        `;
        return content;
    },

    generateHTMLContent(chats) {
        return chats.map((chat, index) => `
            <div class="chat-container">
                <div class="chat-header">
                    <h2>Chat ${index + 1}</h2>
                    <div class="chat-meta">
                        <span>Date: ${new Date(chat.timestamp).toLocaleString()}</span>
                        <span>Title: ${chat.title}</span>
                    </div>
                </div>
                <div class="chat-messages">
                    ${chat.messages.map(msg => `
                        <div class="message ${msg.isUser ? 'user' : 'bot'}">
                            ${msg.text}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    getThemeStyles(theme) {
        const themeColors = themeManager.themes[theme].colors;
        return `
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                background-color: ${themeColors.background};
                color: ${themeColors.text};
            }
            .chat-history {
                max-width: 800px;
                margin: 0 auto;
            }
            .chat-container {
                background-color: ${themeColors.surface};
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .chat-header {
                border-bottom: 1px solid ${themeColors.border};
                padding-bottom: 10px;
                margin-bottom: 15px;
            }
            .chat-meta {
                display: flex;
                gap: 20px;
                font-size: 0.9rem;
                color: ${themeColors.secondary};
            }
            .message {
                padding: 10px 15px;
                border-radius: 8px;
                margin: 8px 0;
                max-width: 80%;
            }
            .message.user {
                background-color: ${themeColors.primary};
                color: white;
                margin-left: auto;
            }
            .message.bot {
                background-color: ${themeColors.surface};
                color: ${themeColors.text};
                margin-right: auto;
            }
        `;
    }
};

// Initialize chat exporter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    chatExporter.init();
    // ... rest of the initialization code ...
});

// Chat History Search
const chatSearch = {
    searchInput: null,
    searchResults: [],
    currentIndex: -1,

    init() {
        this.setupSearchUI();
        this.setupEventListeners();
    },

    setupSearchUI() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-input-wrapper">
                <input type="text" id="searchInput" placeholder="Search in chat history...">
                <button id="searchButton">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            <div class="search-results">
                <div class="search-info"></div>
                <div class="search-navigation">
                    <button id="prevResult" disabled>
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <button id="nextResult" disabled>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            </div>
        `;

        document.querySelector('.chat-container').insertBefore(
            searchContainer,
            document.getElementById('chatbox')
        );

        this.searchInput = document.getElementById('searchInput');
    },

    setupEventListeners() {
        const searchButton = document.getElementById('searchButton');
        const prevButton = document.getElementById('prevResult');
        const nextButton = document.getElementById('nextResult');

        searchButton.addEventListener('click', () => this.performSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        prevButton.addEventListener('click', () => this.navigateResults(-1));
        nextButton.addEventListener('click', () => this.navigateResults(1));

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'f') {
                    e.preventDefault();
                    this.searchInput.focus();
                }
            }
        });
    },

    performSearch() {
        const query = this.searchInput.value.trim().toLowerCase();
        if (!query) return;

        this.searchResults = [];
        const chats = chatHistory.chats;

        chats.forEach((chat, chatIndex) => {
            chat.messages.forEach((message, messageIndex) => {
                if (message.text.toLowerCase().includes(query)) {
                    this.searchResults.push({
                        chatIndex,
                        messageIndex,
                        text: message.text,
                        isUser: message.isUser
                    });
                }
            });
        });

        this.updateSearchUI();
        if (this.searchResults.length > 0) {
            this.navigateResults(0);
        }
    },

    updateSearchUI() {
        const searchInfo = document.querySelector('.search-info');
        const prevButton = document.getElementById('prevResult');
        const nextButton = document.getElementById('nextResult');

        if (this.searchResults.length > 0) {
            searchInfo.textContent = `${this.currentIndex + 1} of ${this.searchResults.length} results`;
            prevButton.disabled = this.currentIndex <= 0;
            nextButton.disabled = this.currentIndex >= this.searchResults.length - 1;
        } else {
            searchInfo.textContent = 'No results found';
            prevButton.disabled = true;
            nextButton.disabled = true;
        }
    },

    navigateResults(direction) {
        if (this.searchResults.length === 0) return;

        // Remove highlight from current result
        this.removeHighlight();

        // Update current index
        this.currentIndex = (this.currentIndex + direction + this.searchResults.length) % this.searchResults.length;

        // Load the chat containing the result
        const result = this.searchResults[this.currentIndex];
        chatHistory.loadChat(chatHistory.chats[result.chatIndex].id);

        // Wait for chat to load before highlighting
        setTimeout(() => {
            this.highlightResult(result);
        }, 100);
    },

    highlightResult(result) {
        const messages = document.querySelectorAll('.message');
        const targetMessage = messages[result.messageIndex];
        
        if (targetMessage) {
            targetMessage.classList.add('search-highlight');
            targetMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    removeHighlight() {
        const highlighted = document.querySelector('.search-highlight');
        if (highlighted) {
            highlighted.classList.remove('search-highlight');
        }
    }
};

// Initialize chat search when the page loads
document.addEventListener('DOMContentLoaded', () => {
    chatSearch.init();
    // ... rest of the initialization code ...
});

// Notification System
const notificationSystem = {
    notifications: [],
    maxNotifications: 5,
    container: null,

    init() {
        this.setupContainer();
        this.setupEventListeners();
    },

    setupContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    },

    setupEventListeners() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseNotifications();
            } else {
                this.resumeNotifications();
            }
        });
    },

    show(message, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now(),
            message,
            type,
            duration,
            timestamp: Date.now()
        };

        this.notifications.push(notification);
        this.renderNotification(notification);

        if (this.notifications.length > this.maxNotifications) {
            const oldestNotification = this.notifications.shift();
            this.removeNotification(oldestNotification.id);
        }

        setTimeout(() => {
            this.removeNotification(notification.id);
        }, duration);
    },

    renderNotification(notification) {
        const element = document.createElement('div');
        element.className = `notification ${notification.type} slide-in`;
        element.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getIcon(notification.type)}"></i>
                <span>${notification.message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        element.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification.id);
        });

        this.container.appendChild(element);
    },

    removeNotification(id) {
        const element = this.container.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.classList.add('slide-out');
            setTimeout(() => {
                element.remove();
            }, 300);
        }

        this.notifications = this.notifications.filter(n => n.id !== id);
    },

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    },

    pauseNotifications() {
        this.notifications.forEach(notification => {
            const element = this.container.querySelector(`[data-id="${notification.id}"]`);
            if (element) {
                element.style.animationPlayState = 'paused';
            }
        });
    },

    resumeNotifications() {
        this.notifications.forEach(notification => {
            const element = this.container.querySelector(`[data-id="${notification.id}"]`);
            if (element) {
                element.style.animationPlayState = 'running';
            }
        });
    }
};

// Visual Feedback System
const feedbackSystem = {
    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => this.addRippleEffect(button));
        });

        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', () => this.addFocusEffect(input));
            input.addEventListener('blur', () => this.removeFocusEffect(input));
        });
    },

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    },

    addFocusEffect(element) {
        element.classList.add('focused');
    },

    removeFocusEffect(element) {
        element.classList.remove('focused');
    },

    showLoading(element) {
        element.classList.add('loading');
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        element.appendChild(spinner);
    },

    hideLoading(element) {
        element.classList.remove('loading');
        const spinner = element.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    },

    showSuccess(element) {
        element.classList.add('success');
        setTimeout(() => {
            element.classList.remove('success');
        }, 2000);
    },

    showError(element) {
        element.classList.add('error');
        setTimeout(() => {
            element.classList.remove('error');
        }, 2000);
    }
};

// Initialize systems when the page loads
document.addEventListener('DOMContentLoaded', () => {
    chatHistory.init();
    notificationSystem.init();
    feedbackSystem.init();

    // Setup message sending
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('userInput');

    if (sendButton && messageInput) {
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Setup theme switching
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            document.body.className = `${e.target.value}-mode`;
            localStorage.setItem('theme', e.target.value);
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.className = `${savedTheme}-mode`;
        themeSelect.value = savedTheme;
    }

    // Setup language switching
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            localStorage.setItem('language', e.target.value);
        });

        // Load saved language
        const savedLanguage = localStorage.getItem('language') || 'en';
        languageSelect.value = savedLanguage;
    }

    // Image upload button
    const imageUploadBtn = document.querySelector('.action-btn[title="Upload Image"]');
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.style.display = 'none';

    imageUploadBtn.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    // Voice input button
    toggleVoiceInputBtn.addEventListener('click', () => {
        if (toggleVoiceInputBtn.classList.contains('active')) {
            stopVoiceInput();
        } else {
            startVoiceInput();
        }
    });

    // Initialize voice recognition
    initializeRecognition();
});

// Function to send messages
async function sendMessage() {
    const messageInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const message = messageInput.value.trim();
    
    if (message) {
        feedbackSystem.showLoading(sendButton);
        
        try {
            chatHistory.addMessage(message, true);
            
            // Simulate bot response (replace with actual AI integration)
            const response = await getResponse(message);
            chatHistory.addMessage(response, false);
            
            feedbackSystem.showSuccess(sendButton);
            notificationSystem.show('Message sent successfully', 'success');
        } catch (error) {
            feedbackSystem.showError(sendButton);
            notificationSystem.show('Failed to send message', 'error');
            console.error('Error sending message:', error);
        } finally {
            feedbackSystem.hideLoading(sendButton);
            messageInput.value = '';
        }
    }
}

// File Upload Handler
function handleImageUpload(file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        notificationSystem.show('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.', 'error');
        return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        notificationSystem.show('File size too large. Maximum size is 5MB.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    // Show loading state
    const uploadBtn = document.querySelector('.action-btn[title="Upload Image"]');
    uploadBtn.classList.add('loading');
    uploadBtn.disabled = true;

    fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        displayMessage(data.response, false);
    })
    .catch(error => {
        console.error('Error uploading image:', error);
        notificationSystem.show(error.message || 'Failed to upload image', 'error');
    })
    .finally(() => {
        // Reset button state
        uploadBtn.classList.remove('loading');
        uploadBtn.disabled = false;
    });
}

// Voice Input Handler
let recognition = null;
let isRecording = false;

function initializeRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = languageManager.currentLanguage;

        recognition.onstart = () => {
            isRecording = true;
            toggleVoiceInputBtn.classList.add('active');
            notificationSystem.show('Recording started...', 'info');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            isRecording = false;
            toggleVoiceInputBtn.classList.remove('active');
            notificationSystem.show('Recording completed', 'success');
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            toggleVoiceInputBtn.classList.remove('active');
            notificationSystem.show('Speech recognition error: ' + event.error, 'error');
        };

        recognition.onend = () => {
            isRecording = false;
            toggleVoiceInputBtn.classList.remove('active');
        };
    } else {
        notificationSystem.show('Speech recognition is not supported in your browser', 'warning');
    }
}

function startVoiceInput() {
    if (!recognition) {
        initializeRecognition();
    }
    
    try {
        if (!isRecording) {
            recognition.start();
        }
    } catch (error) {
        console.error('Error starting voice input:', error);
        notificationSystem.show('Failed to start voice input', 'error');
    }
}

function stopVoiceInput() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        toggleVoiceInputBtn.classList.remove('active');
        notificationSystem.show('Recording stopped', 'info');
    }
}

// ... rest of the existing code ... 