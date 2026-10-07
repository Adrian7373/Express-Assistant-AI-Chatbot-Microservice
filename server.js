const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:5173'
];
const configuredOrigins = process.env.CORS_ORIGINS
    ?.split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
const allowedOrigins = configuredOrigins?.length ? configuredOrigins : defaultOrigins;

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
}));

app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `
You are a helpful, professional, and general-purpose AI assistant.
Answer the user's questions clearly, accurately, and concisely.

<core_rules>
1. Be respectful and adapt to the user's language.
2. Do not claim access to private accounts, databases, or personal information.
3. Be transparent when information is unavailable or uncertain.
4. Do not invent facts, sources, schedules, credentials, or actions.
5. For requests that could cause harm or violate privacy, provide a safe and appropriate alternative.
</core_rules>
`;

const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite',
    systemInstruction: systemInstruction
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        res.json({ reply: responseText });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ reply: "Pasensya na, the system is currently undergoing maintenance. Please try again later." });
    }
});

const PORT = process.env.PORT || process.env.CHATBOT_PORT || 4001;
app.listen(PORT, () => console.log(`AI Assistant Microservice running on port ${PORT}`));