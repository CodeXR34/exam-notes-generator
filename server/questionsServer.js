const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.QUESTIONS_PORT || 5001;

const allowedOrigins = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_QUESTIONS);

app.post('/api/generate-questions', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const pdfPart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: 'application/pdf'
      }
    };

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an expert exam paper setter. Analyze the attached PDF and generate exam-style practice questions for a college student.

Generate the following:

## Short Answer Questions (2 marks each)
- 8 to 10 questions
- Direct, definition-based or formula-based
- Each question on a new bullet point

## Long Answer Questions (5–10 marks each)
- 5 to 6 questions
- Conceptual, application-based, or explain-with-example type
- Each question on a new bullet point

## Tricky / Thinking Questions
- 3 to 4 questions that require deeper understanding
- These should not be directly answerable from reading alone

## Most Likely Exam Questions
- List the top 5 questions most likely to appear in a university exam based on this content

Do NOT provide answers. Output only the questions in clean Markdown format.
    `;

    const result = await model.generateContent([prompt, pdfPart]);
    const questions = result.response.text();

    res.json({ questions });

  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Questions server running on port ${port}`);
});
