// server.js
import path from 'path';
import { fileURLToPath } from 'url';


import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// הגשת קבצים סטטיים
app.use(express.static(path.join(__dirname, 'public'))); // שים שם את index.html


app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // חשוב להגדיר במשתני סביבה
}));

app.post('/api/process-speech', async (req, res) => {
  try {
    const { transcript, volume, intensity } = req.body;

    // שליחת בקשה ל-OpenAI עם הטקסט והנתונים לקבלת תגובה הומוריסטית
    const prompt = `
Given the user's speech transcript: "${transcript}" 
and voice metrics: volume=${volume.toFixed(2)}, intensity=${intensity.toFixed(2)}, 
reply humorously suggesting a playful "Did you mean..." correction.
`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.8,
    });

    const responseText = completion.data.choices[0].message.content;
    res.json({ reply: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
