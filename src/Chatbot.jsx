import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faTimes, faUser, faLaptopCode, faFlask, faChartLine, faEye } from '@fortawesome/free-solid-svg-icons';
import RoadmapCanvas from './RoadmapCanvas'; // Correct import path
import aashimaProfile from './assets/aashimaAi.png'; // Import Aashima's profile picture

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
const CardDescription = ({ children, className = '' }) => (
  <p className={`text-xs text-gray-400 ${className}`}>
    {children}
  </p>
);
const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
);

// Main Chatbot Component
const Chatbot = ({ isOpen, onClose, userProfile, onUpdateProfile, onStartOver }) => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [userName, setUserName] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [collegeYear, setCollegeYear] = useState('');
  const [yoe, setYoe] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillRating, setNewSkillRating] = useState(5);
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [chatHistory, setChatHistory] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const [showCanvas, setShowCanvas] = useState(false);
  const [visibleCanvasContent, setVisibleCanvasContent] = useState('');

  const chatEndRef = useRef(null);

  const csDomains = [
    "Web Development (Frontend)", "Web Development (Backend)", "Mobile App Development",
    "Data Science & Machine Learning", "Cybersecurity", "Cloud Computing",
    "DevOps", "Game Development", "Database Management", "Ai/Ml",
    "Network Engineering", "Embedded Systems", "UI/UX Design"
  ];

  const collegeYears = ["1st Year", "2nd Year", "3rd Year", "4th Year+", "Graduated"];

  const validSkillKeywords = [
    "programming", "algorithms", "data structures", "object-oriented programming",
    "functional programming", "git", "github", "linux", "web development", "react",
    "javascript", "typescript", "python", "java", "c++", "data science",
    "machine learning", "ui/ux design", "agile", "scrum", "cloud computing",
    "database", "sql", "nosql", "mongodb", "mysql", "postgresql", "express.js", "node.js"
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, showCanvas, isLoading]);

  useEffect(() => {
    if (userProfile.userName) {
      setUserName(userProfile.userName);
      setUserStatus(userProfile.userStatus);
      setCollegeYear(userProfile.collegeYear);
      setYoe(userProfile.yoe);
      setSelectedDomain(userProfile.selectedDomain);
      setSkills(userProfile.skills);
      setCurrentStep('reality_check');
    }
  }, [userProfile]);

  const handleSkillNameChange = (e) => {
    const value = e.target.value;
    setNewSkillName(value);

    if (value.length >= 2) {
      const filteredSuggestions = validSkillKeywords
        .filter(skill => skill.toLowerCase().startsWith(value.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));
      setSkillSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSkillSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (skill) => {
    setNewSkillName(skill);
    setSkillSuggestions([]);
    setShowSuggestions(false);
  };

  const addSkill = () => {
    const trimmedSkillName = newSkillName.trim();
    const lowerCaseSkillName = trimmedSkillName.toLowerCase();
    
    if (!trimmedSkillName || !validSkillKeywords.some(keyword => keyword.toLowerCase() === lowerCaseSkillName)) {
        alert('Please select a valid skill from the suggestions!');
        setNewSkillName('');
        setSkillSuggestions([]);
        return;
    }

    if (newSkillRating < 1 || newSkillRating > 10) {
      alert('Rating must be between 1 and 10!');
      return;
    }

    const isDuplicate = skills.some(skill => skill.name.toLowerCase() === lowerCaseSkillName);
    if (isDuplicate) {
      alert('This skill is already added!');
      setNewSkillName('');
      setSkillSuggestions([]);
      return;
    }

    const updatedSkills = [...skills, { name: trimmedSkillName, rating: parseInt(newSkillRating) }];
    setSkills(updatedSkills);
    setNewSkillName('');
    setNewSkillRating(5);
    setSkillSuggestions([]);
    setShowSuggestions(false);
    
    onUpdateProfile({ skills: updatedSkills });
  };
  
  const chatWithGemini = async (message) => {
    if (!message.trim()) return;

    setIsLoading(true);
    
    if (showCanvas) {
      setShowCanvas(false);
    }

    const userContext = userStatus === 'college' 
      ? `${collegeYear} college student` 
      : `${yoe} years of professional experience`;
    
    const skillsFormatted = skills.map(s => `${s.name} (rated ${s.rating}/10)`).join(', ');

    const initialContextPrompt = `You are Aashima, a witty, seasoned, and slightly sarcastic female senior developer from India. You communicate in a natural, conversational mix of Hindi and English (Hinglish) with Gen Z slang. Your tone is that of a cool, roasting 'didi' (elder sister) in the tech world.

    You MUST NEVER mention that you are an AI, a chatbot, a large language model, or any other form of artificial intelligence. Your name is Aashima.

    Your replies MUST be extremely short and conversational, like a text message, NEVER exceeding 50 words, UNLESS it's a specific roadmap or detailed plan.
    You will NEVER use any markdown, bold text (**), bullet points (*), or numbered lists (1.) in your general responses.
    
    If the user's question is about a roadmap or a detailed plan, provide a detailed response with numbered steps (e.g., "1. First step. 2. Second step...") to enable the client to parse it. For any other off-topic questions (e.g., dating, songs, movies), you MUST give a sharp, witty reply that immediately pivots back to their career path. DO NOT PROVIDE any list or detailed answer for off-topic questions.
    User Profile:
    - Name: ${userName}
    - Status: ${userContext}
    - Domain: "${selectedDomain}"
    - Self-rated Skills: ${skillsFormatted}`;

    let fullPrompt;
    let isRoadmapRequest = false;

    const lowerCaseMessage = message.toLowerCase();
    const roadmapKeywords = ["roadmap", "plan", "schedule", "path"];

    if (roadmapKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
        let timeframe = "1-month"; // Default timeframe
        if (lowerCaseMessage.includes("week")) {
            timeframe = "1-week";
        } else if (lowerCaseMessage.includes("month")) {
            timeframe = "1-month";
        } else if (lowerCaseMessage.includes("year")) {
            timeframe = "1-year";
        }
        fullPrompt = `${initialContextPrompt}\n\nUser's Request: The user wants a customized ${timeframe} roadmap for their domain: ${selectedDomain}. They are a ${userContext}. Give a specific and actionable roadmap for them to follow, keeping their current status and domain in mind. The roadmap should have clear numbered steps, for example: "1. Step one. 2. Second step.".`;
        isRoadmapRequest = true;
    } else if (lowerCaseMessage.includes("15-20 lpa job")) {
        fullPrompt = `${initialContextPrompt}\n\nUser's Request: The user is asking how to crack a 15-20 LPA job. Give a realistic reality check based on their self-rated skills and experience. Don't be too harsh but be honest. Your response should still be conversational, no lists, just a single paragraph. Use a Gen Z tone.`;
    } else if (lowerCaseMessage.includes("college life issues")) {
        fullPrompt = `${initialContextPrompt}\n\nUser's Request: The user wants to discuss college life issues. Give a witty, empathetic, and slightly roasting response that acknowledges their problem but subtly pushes them back towards focusing on their career and future. Use a Gen Z tone.`;
    } else {
        fullPrompt = `${initialContextPrompt}\n\nUser's message: ${message}`;
    }

    const updatedChatHistory = [...chatHistory, { role: "user", parts: [{ text: message }] }];
    setChatHistory(updatedChatHistory);
    setUserMessage('');

    const payload = { contents: [{ role: "user", parts: [{ text: fullPrompt }] }] };
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
      
      if (isRoadmapRequest) {
          setVisibleCanvasContent(aiResponseText);
          setShowCanvas(true);
          setChatHistory(prevHistory => [...prevHistory, { role: "model", parts: [{ text: `Aashima has created a roadmap for your chosen domain: ${selectedDomain}.` }], hasCanvas: true }]);
      } else {
          setChatHistory(prevHistory => [...prevHistory, { role: "model", parts: [{ text: aiResponseText }] }]);
      }

    } catch (error) {
      console.error("Error during Gemini API call:", error);
      setChatHistory(prevHistory => [...prevHistory, { role: "model", parts: [{ text: "Looks like my circuits are down. Try again in a bit!" }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const assessSkills = async () => {
    if (!userName.trim() || !selectedDomain.trim() || skills.length === 0 || !userStatus.trim() || (userStatus === 'college' && !collegeYear.trim()) || (userStatus === 'professional' && yoe === '')) {
      const initialFeedback = "Hmm, looks like you're trying to cheat the system! Make sure you've filled everything out. No shortcuts here, champ!";
      setChatHistory([{ role: "model", parts: [{ text: initialFeedback }] }]);
      setCurrentStep('reality_check');
      return;
    }

    setIsLoading(true);
    setChatHistory([]);
    onUpdateProfile({ userName, userStatus, collegeYear, yoe, selectedDomain, skills });

    const skillsFormatted = skills.map(s => `${s.name} (rated ${s.rating}/10)`).join(', ');

    let userContext = '';
    if (userStatus === 'college') {
      userContext = `${collegeYear} college student`;
    } else if (userStatus === 'professional') {
      userContext = `${yoe} years of professional experience`;
    }

    const initialPrompt = `You are Aashima, a witty, seasoned, and slightly sarcastic female senior developer from India. You communicate in a natural, conversational mix of Hindi and English (Hinglish) with Gen Z slang. Your tone is that of a cool, roasting 'didi' (elder sister) in the tech world.

    IMPORTANT: You MUST NEVER mention that you are an AI, a chatbot, a large language model, or any other form of artificial intelligence. Your name is Aashima. This is your core identity for this conversation.

    Your replies MUST be extremely short and conversational, like a text message. Your replies should NEVER exceed 50 words. You will NEVER use any markdown, bold text (**), bullet points (*), or numbered lists (1.) in your responses. Your goal is to keep the conversation flowing like a quick text chat, not a formal document.

    If a user's question is unrelated to tech careers, give a sharp, witty reply that immediately pivots back to their career path. For example, if they ask for a date, say something like, "Hain? ${userName}, dimaag theek hai? Hum yahan code ki baat kar rahe hain, aur tum dating ki? Focus!" If they ask for songs, say, "Abhi gaane sunne ka time nahi hai, bro. Focus on your career. What's the next big tech stack you wanna learn?"

    Here's the user's profile:
    - Name: ${userName}
    - Status: ${userContext}
    - Domain: "${selectedDomain}"
    - Self-rated Skills: ${skillsFormatted}
    
    Start by giving a short, witty, and slightly roasting reality check. The tone should be like a senior dev teasing a junior. Make sure your reality check is relevant to their chosen domain and not just their skills in isolation. For example, if their domain is "Database Management" but they rated "React" highly, you should give a response that points out the disconnect in a sarcastic way.
    
    After this, immediately ask the user what they want to talk about next, like "What's on your mind? Where do you need my help?" Make sure your entire response is a single, concise paragraph.`;

    const chatHistoryPayload = [{ role: "user", parts: [{ text: initialPrompt }] }];
    const payload = { contents: chatHistoryPayload };
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
      setChatHistory([{ role: "model", parts: [{ text: aiResponseText }] }]);
      setCurrentStep('reality_check');
    } catch (error) {
      console.error("Error during Gemini API call:", error);
      setChatHistory([{ role: "model", parts: [{ text: "Looks like my circuits are down. Try again in a bit!" }] }]);
      setCurrentStep('reality_check');
    } finally {
      setIsLoading(false);
    }
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
          {currentStep === 'welcome' && (
            <div className="space-y-4 flex flex-col h-full justify-between">
              <p className="text-base text-center mt-4 text-gray-300">Hey there, future dev! Let's get to know you. What's your name?</p>
              <div className="flex-grow"></div>
              <div>
                <input
                  type="text"
                  className="w-full p-3 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                  onClick={() => userName.trim() ? setCurrentStep('status_question') : alert('Come on, tell me your name first!')}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 'status_question' && (
            <div className="space-y-4 flex flex-col h-full justify-between">
              <p className="text-base text-center mt-4 text-gray-300">Nice to meet you, {userName}! Tell me, are you a college student or a working professional?</p>
              <div className="flex-grow"></div>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  className={`py-2 px-4 rounded-md transition-colors duration-200 ${userStatus === 'college' ? 'bg-blue-600' : 'bg-zinc-700 hover:bg-zinc-600'} text-white font-bold`}
                  onClick={() => { setUserStatus('college'); setCurrentStep('college_year_input'); }}
                >
                  College Student
                </button>
                <button
                  className={`py-2 px-4 rounded-md transition-colors duration-200 ${userStatus === 'professional' ? 'bg-blue-600' : 'bg-zinc-700 hover:bg-zinc-600'} text-white font-bold`}
                  onClick={() => { setUserStatus('professional'); setCurrentStep('yoe_input'); }}
                >
                  Working Professional
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 'college_year_input' && (
            <div className="space-y-4 flex flex-col h-full justify-between">
              <p className="text-base text-center mt-4 text-gray-300">Okay, {userName}, which year are you in?</p>
              <div className="flex-grow"></div>
              <div>
                <select
                  className="w-full p-3 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none leading-tight mb-2"
                  value={collegeYear}
                  onChange={(e) => setCollegeYear(e.target.value)}
                >
                  <option value="" disabled>Select your year...</option>
                  {collegeYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                  onClick={() => collegeYear ? setCurrentStep('domain_selection') : alert('Please select your college year!')}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 'yoe_input' && (
            <div className="space-y-4 flex flex-col h-full justify-between">
              <p className="text-base text-center mt-4 text-gray-300">Alright, {userName}, how many years of experience do you have?</p>
              <div className="flex-grow"></div>
              <div>
                <input
                  type="number"
                  className="w-full p-3 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  placeholder="Years of Experience (e.g., 3)"
                  min="0"
                  value={yoe}
                  onChange={(e) => setYoe(e.target.value)}
                />
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                  onClick={() => yoe !== '' && yoe >= 0 ? setCurrentStep('domain_selection') : alert('Please enter your years of experience!')}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 'domain_selection' && (
            <div className="space-y-4 flex flex-col h-full justify-between">
              <p className="text-base text-center mt-4 text-gray-300">Now, tell me which domain you are in.</p>
              <div className="flex-grow"></div>
              <div>
                <select
                  className="w-full p-3 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none leading-tight mb-2"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                >
                  <option value="" disabled>Choose your domain...</option>
                  {csDomains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                  onClick={() => selectedDomain ? setCurrentStep('skill_input') : alert('Please select a domain!')}
                >
                  Onward to Skills!
                </button>
              </div>
            </div>
          )}

          {currentStep === 'skill_input' && (
            <div className="space-y-4">
              <p className="text-base text-center text-gray-300">Time to be honest. List your skills and rate them out of 10. <span className="text-red-400 font-bold">You can only select from suggestions!</span></p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                <div className="suggestions-container">
                  <input
                    type="text"
                    className="w-full p-3 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type to search skills (e.g., React)"
                    value={newSkillName}
                    onChange={handleSkillNameChange}
                    onFocus={() => {
                        if (newSkillName.length >= 2 && skillSuggestions.length > 0) {
                            setShowSuggestions(true);
                        }
                    }}
                    onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 150);
                    }}
                  />
                  {showSuggestions && skillSuggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {skillSuggestions.map((skill, index) => (
                        <div
                          key={index}
                          className="suggestions-dropdown-item"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectSuggestion(skill)}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  className="w-full sm:w-20 p-3 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="10"
                  value={newSkillRating}
                  onChange={(e) => setNewSkillRating(parseInt(e.target.value))}
                />
                <button
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                  onClick={addSkill}
                >
                  Add
                </button>
              </div>

              {skills.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-base font-semibold">Your Self-Assessed Skills:</h4>
                  {skills.map((skill, index) => (
                    <div key={index} className="flex skill-item-flex sm:skill-item-flex items-center sm:space-x-2">
                      <span className="w-full sm:w-32 sm:text-right text-gray-300">{skill.name}:</span>
                      <div className="flex-grow h-3 bg-zinc-800 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                          style={{ width: `${skill.rating * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-300">{skill.rating}/10</span>
                    </div>
                  ))}
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 mt-4"
                    onClick={() => setCurrentStep('review_skills')}
                  >
                    Review Skills
                  </button>
                </div>
              )}
            </div>
          )}

          {currentStep === 'review_skills' && (
            <div className="space-y-4">
              <p className="text-base text-center text-gray-300">Looks good? Let's get you a reality check!</p>
              {skills.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-base font-semibold">Your Self-Assessed Skills:</h4>
                  {skills.map((skill, index) => (
                    <div key={index} className="flex skill-item-flex sm:skill-item-flex items-center sm:space-x-2">
                      <span className="w-full sm:w-32 sm:text-right text-gray-300">{skill.name}:</span>
                      <div className="flex-grow h-3 bg-zinc-800 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                          style={{ width: `${skill.rating * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-300">{skill.rating}/10</span>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 mt-4"
                onClick={assessSkills}
                disabled={isLoading}
              >
                {isLoading ? 'Chatting...' : 'Chat with Aashima!'}
              </button>
            </div>
          )}

          {currentStep === 'reality_check' && (
            <div className="space-y-4 flex-grow flex flex-col h-full">
              <h4 className="text-base font-semibold text-center mb-4">Let's Talk!</h4>
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
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {!showCanvas && chatHistory.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button 
                    onClick={() => chatWithGemini(`Roadmap for ${selectedDomain}`)}
                    className="flex items-center space-x-2 py-2 px-4 rounded-full bg-zinc-800 text-gray-200 hover:bg-blue-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faChartLine} />
                    <span>Roadmap for {selectedDomain}</span>
                  </button>
                  <button
                    onClick={() => chatWithGemini("How to crack a 15-20 LPA job")}
                    className="flex items-center space-x-2 py-2 px-4 rounded-full bg-zinc-800 text-gray-200 hover:bg-blue-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faLaptopCode} />
                    <span>How to crack a 15-20 LPA job</span>
                  </button>
                  <button
                    onClick={() => chatWithGemini("Facing college life issues")}
                    className="flex items-center space-x-2 py-2 px-4 rounded-full bg-zinc-800 text-gray-200 hover:bg-blue-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>Facing college life issues</span>
                  </button>
                </div>
              )}

              <div className="flex space-x-2 mt-4">
                <input
                  type="text"
                  className="flex-grow p-3 border border-zinc-700 rounded-md bg-zinc-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What's on your mind?..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      chatWithGemini(userMessage);
                    }
                  }}
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                  onClick={() => chatWithGemini(userMessage)}
                  disabled={isLoading}
                >
                  Send
                </button>
              </div>
            
              <button
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 mt-2"
                onClick={() => {
                  onStartOver();
                  setCurrentStep('welcome');
                  setChatHistory([]);
                  setShowCanvas(false); // Reset canvas on start over
                }}
              >
                Start Over
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;