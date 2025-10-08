import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faPaw, faComments } from '@fortawesome/free-solid-svg-icons';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Chatbot from './Chatbot';
import aashimaFinalImage from './assets/aashimafinal.png';
import aashimadogfinalImage from './assets/aashimadogfinal.png';
import DonationModal from './DonationModal';

// --- Supabase Client Creation ---
const supabaseUrl = "https://txrbvevvygpdekeqtxkk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cmJ2ZXZ2eWdwZGVrZXF0eGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1ODU2NDYsImV4cCI6MjA3MDE2MTY0Nn0.xP7L3pQQ5CCqE_pUW2PnrtDf2lq9e6KZgwpw28ooXYc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MainScreen = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [aashimaImage, setAashimaImage] = useState(aashimaFinalImage);

  // --- Supabase Authentication Logic ---
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setAashimaImage(aashimadogfinalImage);
        setShowLoginModal(false);
      } else {
        setAashimaImage(aashimaFinalImage);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setAashimaImage(aashimadogfinalImage);
      } else {
        setAashimaImage(aashimaFinalImage);
      }
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

  const handleProtectedAction = (action) => {
    if (session) {
      if (action === 'chat') {
        setIsChatOpen(true);
      } else if (action === 'donate') {
        setShowDonationModal(true);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans text-gray-100 relative bg-gradient-to-br from-slate-900 to-slate-800"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <header className="flex justify-end p-4 z-10">
        {session && (
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            Logout
          </button>
        )}
      </header>
      
      <div className="flex flex-col md:flex-row items-center justify-center flex-grow p-4 md:p-8 text-center md:text-left gap-4 md:gap-8 overflow-y-auto">
        <div className="flex-shrink-0">
          <img
            src={aashimaImage}
            alt="Aashima"
            className="w-48 h-auto md:w-96 rounded-2xl shadow-xl transition-all duration-300"
          />
        </div>

        <div className="flex flex-col items-center md:items-start text-white max-w-2xl mt-4 md:mt-0">
          <h1 className="text-3xl md:text-6xl font-bold leading-tight">
            Hey, I am <span className="text-blue-400">Techify</span><br />
            your Ai College Senior
          </h1>
          <p className="text-lg md:text-2xl mt-2 text-gray-300">
            I work in Tech and feed stray dogs
          </p>
          <p className="text-sm md:text-lg mt-2 text-gray-400 max-w-xl">
            Been through the chaos of college life, Now here to fix yours, clear your career doubts, and drop the roadmaps you actually need.
          </p>

          <div className="flex flex-col gap-2 mt-4 w-full max-w-sm sm:flex-row sm:gap-4">
            <button
              onClick={() => handleProtectedAction('donate')}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 w-full"
            >
              <FontAwesomeIcon icon={faPaw} />
              <span>Donate for Stray Dogs</span>
            </button>
            <button
              onClick={() => handleProtectedAction('chat')}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 w-full"
            >
              <FontAwesomeIcon icon={faComments} />
              <span>Chat with Me</span>
            </button>
          </div>
          
          {/* Modified block for the footer content */}
          <div className="w-full text-center mt-6 text-gray-400 text-sm md:text-left">
            <p className="mb-2">Built by Manas Jain</p>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="https://www.instagram.com/manasjaiinn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-500 transition-colors duration-200"
                aria-label="Manas Jain's Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} size="xl" />
              </a>
              <a
                href="https://www.linkedin.com/in/manas110"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-600 transition-colors duration-200"
                aria-label="Manas Jain's LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} size="xl" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg">
            <h1 className="text-3xl font-bold text-center mb-6 text-white">Login to Aashima AI</h1>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google']}
              theme="dark"
              redirectTo={window.location.origin}
            />
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-6 w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDonationModal && <DonationModal onClose={() => setShowDonationModal(false)} />}

      <Chatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default MainScreen;
