import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faPaw, faComments } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Chatbot from './Chatbot';
import aashimaFinalImage from './assets/aashimaFinal.png';

// --- Supabase Client Creation ---
const supabaseUrl = "https://txrbvevvygpdekeqtxkk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cmJ2ZXZ2eWdwZGVrZXF0eGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1ODU2NDYsImV4cCI6MjA3MDE2MTY0Nn0.xP7L3pQQ5CCqE_pUW2PnrtDf2lq9e6KZgwpw28ooXYc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MainScreen = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // --- Supabase Authentication Logic ---
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    setSession(null);
    setIsChatOpen(false);
  };
  
  // --- New Logic for handling button clicks ---
  const handleProtectedAction = (action) => {
    if (session) {
      // User is authenticated, proceed with the action
      if (action === 'chat') {
        setIsChatOpen(true);
      } else if (action === 'donate') {
        window.open('https://www.instagram.com/manasjaiinn', '_blank');
      }
    } else {
      // User is not authenticated, show the login modal
      setShowLoginModal(true);
    }
  };


  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-100 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}>
      <style>{`
        /* CSS styles are unchanged */
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

        @media (min-width: 768px) {
          .main-content-area {
            flex-direction: row;
            text-align: left;
            justify-content: center;
            gap: 4rem;
          }
        }

        .aashima-image {
          width: 250px;
          height: auto;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15);
        }

        @media (min-width: 768px) {
          .aashima-image {
            width: 350px;
          }
        }

        .aashima-text-content {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        @media (max-width: 767px) {
          .aashima-text-content {
            align-items: flex-start;
            text-align: left;
          }
        }

        @media (min-width: 768px) {
          .aashima-text-content {
            margin-top: 0;
            align-items: flex-start;
            text-align: left;
          }
        }

        .aashima-title {
          font-size: 2.2rem;
          line-height: 1.2;
          font-weight: bold;
          color: #ffffff;
        }

        @media (max-width: 479px) {
          .aashima-title {
            font-size: 2rem;
          }
        }

        @media (min-width: 480px) and (max-width: 767px) {
          .aashima-title {
            font-size: 2.8rem;
          }
        }

        @media (min-width: 768px) {
          .aashima-title {
            font-size: 4.5rem;
          }
        }

        .aashima-highlight {
          color: #94a3b8;
        }

        .aashima-subtitle {
          font-size: 1.5rem;
          color: #cbd5e1;
          margin-top: 1rem;
        }

        @media (min-width: 768px) {
          .aashima-subtitle {
            font-size: 2rem;
          }
        }

        .aashima-description {
          font-size: 1.1rem;
          color: #a0aec0;
          margin-top: 1.5rem;
          max-width: 600px;
          line-height: 1.6;
        }

        @media (min-width: 768px) {
          .aashima-description {
            font-size: 1.25rem;
          }
        }

        .google-login-button {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background-color: #4285f4;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: background-color 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .google-login-button:hover {
          background-color: #357ae8;
        }

        .action-buttons-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2.5rem;
          width: 100%;
          max-width: 400px;
        }

        @media (min-width: 640px) {
          .action-buttons-container {
            flex-direction: row;
            max-width: 500px;
          }
        }

        .action-button {
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: bold;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          font-size: 1.1rem;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }

        .button-donate {
          background: linear-gradient(45deg, #4CAF50, #8BC34A);
          color: white;
        }

        .button-donate:hover {
          background: linear-gradient(45deg, #8BC34A, #4CAF50);
        }

        .button-chat {
          background-color: #1e62d0;
          color: white;
        }

        .button-chat:hover {
          background-color: #154a9e;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          max-width: 500px;
          width: 90%;
          background: #1e293b;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
          border: 1px solid #3f3f46;
        }
      `}</style>
      
      <header className="flex justify-end p-4">
        {session && (
          <button 
            onClick={handleSignOut} 
            className="google-login-button"
            style={{ backgroundColor: '#dc2626' }}
          >
            Logout
          </button>
        )}
      </header>
      
      <div className="main-content-area">
        <div className="flex-shrink-0">
          <img 
            src={aashimaFinalImage} 
            alt="Aashima" 
            className="aashima-image"
          />
        </div>

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

          <div className="action-buttons-container">
            <button 
              className="action-button button-donate"
              onClick={() => handleProtectedAction('donate')}
            >
              <FontAwesomeIcon icon={faPaw} />
              Donate for Stray Dogs
            </button>
            <button 
              className="action-button button-chat"
              onClick={() => handleProtectedAction('chat')}
            >
              <FontAwesomeIcon icon={faComments} />
              Chat with Me
            </button>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1 className="text-2xl font-bold text-center mb-6 text-white">Login to Aashima AI</h1>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google']}
              theme="dark"
              redirectTo={window.location.href}
            />
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-4 w-full py-2 rounded-lg text-white font-semibold"
              style={{ backgroundColor: '#3f3f46' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
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

export default MainScreen;