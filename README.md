# Modern Chatbot Backend

Backend chatbot modern dengan fitur-fitur canggih seperti ChatGPT, menggunakan Node.js dan Express.js.

## Fitur

- 💬 Chat dengan AI menggunakan OpenAI API
- 🔍 Browsing untuk mencari informasi
- 🖼️ Analisis gambar menggunakan GPT-4 Vision
- 🎤 Input suara menggunakan Google Cloud Speech-to-Text
- 💭 Mode "Think" untuk menalar sebelum menjawab
- 🎨 Pilihan tema UI (Light, Dark, Pink, Neon)
- 🌐 Dukungan multi-bahasa
- 💾 Penyimpanan riwayat chat di MongoDB

## Teknologi yang Digunakan

- Node.js
- Express.js
- MongoDB
- OpenAI API
- Google Custom Search API
- Google Cloud Speech-to-Text
- Multer untuk upload file

## Instalasi

1. Clone repositori:
```bash
git clone <repository-url>
cd chatbot-backend
```

2. Instal dependensi:
```bash
npm install
```

3. Buat file `.env` dan isi dengan konfigurasi yang diperlukan:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo

# Google API Configuration
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_custom_search_engine_id

# Google Cloud Speech-to-Text Configuration
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_cloud_credentials.json

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/chatbot

# Server Configuration
PORT=3000
UPLOAD_DIR=uploads
```

4. Jalankan server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Chat Management
- `GET /api/chats` - Mendapatkan semua chat
- `POST /api/chats` - Membuat chat baru
- `GET /api/chats/:id` - Mendapatkan chat berdasarkan ID
- `POST /api/chats/:id/messages` - Mengirim pesan ke chat

### Fitur Tambahan
- `POST /api/analyze-image` - Upload dan analisis gambar
- `POST /api/speech-to-text` - Konversi suara ke teks

## Struktur Proyek

```
chatbot-backend/
├── models/
│   └── Chat.js
├── uploads/
├── .env
├── package.json
├── README.md
└── server.js
```

## Penggunaan

1. **Chat Normal**
```javascript
POST /api/chats/:id/messages
{
    "message": "Halo, apa kabar?",
    "mode": "normal"
}
```

2. **Chat dengan Mode Think**
```javascript
POST /api/chats/:id/messages
{
    "message": "Apa itu artificial intelligence?",
    "mode": "think"
}
```

3. **Chat dengan Mode Browse**
```javascript
POST /api/chats/:id/messages
{
    "message": "Berita terbaru tentang teknologi",
    "mode": "browse"
}
```

4. **Upload Gambar**
```javascript
POST /api/analyze-image
Content-Type: multipart/form-data
file: image.jpg
```

5. **Konversi Suara ke Teks**
```javascript
POST /api/speech-to-text
Content-Type: multipart/form-data
file: audio.wav
```

## Kontribusi

Silakan berkontribusi dengan membuat pull request atau melaporkan issues.

## Lisensi

MIT License 