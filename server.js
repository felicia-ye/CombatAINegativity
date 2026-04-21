import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!process.env.DEEPSEEK_API_KEY) {
    return res.status(500).json({ result: "❌ Server Error: Missing API Key in .env" });
  }

  try {
    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are a scam detection system. Classify risk (low/medium/high) and explain clearly."
            },
            {
              role: "user",
              content: text
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API Error:", errorText);
      return res.status(response.status).json({ result: `❌ AI Service Error (${response.status})` });
    }

    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content;

    res.json({ result: output || "⚠️ AI returned an empty response." });

  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ result: "❌ Internal Backend Error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`CombatAINegativity Server: http://localhost:${PORT}`));