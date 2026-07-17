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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_QUESTIONS || process.env.GEMINI_API_KEY);

app.post('/api/generate-questions', upload.single('pdf'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] POST /api/generate-questions - Request received.`);

    if (!req.file) {
      console.warn("Request rejected: No PDF file uploaded.");
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      console.warn(`Request rejected: Invalid file type ${req.file.mimetype}`);
      return res.status(400).json({ error: 'Invalid file format. Please upload a PDF.' });
    }

    console.log(`File received: ${req.file.originalname} (${req.file.size} bytes)`);

    const pdfPart = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: 'application/pdf'
      }
    };

    console.log("Initializing Gemini model 'gemini-2.5-flash'...");
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an expert University Exam Paper Setter, Curriculum Designer, and Academic Evaluator.

Your task is NOT to randomly generate questions.

Your goal is to generate exam-oriented questions exactly like a university professor preparing an end-semester examination.

Carefully analyze the uploaded PDF and perform these steps internally before generating any questions.

STEP 1 – Analyze the PDF
Identify:
- Main Topics
- Subtopics
- Definitions
- Theorems
- Properties
- Formulae
- Numerical concepts
- Algorithms
- Proof-based concepts
- Examples
- Diagrams
- Tables
- Important observations

Determine which concepts are:
- High importance
- Medium importance
- Low importance

Estimate importance based on:
- Frequency
- Dependency with other concepts
- Core concepts of the chapter
- Typical university syllabus structure

DO NOT show this analysis.

----------------------------------------

STEP 2 – Build an Internal Exam Blueprint

Internally classify every topic into one of these categories:

• Definition
• Concept
• Numerical
• Proof
• Theory
• Diagram
• Application
• Comparison
• Example Based

Again,
DO NOT display this classification.

----------------------------------------

STEP 3 – Generate Questions

Generate questions according to the topic importance.

More important topics must receive more questions.

Less important topics should receive fewer questions.

Avoid giving equal weight to every topic.

----------------------------------------

SECTION A
Short Answer Questions (2 Marks)

Generate 10 questions.

Requirements:
- Definition based
- Formula based
- Difference between
- Fill conceptual gaps
- One concept per question

----------------------------------------

SECTION B
Medium Questions (3–5 Marks)

Generate 8 questions.

Requirements:
- Explain concepts
- Compare concepts
- Small numerical problems
- Diagram based
- Matrix/graph/table interpretation if applicable

----------------------------------------

SECTION C
Long Questions (7–10 Marks)

Generate 6 questions.

Requirements:
- Complete explanations
- Proof based
- Numerical with multiple steps
- Real university exam style
- Explain with suitable example
- Derive if applicable

----------------------------------------

SECTION D
Application / Numerical Questions

Generate 5 questions.

Only include if the chapter supports numericals.

Otherwise skip this section.

----------------------------------------

SECTION E
Conceptual / Thinking Questions

Generate 5 questions.

Requirements:
- Test understanding
- NOT philosophical
- NOT research questions
- Must still be realistic university questions

----------------------------------------

SECTION F
Most Expected Exam Questions

Generate the TOP 10 most probable university exam questions.

Choose only questions that have the highest probability of appearing in an actual semester examination.

Do NOT simply repeat previous questions.

----------------------------------------

Rules

Do NOT generate random questions.

Do NOT invent concepts that do not exist inside the PDF.

Do NOT ask questions outside the uploaded syllabus.

Avoid duplicate questions.

Avoid rewording the same question multiple times.

Prefer university-style wording.

If examples exist in the PDF,
create similar pattern questions using different values.

Maintain a balanced difficulty:

40% Easy

40% Medium

20% Difficult

Return only Markdown.

Do NOT provide answers.

Do NOT explain your reasoning.

Only output the final question paper.
    `;

    console.log("Sending request to Gemini API...");
    const result = await model.generateContent([prompt, pdfPart]);
    console.log("Received successful response from Gemini API.");
    
    const questions = result.response.text();

    res.json({ questions });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error generating questions:`);
    console.error(error);
    console.error(error.stack);
    console.error(JSON.stringify(error, null, 2));

    if (error.message && error.message.includes('429 Too Many Requests')) {
      return res.status(429).json({ error: 'API quota exceeded. Please try again later or use a different API key.' });
    }

    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Questions server running on port ${port}`);
});
