# AI Assistant Chatbot Microservice

A generic Express.js microservice that provides a conversational AI assistant through a simple HTTP API. It can be embedded in web applications through the included React chatbot widget.

## Technology

- Node.js
- Express
- Google Generative AI
- CORS
- dotenv

## Running locally

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
CHATBOT_PORT=4001
```

Start the service:

```bash
npm start
```

The default local address is `http://localhost:4001`.

Never commit `.env` or expose API keys. Environment files and installed dependencies are excluded by `.gitignore`.

## API

### Health check

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

The React widget calls this endpoint when it mounts. This can wake a sleeping hosting service before the user sends a chat message.

### Chat

```http
POST /api/chat
Content-Type: application/json
```

Request:

```json
{
  "message": "How can you help me?",
  "history": []
}
```

Response:

```json
{
  "reply": "I can help answer questions and assist with a variety of tasks."
}
```

The optional `history` array uses the conversation format expected by Gemini:

```json
[
  {
    "role": "user",
    "parts": [{ "text": "Hello" }]
  },
  {
    "role": "model",
    "parts": [{ "text": "Hello! How can I help?" }]
  }
]
```

## Frontend configuration

The widget reads `REACT_APP_CHATBOT_API_URL` and falls back to the local service:

```env
REACT_APP_CHATBOT_API_URL=https://your-service-name.onrender.com
```

The widget sends a `GET /health` request on mount and chat messages to `POST /api/chat`.

## Project files

- `server.js` - Express server, Gemini integration, generic assistant instructions, health endpoint, and chat endpoint
- `ChatbotWidget.jsx` - React chat widget, service wake-up request, and conversation history
- `package.json` - Node.js dependencies and start script
- `.env` - Local secrets and configuration; ignored by Git
- `.gitignore` - Excludes secrets, dependencies, logs, build output, and local editor files
