# 🧠 NLP Text Analyzer

A full-stack AI-powered text analysis app built with **Next.js**, **Tailwind CSS**, and **Ollama (Llama 3.2)** — running 100% locally, completely free.

---

## 📸 What It Does

Paste any text and the app will analyze it and return:

- **Sentiment** — positive, negative, neutral, or mixed
- **Sentiment Score** — a number from -1.0 to 1.0
- **Tone** — e.g. enthusiastic, formal, skeptical
- **Key Themes** — main topics in the text
- **Entities** — people, places, organizations mentioned
- **Summary** — one sentence summary

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + React |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| AI Model | Llama 3.2 via Ollama |
| Cost | 100% Free |

---

## 📁 Project Structure

```
nlp-analyzer/
├── app/
│   ├── page.js              # Entry point — loads the Analyzer component
│   ├── layout.js            # Wraps every page
│   └── api/
│       └── analyze/
│           └── route.js     # Backend API route — talks to Ollama
├── components/
│   └── Analyzer.jsx         # Main UI component
├── .env.local               # Environment variables (never commit this)
└── README.md
```

---

## ⚙️ How It Works

```
Browser (Analyzer.jsx)
    ↓  POST /api/analyze  { text: "..." }
Next.js Backend (route.js)
    ↓  POST http://localhost:11434/api/generate
Ollama (Llama 3.2 — running locally)
    ↓  returns JSON analysis
Next.js Backend
    ↓  parses + returns JSON
Browser
    ↓  displays results
```

---

## 🚀 Getting Started

### 1. Install Ollama

Download from [ollama.com](https://ollama.com) and install it.

### 2. Download the AI Model

```bash
ollama pull llama3.2
```

### 3. Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/nlp-analyzer.git
cd nlp-analyzer
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> ⚠️ Make sure Ollama is running in the background before starting the app.

---

## 🐳 Docker

Build and run the app in Docker:

```bash
docker compose up --build
```

Then open [http://localhost:3000](http://localhost:3000).

Notes:

- The container expects Ollama to be running on your host machine by default.
- `docker-compose.yml` points `OLLAMA_BASE_URL` to `http://host.docker.internal:11434`.
- On first use, make sure the model exists on the host:

```bash
ollama pull llama3.2
ollama serve
```

- If you want to use Gemini instead, keep `GEMINI_API_KEY` in `.env.local` before starting Docker.
- SQLite data is persisted through the `./data` bind mount.

---

## 💡 Key Concepts Learned

- **NLP** — teaching computers to understand human language
- **Prompt Engineering** — how you instruct an AI model affects its output
- **API Routes** — Next.js backend that acts as a secure middleman
- **React State** — `useState` to manage UI data
- **Local AI** — running models on your own machine with Ollama

---

## 🔮 Possible Extensions

- [ ] History — save past analyses
- [ ] Compare two texts side by side
- [ ] Color-coded sentiment indicators
- [ ] Export results as PDF
- [ ] Word frequency chart

---

## 📄 License

MIT — free to use and modify.
