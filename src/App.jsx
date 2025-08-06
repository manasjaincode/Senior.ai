import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faRobot, faTimes, faUser, faLaptopCode, faFlask, faChartLine, faDownload, faEye, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';

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

// --- UPDATED COMPONENT: RoadmapCanvas for both roadmaps and schedules ---
const RoadmapCanvas = ({ onClose, content, title }) => {
    const roadmapRef = useRef(null);

    const downloadPdf = () => {
        const doc = new jsPDF();
        const textLines = doc.splitTextToSize(content, 180);
        let y = 20;
        const margin = 20;

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin, y);
        y += 15;

        doc.setLineWidth(0.5);
        doc.line(margin, y - 5, 190, y - 5);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        
        const steps = content.split(/\d+\.\s*/).filter(Boolean);
        
        steps.forEach((step, index) => {
            const stepNumber = `${index + 1}. `;
            const stepText = step.trim();
            
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFont("helvetica", "bold");
            doc.text(stepNumber, margin, y);
            
            doc.setFont("helvetica", "normal");
            const stepLines = doc.splitTextToSize(stepText, 170);
            doc.text(stepLines, margin + 8, y);
            
            y += (stepLines.length * 7) + 5;
        });

        doc.save(`${title.replace(/ /g, '_')}.pdf`);
    };

    const steps = content.split(/\d+\.\s*/).filter(Boolean);

    return (
        <div className="p-4 overflow-y-auto relative h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-zinc-900 z-10 p-2 border-b border-zinc-700">
                <h4 className="text-xl font-bold">{title}</h4>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button className="py-1 px-3 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors" onClick={downloadPdf}>
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Download PDF
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            </div>
            
            <div id="roadmap-canvas-content" ref={roadmapRef} className="p-4 bg-zinc-900 flex-grow">
                <div className="border border-zinc-700 rounded-md p-4 bg-zinc-800 space-y-6">
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <div className="roadmap-step">
                                <div className="step-number">{index + 1}</div>
                                <div className="step-content">
                                    <p className="text-gray-400">{step.trim()}</p>
                                </div>
                            </div>
                            {index < steps.length - 1 && <div className="roadmap-connector"></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Main Chatbot Component ---
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
  const [canvasTitle, setCanvasTitle] = useState('');

  const chatEndRef = useRef(null);
  const [chatMode, setChatMode] = useState('general');

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
  }, [chatHistory, showCanvas]);

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
    if (!message.trim() && chatMode !== 'schedule_start') return;

    setIsLoading(true);
    
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
    let isCanvasRequest = false;
    let newCanvasTitle = '';

    const lowerCaseMessage = message.toLowerCase();

    if (chatMode === 'schedule_start') {
        fullPrompt = `${initialContextPrompt}\n\nUser wants a schedule. Ask a clarifying question to get the details, like "Kis cheez ka schedule chahiye, kitne time ka?" in a fun, conversational Hinglish tone. Do not generate the schedule yet.`;
        setChatMode('schedule_await_details');
    } else if (chatMode === 'schedule_await_details') {
        fullPrompt = `${initialContextPrompt}\n\nUser provided these details for a schedule: "${message}". Please generate a detailed schedule with numbered steps. Break down the tasks week by week or day by day, based on the user's request. Focus on their domain and current skills. The response should be a numbered list format.`;
        isCanvasRequest = true;
        newCanvasTitle = 'Your Customized Schedule';
        setChatMode('general'); // Reset to general mode after getting details
    } else if (lowerCaseMessage.includes("roadmap")) {
        fullPrompt = `${initialContextPrompt}\n\nUser's Request: The user wants a customized roadmap for their domain: ${selectedDomain}. They are a ${userContext}. Give a specific and actionable roadmap for them to follow, keeping their current status and domain in mind. The roadmap should have clear numbered steps, for example: "1. Step one. 2. Second step.".`;
        isCanvasRequest = true;
        newCanvasTitle = 'Your Customized Roadmap';
    } else if (lowerCaseMessage.includes("15-20 lpa job")) {
        fullPrompt = `${initialContextPrompt}\n\nUser's Request: The user is asking how to crack a 15-20 LPA job. Give a realistic reality check based on their self-rated skills and experience. Don't be too harsh but be honest. Your response should still be conversational, no lists, just a single paragraph. Use a Gen Z tone.`;
    } else if (lowerCaseMessage.includes("college life issues")) {
        fullPrompt = `${initialContextPrompt}\n\nUser's Request: The user wants to discuss college life issues. Give a witty, empathetic, and slightly roasting response that acknowledges their problem but subtly pushes them back towards focusing on their career and future. Use a Gen Z tone.`;
    } else {
        fullPrompt = `${initialContextPrompt}\n\nUser's message: ${message}`;
    }

    const updatedChatHistory = [...chatHistory, { role: "user", parts: [{ text: message }] }];
    if (chatMode === 'schedule_start') {
        // We don't want to show the 'start_schedule_flow' message
    } else {
        setChatHistory(updatedChatHistory);
    }
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
      
      if (isCanvasRequest) {
          setVisibleCanvasContent(aiResponseText);
          setCanvasTitle(newCanvasTitle);
          setShowCanvas(true);
          setChatHistory(prevHistory => [...prevHistory, { role: "model", parts: [{ text: `Aashima ne tumhare liye ${selectedDomain} ka ${newCanvasTitle === 'Your Customized Roadmap' ? 'roadmap' : 'schedule'} banaya hai.` }], hasCanvas: true }]);
      } else {
          setShowCanvas(false);
          setChatHistory(prevHistory => [...prevHistory, { role: "model", parts: [{ text: aiResponseText }] }]);
      }

    } catch (error) {
      console.error("Error during Gemini API call:", error);
      setChatHistory(prevHistory => [...prevHistory, { role: "model", parts: [{ text: "Looks like my circuits are down. Try again in a bit!" }] }]);
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
            <FontAwesomeIcon icon={faRobot} className="text-blue-500 text-xl" />
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
                {isLoading && chatHistory.length === 0 && !showCanvas ? (
                  <p className="text-center text-base text-gray-400">Aashima is connecting...</p>
                ) : showCanvas ? (
                    <RoadmapCanvas onClose={() => setShowCanvas(false)} content={visibleCanvasContent} title={canvasTitle} />
                ) : (
                  chatHistory.map((message, index) => (
                    <div key={index} className="space-y-2">
                        <div 
                          className={`chat-message ${message.role === 'user' ? 'chat-user' : 'chat-ai'}`}
                        >
                          <div className={`message-box ${message.role === 'user' ? 'message-box-user' : 'message-box-ai'}`}>
                            <p>{message.parts[0].text}</p>
                          </div>
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
                {isLoading && chatHistory.length > 0 && !showCanvas && (
                  <div className="chat-message chat-ai">
                    <div className="message-box message-box-ai">
                      <p>Typing...</p>
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
                    onClick={() => {
                        setChatMode('schedule_start');
                        chatWithGemini('start_schedule_flow');
                    }}
                    className="flex items-center space-x-2 py-2 px-4 rounded-full bg-zinc-800 text-gray-200 hover:bg-blue-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>Make me a schedule for...</span>
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


// Main App Component
const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  const handleUpdateProfile = (newProfileData) => {
    setUserProfile(prev => ({ ...prev, ...newProfileData }));
  };

  const handleStartOver = () => {
    setUserProfile({});
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center sm:items-start sm:flex-row font-sans text-gray-100"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}>
      <style>
        {`
          @font-face {
            font-family: 'Futura PT';
            src: url('https://fonts.cdnfonts.com/s/14717/FuturaPT-Book.woff') format('woff');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'Futura PT';
            src: url('https://fonts.cdnfonts.com/s/14717/FuturaPT-Medium.woff') format('woff');
            font-weight: 500;
            font-style: normal;
          }
          @font-face {
            font-family: 'Futura PT';
            src: url('https://fonts.cdnfonts.com/s/14717/FuturaPT-Bold.woff') format('woff');
            font-weight: bold;
            font-style: normal;
          }
          body { font-family: 'Futura PT', sans-serif; margin: 0; }
          .bg-black { background-color: rgba(0, 0, 0, 0.8); }
          .bg-zinc-800 { background-color: rgba(26, 26, 26, 0.9); }
          .bg-zinc-900 { background-color: rgba(18, 18, 18, 0.95); }
          .text-gray-100 { color: #f0f0f0; }
          .text-gray-400 { color: #94a3b8; }
          .border-zinc-700 { border-color: #3f3f46; }
          .bg-blue-600 { background-color: #1e62d0; }
          .hover\\:bg-blue-700:hover { background-color: #154a9e; }
          .bg-gray-700 { background-color: #222222; }
          .text-red-400 { color: #f87171; }
          .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2); }
          .rounded-lg { border-radius: 0.5rem; }
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .flex-grow { flex-grow: 1; }
          .p-4 { padding: 1rem; }
          .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
          .font-semibold { font-weight: 600; }
          .min-h-screen { min-height: 100vh; }
          .w-full { width: 100%; }
          .h-full { height: 100%; }
          .sm\\:w-96 { width: 24rem; }
          .sm\\:h-\[600px\] { height: 600px; }
          .text-white { color: #ffffff; }
          .font-bold { font-weight: 700; }
          .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .mt-4 { margin-top: 1rem; }
          .mb-4 { margin-bottom: 1rem; }
          .overflow-y-auto { overflow-y: auto; }
          .whitespace-pre-wrap { white-space: pre-wrap; }
          .chat-message {
            margin-bottom: 1rem;
            display: flex;
            align-items: flex-start;
          }
          .chat-user {
            justify-content: flex-end;
          }
          .chat-ai {
            justify-content: flex-start;
          }
          .message-box {
            max-width: 80%;
            padding: 0.75rem 1rem;
            border-radius: 1.5rem;
            line-height: 1.5;
            word-wrap: break-word;
          }
          .message-box-user {
            background-color: #1e62d0;
            color: #ffffff;
            border-bottom-right-radius: 0.25rem;
          }
          .message-box-ai {
            background-color: #3f3f46;
            color: #f0f0f0;
            border-bottom-left-radius: 0.25rem;
          }
          .chat-container {
            height: calc(100% - 140px);
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .fixed { position: fixed; }
          .bottom-0 { bottom: 0; }
          .right-0 { right: 0; }
          .z-50 { z-index: 50; }
          .sm\\:bottom-4 { bottom: 1rem; }
          .sm\\:right-4 { right: 1rem; }
          @media (max-width: 640px) {
            .sm\\:fixed { position: initial; }
            .sm\\:right-4 { right: 0; }
            .sm\\:bottom-4 { bottom: 0; }
            .sm\\:w-96 { width: 100%; }
            .sm\\:h-\[600px\] { height: 100vh; }
            .chat-container { height: calc(100% - 100px); }
          }
          .grid { display: grid; }
          .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .p-8 { padding: 2rem; }
          .text-center { text-align: center; }
          .justify-center { justify-content: center; }
          .sm\\:items-start { align-items: flex-start; }
          .sm\\:flex-row { flex-direction: row; }
          
          .inset-0 { inset: 0; }
          @media (min-width: 640px) {
            .sm\\:w-\[90vw\] { width: 90vw; }
            .sm\\:h-\[90vh\] { height: 90vh; }
          }
          @media (min-width: 768px) {
            .md\\:w-\[800px\] { width: 800px; }
            .md\\:h-\[70vh\] { height: 70vh; }
          }

          .roadmap-step {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
          }
          .step-number {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            background-color: #1e62d0;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
          }
          .roadmap-connector {
            width: 2px;
            height: 2rem;
            background-color: #3f3f46;
            margin-left: 1.25rem;
          }
        `}
      </style>
      
      <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl flex flex-col space-y-8 sm:space-y-12">
            <div className="text-center sm:text-left">
                <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">Aashima</h1>
                <p className="mt-4 text-xl sm:text-2xl text-gray-400">
                    Clear all your tech career doubts by chatting with your personal AI senior.
                </p>
            </div>
            
            {userProfile.userName && (
                <Card className="w-full p-6">
                    <CardHeader className="p-0 border-b border-zinc-700 pb-4 mb-4">
                        <CardTitle className="text-2xl flex items-center space-x-2"><FontAwesomeIcon icon={faUser} className="text-blue-500" /><span>Your Profile</span></CardTitle>
                        <CardDescription className="text-base text-gray-300 mt-1">Here's a quick overview of your career path.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-4">
                            <div className="flex items-center text-lg space-x-2">
                                <FontAwesomeIcon icon={faLaptopCode} className="text-gray-500" />
                                <span className="font-semibold text-gray-300">{userProfile.userStatus === 'college' ? userProfile.collegeYear : `${userProfile.yoe} years exp.`}</span>
                                <span className="text-gray-400"> • </span>
                                <span className="font-semibold text-gray-300">{userProfile.selectedDomain}</span>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-300 flex items-center space-x-2"><FontAwesomeIcon icon={faFlask} className="text-gray-500" /><span>Your Skills</span></h4>
                                {userProfile.skills.length > 0 ? (
                                    userProfile.skills.map((skill, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <span className="w-32 text-gray-400">{skill.name}:</span>
                                            <div className="flex-grow h-3 bg-zinc-800 rounded-full">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                                                    style={{ width: `${skill.rating * 10}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-gray-300">{skill.rating}/10</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Your skills will appear here once you've entered them in the chat.</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>

      {!isChatOpen && (
        <button
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-110"
          onClick={() => setIsChatOpen(true)}
        >
          <FontAwesomeIcon icon={faRobot} size="2x" />
        </button>
      )}

      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onStartOver={handleStartOver}
      />

      <footer className="w-full text-center py-4 px-2 mt-auto text-gray-400 text-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        <p className="mb-2">Built by Manas Jain</p>
        <div className="flex justify-center space-x-6">
          <a
            href="https://www.instagram.com/manasjaiinn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-pink-500 transition-colors duration-200"
            aria-label="Manas Jain's Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a
            href="https://www.linkedin.com/in/manas110"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-blue-600 transition-colors duration-200"
            aria-label="Manas Jain's LinkedIn"
          >
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;