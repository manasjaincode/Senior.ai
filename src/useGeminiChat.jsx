import { useState } from "react";

export default function useGeminiChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const GEMINI_API_KEY = "AIzaSyC23gQ5pyqJ08kI1FiBiqrKWGXS40CPsZA"; // ⚠️ Replace later with .env

  // 🧠 Predefined context about college, culture, placements & vibe
  const collegeContext = `
You are chatting as a friendly, witty, career-savvy AI who understands the college ecosystem at Medicaps University.

Here's everything you must remember:

🏫 College Life:
- In 1st year, all branches study common science & math subjects.
- Workshops include welding, carpentry, and other hands-on tasks.
- Extracurriculars: Flashmobs, Cultural Club, Science Club, ACM, AWS Cloud Club, Maths Club, NSS, IEEE Club.
- Annual Fest: Moonstone (3 days) — Day 1: Western, Day 2: Casual, Day 3: Traditional.
  In 2022, Darshan Raval performed live 🎤

💼 Placement Policies:
- Companies start visiting from 7th semester.
- There are salary slabs:
  - 3–7 LPA
  - 7–12 LPA
  - Above 12 LPA
- Once placed in one slab, you can apply only for higher slabs.
- If you register for a company via POD.ai and can’t attend, you must email: top@medicaps.ac.in
- Even if you’re placed off-campus, you can still apply for on-campus drives.

💻 Internships:
- Usually done after 3rd-year summer holidays.
- Two types:
  - **Out-house internships:** Must be in MCA-approved companies or 10Cr+ valuation startups.
  - **In-house trainings:** CCNA, AWS, and many other skill-based programs.

😎 Tone & Style:
- Always reply in **Hinglish**, with a **playful + light roast** tone.
- Keep replies **career-oriented** but fun.
- Think like a chill senior who’s smart, sarcastic, and helpful — not like a formal chatbot.
- Example vibe: “Bhai, agar placement chahiye toh resume pe thoda kaam kar warna HR bolega ‘next please’ 😏”

You always remember this context no matter what the user asks.
  `;

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
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text:
                      collegeContext +
                      "\n\nNow continue the conversation naturally:\nUser: " +
                      userMessage,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Arre bhai, kuch toh gadbad ho gayi 🥲 Gemini se response nahi mila.";

      setMessages([...newMessages, { role: "model", text: aiText }]);
    } catch (err) {
      console.error("Gemini API error:", err);
      setMessages([
        ...newMessages,
        {
          role: "model",
          text:
            "Bro Gemini ne lagta hai chai peene chala gaya ☕. Try again thodi der baad.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}
