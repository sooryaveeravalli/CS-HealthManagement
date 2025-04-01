import express, { response } from "express";
import { OpenAI } from "openai"; // Make sure you're importing the right OpenAI SDK
import axiosDebug from "axios-debug-log"; // Optional: for logging requests
import axios from "axios";
import { exec } from "child_process";

const modelName = "gpt-4o";
const endpoint = "https://models.inference.ai.azure.com";

const router = express.Router();


router.post("/", async (req, res) => {
    console.log("Chat request received...");
    const token = process.env.OPENAI_API_KEY;
    try {
        const { message } = req.body;
        console.log("Message:", message);

        const client = new OpenAI({ baseURL: endpoint, apiKey: token });

        const response = await client.chat.completions.create({
          messages: [
              { role:"system", content: "You are a virtual healthcare assistant. Ask patients relevant questions, provide preliminary assessments, and suggest self-care tips. If symptoms are serious, recommend visiting a doctor or scheduling an appointment."},
              { role:"user", content: `Patient symptoms: ${message}. Give a summary, potential causes, and next steps in a structured format.` }
            ],
            temperature: 0.7,
            top_p: 1.0,
            max_tokens: 1000,
            model: modelName
          });
      
          console.log(response.choices[0].message.content);

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("Error communicating with OpenAI:", error.response?.data || error.message);
        console.error(error);
        res.status(500).json({ error: "ChatGPT error" });
    }
});

export default router;