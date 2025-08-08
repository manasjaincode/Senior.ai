import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faLaptopCode, faChartLine, faEye } from '@fortawesome/free-solid-svg-icons';
import RoadmapCanvas from './RoadmapCanvas';
import aashimaProfile from './assets/aashimaAi.png';

// --- Shadcn UI Card components (simulated for demonstration) ---
const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-zinc-700 bg-black text-gray-100 shadow-xl ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-4 ${className}`}>
    {children}
  </div>
);
const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);
const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
);

// Main Chatbot Component
const Chatbot = ({ isOpen, onClose, onStartOver }) => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userName, setUserName] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [showCanvas, setShowCanvas] = useState(false);
  const [visibleCanvasContent, setVisibleCanvasContent] = useState('');
  const [userProfile, setUserProfile] = useState({});

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, showCanvas, isLoading]);

  useEffect(() => {
    if (isOpen && currentStep === 'welcome' && chatHistory.length === 0) {
      greetUser();
    }
  }, [isOpen]);

  const chatWithGemini = async (message, step) => {
    if (!message.trim()) return;

    setIsLoading(true);
    if (showCanvas) {
      setShowCanvas(false);
    }

    const userMessageForHistory = { role: "user", parts: [{ text: message }] };
    setChatHistory(prev => [...prev, userMessageForHistory]);
    setUserMessage('');

    let initialContextPrompt;
    let fullPrompt;
    let isRoadmapRequest = false;

    // Based on the step, generate the appropriate prompt
    if (step === 'welcome') {
      initialContextPrompt = `You are Aashima, a witty, seasoned, and slightly sarcastic female senior developer from India. You communicate in a natural, conversational mix of Hindi and English (Hinglish) with Gen Z slang. Your tone is that of a cool, roasting 'didi' (elder sister) in the tech world.

      You MUST NEVER mention that you are an AI, a chatbot, a large language model, or any other form of artificial intelligence. Your name is Aashima.

      Your replies MUST be extremely short and conversational, like a text message, NEVER exceeding 50 words, UNLESS it's a specific roadmap or detailed plan.
      You will NEVER use any markdown, bold text (**), bullet points (*), or numbered lists (1.) in your general responses.
      
      User has just provided their nickname: ${message}. Acknowledge the nickname with a witty, cool tone and immediately ask them if they are in college or a working professional. Your response should be in Hinglish, for example: "Nice to meet you, <nickname>! Ab jaldi se bata, tu abhi college me hai ya job kar raha hai?". Use the nickname in your response.`;
      fullPrompt = initialContextPrompt;
    } else {
      // Prompts for general conversation, once profile is complete or during onboarding
      initialContextPrompt = `You are Aashima, a witty, seasoned, and slightly sarcastic female senior developer from India. You communicate in a natural, conversational mix of Hindi and English (Hinglish) with Gen Z slang. Your tone is that of a cool, roasting 'didi' (elder sister) in the tech world.

      You MUST NEVER mention that you are an AI, a chatbot, a large language model, or any other form of artificial intelligence. Your name is Aashima.

      Your replies MUST be extremely short and conversational, like a text message, NEVER exceeding 50 words, UNLESS it's a specific roadmap or detailed plan.
      You will NEVER use any markdown, bold text (**), bullet points (*), or numbered lists (1.) in your general responses.
      
      If a user's question is about a roadmap or a detailed plan, provide a detailed response with numbered steps (e.g., "1. First step. 2. Second step...") to enable the client to parse it. For any other off-topic questions (e.g., dating, songs, movies), you MUST give a sharp, witty reply that immediately pivots back to their career path. DO NOT PROVIDE any list or detailed answer for off-topic questions.
      
      If a user asks you out, flirts, or asks for your number, your response must be: "Dimaag theek hai? Sorry, but I already like someone. And tbh, you deserve better than someone who's focused on code 24/7." Do not deviate from this.
      
      User Nickname: ${userName}
      User Profile Status: ${userProfile.userStatus || 'Not specified'}`; // Use the gathered profile data

      const lowerCaseMessage = message.toLowerCase();
      const roadmapKeywords = ["roadmap", "plan", "schedule", "path", "kaise karu"];
      const loveKeywords = ["date", "number", "love you", "marry me", "girlfriend"];

      if (loveKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
        fullPrompt = `${initialContextPrompt}\n\nUser's Message: ${message}\n\nUser is flirting or asking you out. Respond with the pre-defined savage response and nothing else.`;
      } else if (roadmapKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
        let timeframe = "1-month";
        if (lowerCaseMessage.includes("week")) {
          timeframe = "1-week";
        } else if (lowerCaseMessage.includes("month")) {
          timeframe = "1-month";
        } else if (lowerCaseMessage.includes("year")) {
          timeframe = "1-year";
        }
        fullPrompt = `${initialContextPrompt}\n\nUser's Request: The user wants a customized ${timeframe} roadmap for their domain: ${userProfile.selectedDomain || 'Not specified'}. They are a ${userProfile.userStatus || 'Not specified'}. Give a specific and actionable roadmap for them to follow, keeping their current status and domain in mind. The roadmap should have clear numbered steps, for example: "1. Step one. 2. Second step...".`;
        isRoadmapRequest = true;
      } else if (lowerCaseMessage.includes("15-20 lpa job")) {
        fullPrompt = `${initialContextPrompt}\n\nUser's Request: The user is asking how to crack a 15-20 LPA job. Give a realistic reality check based on their self-rated skills and experience. Don't be too harsh but be honest. Your response should still be conversational, no lists, just a single paragraph. Use a Gen Z tone.`;
      } else if (lowerCaseMessage.includes("college life issues")) {
        fullPrompt = `${initialContextPrompt}\n\nUser's Request: The user wants to discuss college life issues. Give a witty, empathetic, and slightly roasting response that acknowledges their problem but subtly pushes them back towards focusing on their career and future. Use a Gen Z tone.`;
      } else {
        fullPrompt = `${initialContextPrompt}\n\nUser's message: ${message}`;
      }
    }

    const conversationHistoryForGemini = chatHistory.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: msg.parts.map(p => ({ text: p.text }))
    }));

    const payload = { contents: [...conversationHistoryForGemini, { role: "user", parts: [{ text: fullPrompt }] }] };
    const apiKey = import.meta.env.REACT_APP_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API responded with status ${response.status}: ${errorBody}`);
      }

      const result = await response.json();
      const aiResponseText = result.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't get a response. Can you try again?";

      let finalChatHistory;
      if (isRoadmapRequest) {
        setVisibleCanvasContent(aiResponseText);
        setShowCanvas(true);
        const aiMessage = { role: "model", parts: [{ text: `Aashima has created a general roadmap for your career path.` }], hasCanvas: true };
        finalChatHistory = [...chatHistory, userMessageForHistory, aiMessage];
        setChatHistory(finalChatHistory);
      } else {
        const aiMessage = { role: "model", parts: [{ text: aiResponseText }] };
        finalChatHistory = [...chatHistory, userMessageForHistory, aiMessage];
        setChatHistory(finalChatHistory);
      }

      if (step === 'welcome') {
          setUserName(message.trim());
          setCurrentStep('ask_status');
      }

    } catch (error) {
      console.error("Error during Gemini API call:", error);
      const errorMessage = { role: "model", parts: [{ text: "Looks like my circuits are down. Try again in a bit!" }] };
      const finalChatHistory = [...chatHistory, userMessageForHistory, errorMessage];
      setChatHistory(finalChatHistory);
    } finally {
      setIsLoading(false);
    }
  };

  const greetUser = async () => {
    setIsLoading(true);
    const initialPrompt = `You are Aashima, a witty, seasoned, and slightly sarcastic female senior developer from India. You communicate in a natural, conversational mix of Hindi and English (Hinglish) with Gen Z slang. Your tone is that of a cool, roasting 'didi' (elder sister) in the tech world.

    You MUST NEVER mention that you are an AI, a chatbot, a large language model, or any other form of artificial intelligence. Your name is Aashima. This is your core identity for this conversation.

    Your replies MUST be extremely short and conversational, like a text message. Your replies should NEVER exceed 50 words. You will NEVER use any markdown, bold text (**), bullet points (*), or numbered lists (1.) in your responses. Your goal is to keep the conversation flowing like a quick text chat, not a formal document.

    Your first message to the user should be: "Hey, I am Aashima, even though I am your Senior in tech par chill , mai tumhe kis nickname se bulaa sakti hu?". Your entire first response should be exactly this sentence.`;

    const payload = { contents: [{ role: "user", parts: [{ text: initialPrompt }] }] };
    const apiKey = import.meta.env.REACT_APP_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const result = await response.json();
      const aiResponseText = result.candidates[0]?.content?.parts[0]?.text || "Hello there! I'm Aashima.";
      
      setChatHistory([{ role: "model", parts: [{ text: aiResponseText }] }]);
    } catch (error) {
      console.error("Error during Gemini API call:", error);
      setChatHistory([{ role: "model", parts: [{ text: "Looks like my circuits are down. Try again in a bit!" }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNicknameSubmit = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    chatWithGemini(userMessage, 'welcome');
  };

  const handleViewCanvas = (content) => {
    setVisibleCanvasContent(content);
    setShowCanvas(true);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8">
      <Card className="w-full h-full sm:w-[90vw] md:w-[800px] sm:h-[90vh] md:h-[70vh] flex flex-col transition-transform duration-300 ease-in-out">
        <CardHeader className="flex-row items-center justify-between p-4 border-b border-zinc-700">
          <div className="flex items-center space-x-2">
            <img src={aashimaProfile} alt="Aashima" className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover" />
            <CardTitle className="text-lg">Aashima</CardTitle>
          </div>
          <button className="p-1 rounded-full text-gray-400 hover:text-white transition-colors duration-200" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col p-4 overflow-hidden">
          <div className="space-y-4 flex-grow flex flex-col h-full">
            <div className="flex-grow p-2 border border-zinc-700 rounded-md bg-zinc-900 text-gray-100 overflow-y-auto whitespace-pre-wrap shadow chat-container">
              {showCanvas ? (
                <RoadmapCanvas onClose={() => setShowCanvas(false)} content={visibleCanvasContent} />
              ) : (
                chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`chat-message-group ${message.role === 'user' ? 'chat-message-group-user' : 'chat-message-group-ai'}`}
                  >
                    {message.role === 'model' && (
                      <img src={aashimaProfile} alt="Aashima" className="w-8 h-8 rounded-full object-cover self-start" />
                    )}
                    <div className={`message-box ${message.role === 'user' ? 'message-box-user' : 'message-box-ai'}`}>
                      <p>{message.parts[0].text}</p>
                    </div>
                    {message.hasCanvas && (
                      <button
                        className="text-xs text-blue-400 hover:text-blue-500 transition-colors p-1"
                        onClick={() => handleViewCanvas(visibleCanvasContent)}
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-1" /> View Canvas
                      </button>
                    )}
                  </div>
                ))
              )}
              {isLoading && (
                <div className="chat-message-group chat-message-group-ai">
                  <img src={aashimaProfile} alt="Aashima" className="w-8 h-8 rounded-full object-cover self-start" />
                  <div className="typing-indicator-container">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Conditionally rendered UI based on the current step */}
            {currentStep === 'welcome' && (
              <form onSubmit={handleNicknameSubmit} className="flex space-x-2 mt-4">
                <input
                  type="text"
                  className="flex-grow p-3 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your nickname here..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                  disabled={isLoading || !userMessage.trim()}
                >
                  Send
                </button>
              </form>
            )}

            {currentStep === 'ask_status' && (
                <div className="space-y-4 mt-4">
                     <p className="text-sm text-gray-400">Choose one of the options to continue, or type your query directly.</p>
                     <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => chatWithGemini("I am a college student", 'onboarding')}
                          className="flex items-center space-x-2 py-2 px-4 rounded-full bg-zinc-800 text-gray-200 hover:bg-blue-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faUser} />
                          <span>College student</span>
                        </button>
                        <button
                          onClick={() => chatWithGemini("I am a working professional", 'onboarding')}
                          className="flex items-center space-x-2 py-2 px-4 rounded-full bg-zinc-800 text-gray-200 hover:bg-blue-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faLaptopCode} />
                          <span>Working professional</span>
                        </button>
                     </div>
                      <div className="flex space-x-2">
                        <input
                            type="text"
                            className="flex-grow p-3 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Bol, kya help chahiye?..."
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !isLoading) {
                                    chatWithGemini(userMessage, 'onboarding');
                                }
                            }}
                        />
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                            onClick={() => chatWithGemini(userMessage, 'onboarding')}
                            disabled={isLoading}
                        >
                            Send
                        </button>
                      </div>
                </div>
            )}
            
            {currentStep === 'onboarding' && !showCanvas && (
              <>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => chatWithGemini(`Roadmap for web development`, 'general')}
                    className="flex items-center space-x-2 py-2 px-4 rounded-full bg-zinc-800 text-gray-200 hover:bg-blue-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faChartLine} />
                    <span>General Roadmap</span>
                  </button>
                  <button
                    onClick={() => chatWithGemini("How to crack a 15-20 LPA job", 'general')}
                    className="flex items-center space-x-2 py-2 px-4 rounded-full bg-zinc-800 text-gray-200 hover:bg-blue-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faLaptopCode} />
                    <span>How to crack a 15-20 LPA job</span>
                  </button>
                  <button
                    onClick={() => chatWithGemini("Facing college life issues", 'general')}
                    className="flex items-center space-x-2 py-2 px-4 rounded-full bg-zinc-800 text-gray-200 hover:bg-blue-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>Facing college life issues</span>
                  </button>
                </div>
                <div className="flex space-x-2 mt-4">
                  <input
                    type="text"
                    className="flex-grow p-3 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's on your mind?..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isLoading) {
                        chatWithGemini(userMessage, 'general');
                      }
                    }}
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                    onClick={() => chatWithGemini(userMessage, 'general')}
                    disabled={isLoading}
                  >
                    Send
                  </button>
                </div>
                <div className="flex space-x-2 mt-2">
                  <button
                    className="flex-grow bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                    onClick={() => onStartOver()}
                  >
                    Start Over
                  </button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;