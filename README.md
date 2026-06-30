# 📚 Exam Booster AI

Exam Booster AI is a powerful full-stack web application designed to help college students prepare for exams. By simply uploading a study document or textbook chapter in PDF format, the app uses Google's advanced **Gemini 2.5 Flash API** to automatically generate highly structured, exam-oriented revision notes. 

## ✨ Features

- **📄 PDF Processing:** Upload your college PDFs easily.
- **🧠 AI-Powered Summaries:** Generates student-friendly revision notes using Google Gemini AI.
- **🎯 Exam-Oriented Structure:** Notes are specifically structured with Definitions, Properties, Formulas, Exam Tips, and Common Mistakes.
- **⚡ Last-Minute Revision:** Automatically creates a "Chapter Snapshot", "Formula Bank", and "Emergency Exam Recall" for quick prep.
- **📥 Export to PDF:** Download your AI-generated revision notes beautifully formatted as a PDF.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Axios (API requests)
- React Markdown (Rendering AI output)
- html2pdf.js (Exporting notes to PDF)

**Backend:**
- Node.js & Express.js
- Google Generative AI SDK (`@google/generative-ai`)
- Multer (In-memory file uploads)
- PDF-Parse

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js installed on your machine
- A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Clone the repository
```bash
git clone https://github.com/your-username/exam-booster-ai.git
cd exam-booster-ai
```

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and add your API key
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env

# Start the backend server
node index.js
```
The backend server will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window/tab:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will typically run on `http://localhost:5173`. Open this URL in your browser to start using the app!

## 📁 Project Structure

```text
📦 exam-booster-ai
 ┣ 📂 backend           # Express server and AI integration
 ┃ ┣ 📜 index.js        # Main server logic and Gemini prompt
 ┃ ┣ 📜 .env            # Environment variables (API Key)
 ┃ ┗ 📜 package.json    # Backend dependencies
 ┣ 📂 frontend          # React user interface
 ┃ ┣ 📂 src             # React components and logic
 ┃ ┣ 📜 index.html      # Vite entry point
 ┃ ┗ 📜 package.json    # Frontend dependencies
 ┗ 📜 README.md         # Project documentation
```

## 🔒 Security
- The `.env` files containing sensitive API keys are correctly added to `.gitignore` and are not exposed in the codebase.
