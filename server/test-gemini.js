const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  console.log("Testing API key from .env:", process.env.GEMINI_API_KEY ? "Key loaded" : "Key NOT loaded");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Using gemini-2.5-flash as configured in index.js
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  try {
    const result = await model.generateContent("Reply with OK");
    console.log("SUCCESS");
    console.log("Response text:", result.response.text());
  } catch (error) {
    console.log("ERROR");
    console.log("Error message:", error.message);
    if (error.status) {
      console.log("HTTP status code:", error.status);
    } else {
       // if not in error.status, try to extract it
       console.log("Error status:", error.status || "N/A");
    }
  }
}

testGemini();
