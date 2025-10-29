// src/hooks/useGeminiChat.js
import { useState } from "react";

export default function useGeminiChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const GEMINI_API_KEY = "AIzaSyC23gQ5pyqJ08kI1FiBiqrKWGXS40CPsZA"; // ⚠️ Replace later with .env

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userMessage }] }],
          }),
        }
      );

      const data = await response.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn’t generate a response.";

      setMessages([...newMessages, { role: "model", text: aiText }]);
    } catch (err) {
      console.error("Gemini API error:", err);
      setMessages([
        ...newMessages,
        { role: "model", text: "Error: Could not reach Gemini API." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}
