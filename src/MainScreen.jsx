import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faRobot, faUser, faLaptopCode, faFlask, faPaw, faComments } from '@fortawesome/free-solid-svg-icons'; // Added faPaw and faComments
import Chatbot from './Chatbot'; // Import the Chatbot component
import aashimaFinalImage from './assets/aashimaFinal.png'; // Import the new Aashima image

// Shadcn UI Card components (simulated for demonstration) - These are kept for consistency
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

// Main App Component (renamed to MainScreen for clarity)
const MainScreen = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  const handleUpdateProfile = (newProfileData) => {
    setUserProfile(prev => ({ ...prev, ...newProfileData }));
  };

  const handleStartOver = () => {
    setUserProfile({});
    setIsChatOpen(false);
  };
  
  // A function to simulate a Google login
  const handleGoogleLogin = () => {
    // In a real app, you would handle the actual Google auth flow here.
    // For this example, we'll just set some dummy user data to show the change.
    alert('Google Login is being simulated...');
    handleUpdateProfile({
      userName: 'Dummy User',
      userStatus: 'college',
      collegeYear: '3rd Year',
      selectedDomain: 'Software Development',
      skills: []
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-100 relative overflow-hidden"
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

          /* Styles for the new MainScreen UI */
          .main-content-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-grow: 1;
            padding: 2rem;
            text-align: center;
          }

          @media (min-width: 768px) { /* Medium screens and up */
            .main-content-area {
              flex-direction: row;
              text-align: left;
              justify-content: center;
              gap: 4rem; /* Space between image and text */
            }
          }

          .aashima-image {
            width: 250px; /* Default size for image */
            height: auto;
            border-radius: 0.75rem; /* Rounded corners for the image */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
          }

          @media (min-width: 768px) {
            .aashima-image {
              width: 350px; /* Larger image on desktop */
            }
          }

          .aashima-text-content {
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center; /* Center text content on small screens */
            text-align: center; /* Center text within this block */
          }
          
          /* Updated text alignment for mobile */
          @media (max-width: 767px) {
            .aashima-text-content {
              align-items: flex-start; /* Align text to start on mobile screens */
              text-align: left; /* Align text to left on mobile screens */
            }
          }

          @media (min-width: 768px) {
            .aashima-text-content {
              margin-top: 0;
              align-items: flex-start; /* Align text to start on large screens */
              text-align: left; /* Align text to left on large screens */
            }
          }

          .aashima-title {
            font-size: 2.2rem; /* Adjusted for better mobile line break */
            line-height: 1.2;
            font-weight: bold;
            color: #ffffff;
          }

          @media (max-width: 479px) { /* Extra small mobile screens */
            .aashima-title {
              font-size: 2rem; /* Even smaller for very narrow screens */
            }
          }

          @media (min-width: 480px) and (max-width: 767px) { /* Small mobile screens and up to medium */
            .aashima-title {
              font-size: 2.8rem; /* Slightly larger for slightly wider mobiles */
            }
          }

          @media (min-width: 768px) {
            .aashima-title {
              font-size: 4.5rem; /* Larger on desktop */
            }
          }

          .aashima-highlight {
            color: #94a3b8; /* Grayish color for "Aashima" */
          }

          .aashima-subtitle {
            font-size: 1.5rem; /* Default for mobile */
            color: #cbd5e1; /* Lighter gray for subtitle */
            margin-top: 1rem;
          }

          @media (min-width: 768px) {
            .aashima-subtitle {
              font-size: 2rem; /* Larger on desktop */
            }
          }

          .aashima-description {
            font-size: 1.1rem; /* Slightly smaller than subtitle */
            color: #a0aec0; /* Even lighter gray */
            margin-top: 1.5rem; /* More space after subtitle */
            max-width: 600px; /* Limit width for readability */
            line-height: 1.6;
          }

          @media (min-width: 768px) {
            .aashima-description {
              font-size: 1.25rem;
            }
          }

          .action-buttons-container {
            display: flex;
            flex-direction: column; /* Stack on mobile */
            gap: 1rem; /* Space between buttons */
            margin-top: 2.5rem; /* More space after description */
            width: 100%;
            max-width: 400px; /* Limit width of buttons container */
          }

          @media (min-width: 640px) { /* Small screens and up */
            .action-buttons-container {
              flex-direction: row; /* Side-by-side on larger screens */
              max-width: 500px; /* Adjust max width for side-by-side */
            }
          }

          .action-button {
            padding: 1rem 1.5rem;
            border-radius: 0.75rem; /* More rounded */
            font-weight: bold;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem; /* Space between icon and text */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            font-size: 1.1rem;
          }

          .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
          }

          .button-donate {
            background: linear-gradient(45deg, #4CAF50, #8BC34A); /* Green gradient */
            color: white;
          }

          .button-donate:hover {
            background: linear-gradient(45deg, #8BC34A, #4CAF50);
          }

          .button-chat {
            background-color: #1e62d0; /* Primary blue */
            color: white;
          }

          .button-chat:hover {
            background-color: #154a9e;
          }

          .google-login-button {
            background-color: #4285f4; /* Google blue */
            color: white;
          }
          
          .google-login-button:hover {
            background-color: #357ae8;
          }
        `}
      </style>
      
      <div className="main-content-area">
        {/* Aashima Image */}
        <div className="flex-shrink-0">
          <img 
            src={aashimaFinalImage} 
            alt="Aashima" 
            className="aashima-image" 
          />
        </div>

        {/* Text Content */}
        <div className="aashima-text-content">
          <h1 className="aashima-title">
            Hey, I am <span className="aashima-highlight">Aashima</span><br />
            your Ai College Senior
          </h1>
          <p className="aashima-subtitle tracking-wider">
            I work in Tech <br />
            and feed stray dogs
          </p>
          <p className="aashima-description">
            Been through the chaos of college life—now here to fix yours, clear your career doubts, and drop the roadmaps you actually need.
          </p>

          {/* Action Buttons with Conditional Rendering */}
          <div className="action-buttons-container">
            {userProfile.userName ? (
              <>
                <button 
                  className="action-button button-donate"
                  onClick={() => alert('Redirecting to donation page... (Not implemented yet)')} // Placeholder for donation
                >
                  <FontAwesomeIcon icon={faPaw} />
                  Donate for Stray Dogs
                </button>
                <button 
                  className="action-button button-chat"
                  onClick={() => setIsChatOpen(true)}
                >
                  <FontAwesomeIcon icon={faComments} />
                  Chat with Me
                </button>
              </>
            ) : (
              <button 
                className="action-button google-login-button"
                onClick={handleGoogleLogin}
              >
                Google LOGIN
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Card (Conditional Rendering) */}
      {userProfile.userName && (
          <Card className="w-full max-w-4xl p-6 mx-auto mb-8 sm:mb-12">
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

      {/* Chatbot Component */}
      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={handleUpdateProfile}
        onStartOver={handleStartOver}
      />

      {/* Footer */}
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

export default MainScreen;
+
  