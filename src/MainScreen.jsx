import { useState } from 'react';
import useGeminiChat from './useGeminiChat';

import { Sparkles, Brain, TrendingUp, Users, Menu, X, MessageSquare, Send, Search, Settings, Bell, Plus, ChevronDown, Star, Archive, Zap } from 'lucide-react';

// Marquee/Scrolling List Component
const ScrollingList = ({ content, speed = 'slow', isReverse = false }) => {
  const scrollKeyframes = isReverse ? 'scroll-up-reverse' : 'scroll-up';
  
  // Duplicate the content to ensure continuous scrolling
  const duplicatedContent = [...content, ...content];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Define the scrolling animation in a style tag for Tailwind JIT to pick up. 
          NOTE: In a real project, this should be in a global CSS file or defined 
          with a library like 'framer-motion' for better performance and control. */}
      <style jsx global>{`
        @keyframes scroll-up {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-up-reverse {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
      `}</style>
      
      <div 
        className={`absolute top-0 left-0 w-full`}
        style={{
          animation: `${scrollKeyframes} ${speed === 'slow' ? '40s' : '25s'} linear infinite`,
        }}
      >
        {duplicatedContent.map((item, index) => (
          <div key={index} className="p-3 my-2 rounded-lg bg-[#1f1f1f] text-sm hover:bg-[#2a2a2a] transition-colors cursor-default border border-gray-800">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [showChat, setShowChat] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState('Welcome');
  const [message, setMessage] = useState('');
const { messages, sendMessage, isLoading } = useGeminiChat();

  const chatList = [
    { name: 'Welcome', count: 48, color: 'bg-purple-500' },
    { name: 'UI8 Production', count: 16, color: 'bg-blue-500' },
    { name: 'Favorites', count: 8, color: 'bg-yellow-500' },
    { name: 'Archived', count: 128, color: 'bg-red-500' },
  ];

  // Data for the first new div (On-Campus Updates / News)
  const campusNews = [
    "Cisco offers 20 lpa for networking roles.",
    "490 students placed at TCS 2025 batch.",
    "Tatvic analytics comes by October end offer 6-12 lpa for tech roles.",
    "Infosys Came for 2025 batch for Girls Diversity hiring.",
    "Mango insurance came on campus for Customer Service Officer. package 10 lpa.",
    "Google announced a new hiring program for final year students.",
    "Amazon is opening up for summer internships.",
  ];

  // Data for the second new div (General College News/Tips)
  const collegeTips = [
    "U can apply for Outhouse internships by 3rd yr end that satisfy clg criterias.",
    "Companies usually come by August end during your 7th sem.",
    "GDSC, ACM, AWS Cloud Club, and Cultural Club are among the most vibrant student communities.",
    "Moonstone — a 3-day cultural fest with music, themes, and celebrity performances.",
    "Midsems prepare you for End Semesters.",
    "Once placed in a certain slab, you can only apply for companies in higher slabs.",
    "U can now wear Medicaps Merchandise ON Monday Casuals.",
    "Start preparing for aptitude tests from the 5th semester.",
  ];

  const recentChats = [
    {
      title: 'Agentic AI: The Next Big Career Leap',
      preview: 'AI is moving from assistants to autonomous agents, creating new roles in design and governance for intelligent workflows.',
      time: 'Just now',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800' // Tech/AI image
    },
    {
      title: 'Blockchain Beyond Finance: Supply Chain Boom',
      preview: 'Decentralized systems are gaining ground in logistics and supply chain for transparency and secure data tracking.',
      time: '2 hours ago',
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800' // Tech/Blockchain image
    },
    {
      title: 'Low-Code/No-Code: The New Dev Standard',
      preview: 'Gartner predicts 80% of tech products will soon be built by non-IT pros, blending low-code with AI-assisted dev.',
      time: '5 hours ago',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800' // Software Development image
    }
  ];

  if (showChat) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
        {/* Sidebar - UPDATED SECTION */}
        <div className="w-64 bg-[#141414] border-r border-gray-800 flex flex-col">
          {/* Logo */}
          <div className="p-4 flex items-center gap-3 border-b border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg">AI College Senior</span>
          </div>

          {/* New Auto-Scrolling Content Divs */}
          <div className="flex-1 overflow-hidden p-3 space-y-4">
            
            {/* Div 1: On-Campus Updates (News) */}
            <div className="h-1/2 min-h-[40%] flex flex-col p-2 bg-[#141414] rounded-xl border border-gray-700 shadow-inner">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-400 mb-2 border-b border-gray-800 pb-1">
                    <Zap className="w-4 h-4" />
                    On-Campus Updates
                </h3>
                <div className="flex-1 min-h-0"> {/* Wrapper to give the inner list a specific height for overflow:hidden */}
                    <ScrollingList content={campusNews} speed="slow" isReverse={false} />
                </div>
            </div>

            {/* Div 2: College News/Tips */}
            <div className="h-1/2 min-h-[40%] flex flex-col p-2 bg-[#141414] rounded-xl border border-gray-700 shadow-inner">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-400 mb-2 border-b border-gray-800 pb-1">
                    <MessageSquare className="w-4 h-4" />
                    Clg Tips & Insights
                </h3>
                <div className="flex-1 min-h-0">
                    <ScrollingList content={collegeTips} speed="medium" isReverse={true} /> {/* Different speed/direction for variety */}
                </div>
            </div>
          </div>
          {/* End of New Auto-Scrolling Content Divs */}

          {/* User Profile */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center relative">
                <span className="text-sm font-bold">MS</span>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#141414] rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">College Junior</p>
                <p className="text-xs text-gray-500">@student</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              Upgraded to Pro
            </button>
            <div className="flex items-center justify-between mt-3">
              <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
                <div className="w-5 h-5 rounded bg-yellow-500/20 flex items-center justify-center">
                  <span>☀️</span>
                </div>
                Light
              </button>
              <button className="flex items-center gap-2 text-xs text-white">
                <div className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center">
                  <span>🌙</span>
                </div>
                Dark
              </button>
            </div>
          </div>
        </div>
        {/* End of Sidebar - UPDATED SECTION */}


        {/* Main Chat Area - UNCHANGED */}
        <div className="flex-1 flex flex-col h-screen bg-[#1c1c1c] text-white">
      
      {/* --- Chat Header (MacOS Style) --- */}
      <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#181818] z-10 sticky top-0">
        <div className="flex items-center gap-3">
          {/* MacOS Window Traffic Lights */}
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" title="Close"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full" title="Minimize"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full" title="Maximize"></div>
          </div>
          
          <h2 className="font-semibold text-lg text-gray-200 ml-4">{selectedChat}</h2>
          {/* Your Star Icon component (uncomment when imported) */}
          {/* <Star className="w-5 h-5 text-gray-500 hover:text-yellow-500 cursor-pointer transition-colors" /> */}
        </div>
        <div className="flex items-center gap-3">
          {/* Your Archive/Settings Icon components (uncomment when imported) */}
          {/* <button className="p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors">
            <Archive className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-[#1f1f1f] rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button> */}
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg">
            Share
          </button>
        </div>
      </div>

      {/* --- Chat Content Area (Scrollable with Hidden Bar) --- */}
      <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
        <div className="max-w-4xl mx-auto">
          
          {/* Welcome Section (Only shown when no messages are present) */}
          {messages.length === 0 && (
             <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                {/* Your Brain Icon Component here */}
                {/* <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-float">
                  <Brain className="w-16 h-16" />
                </div> */}
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Welcome to AI College Senior
                </h1>
                <p className="text-gray-400 text-lg">
                  Your personal mentor for navigating college life successfully
                </p>
              </div>

              {/* Grid cards content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:scale-[1.02] cursor-pointer">
                  {/* <Sparkles className="w-8 h-8 text-blue-400 mb-3" /> */}
                  <h3 className="font-semibold mb-2">Smart Strategies</h3>
                  <p className="text-sm text-gray-400">Get personalized advice for academic success</p>
                </div>
                {/* Card 2 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-[1.02] cursor-pointer">
                  {/* <TrendingUp className="w-8 h-8 text-purple-400 mb-3" /> */}
                  <h3 className="font-semibold mb-2">Career Growth</h3>
                  <p className="text-sm text-gray-400">Build skills that matter in the real world</p>
                </div>
                {/* Card 3 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 hover:border-pink-500/40 transition-all hover:scale-[1.02] cursor-pointer">
                  {/* <Users className="w-8 h-8 text-pink-400 mb-3" /> */}
                  <h3 className="font-semibold mb-2">Community Support</h3>
                  <p className="text-sm text-gray-400">Learn from experiences of successful seniors</p>
                </div>
              </div>
            </div>
          )}

          {/* --- Message Bubbles (Social Media / iMessage Style) --- */}
          <div className="mt-10 max-w-2xl mx-auto space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* AI Profile Pic as Text (Show on left) */}
                {msg.role !== "user" && (
                  <div
                    className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-md"
                  >
                    CS
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[75%] p-3 shadow-xl transition-all text-sm 
                    ${
                      msg.role === "user"
                        // User Bubble: Blue background, white text, slightly different corner
                        ? "bg-blue-500 text-white rounded-t-xl rounded-l-xl rounded-br-md"
                        // AI Bubble: Soft gray background with blur, dark text, slightly different corner
                        : "bg-gray-700/50 text-gray-200 rounded-t-xl rounded-r-xl rounded-bl-md backdrop-blur-md"
                    }
                  `}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* User Profile Pic as Text (Show on right) */}
                {msg.role === "user" && (
                  <div
                    className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-xs font-bold shadow-md"
                  >
                    Jr
                  </div>
                )}
              </div>
            ))}

            {/* --- Typing Indicator (Animated) --- */}
            {isLoading && (
              <div className="flex items-end gap-3 justify-start">
                {/* AI's "CS" circle for the typing indicator */}
                <div
                  className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-md"
                >
                  CS
                </div>
                <div className="bg-gray-700/50 p-3 rounded-t-xl rounded-r-xl rounded-bl-md backdrop-blur-md">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
      
     
      
     

          </div>      </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3 bg-[#1f1f1f] rounded-2xl p-3 border border-gray-800 focus-within:border-blue-500 transition-colors">
                <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                  <Plus className="w-5 h-5 text-gray-400" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type '/' for commands..."
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                />
               <button
  onClick={() => {
    sendMessage(message);
    setMessage("");
  }}
  disabled={isLoading}
  className={`p-2 rounded-lg transition-colors ${
    isLoading
      ? "bg-gray-700 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  <Send className="w-5 h-5" />
</button>

              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                AI College Senior is here to help you succeed. Ask anything!
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chat History - UNCHANGED */}
        <div className="w-80 bg-[#141414] border-l border-gray-800 p-4 overflow-y-auto hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-400">Tech Career Insights</h3> {/* Header updated */}
            <span className="text-xs text-gray-500">20/100</span>
          </div>
          <div className="space-y-3">
            {recentChats.map((chat, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#1f1f1f] hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3 mb-2">
                  <input type="checkbox" className="mt-1 rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{chat.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{chat.preview}</p>
                  </div>
                </div>
                <img
                  src={chat.image}
                  alt={chat.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-5 h-5" />
            New chat
          </button>
        </div>
      </div>
    );
  }

  // Rest of the App component (outside showChat) - UNCHANGED
  // ... (Hero Section, Features Section, CTA Section, Footer)
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-gray-900 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-glow">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">AI College Senior</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors font-medium">Features</a>
            <a href="#about" className="text-gray-400 hover:text-white transition-colors font-medium">About</a>
            <a href="#contact" className="text-gray-400 hover:text-white transition-colors font-medium">Contact</a>
            <button
              onClick={() => setShowChat(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
            >
              Chat Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-900 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-900 bg-black/95 backdrop-blur-xl">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-gray-400 hover:text-white transition-colors font-medium">Features</a>
              <a href="#about" className="block text-gray-400 hover:text-white transition-colors font-medium">About</a>
              <a href="#contact" className="block text-gray-400 hover:text-white transition-colors font-medium">Contact</a>
              <button
                onClick={() => setShowChat(true)}
                className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Chat Now
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideUp">
              <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                Your AI{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  College Senior
                </span>
                {' '}is Here
              </h1>
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Navigate college like a pro from day one. Get personalized strategies, career advice, and real-world wisdom from an AI that actually gets it.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowChat(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 flex items-center gap-2"
                >
                  Start Chatting <Sparkles className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 border-2 border-gray-800 rounded-full font-bold text-lg hover:border-gray-600 transition-all hover:scale-105">
                  Learn More
                </button>
              </div>
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <p className="text-3xl font-bold text-white">200+</p>
                  <p className="text-sm text-gray-500">Students Helped</p>
                </div>
              
                <div>
                  <p className="text-3xl font-bold text-white">24/7</p>
                  <p className="text-sm text-gray-500">Available</p>
                </div>
              </div>
            </div>

            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-30"></div>
              <img
                src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="AI Tech"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-400">Everything you need to crush college life</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-blue-500/50 transition-all hover:scale-105 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart AI Mentor</h3>
              <p className="text-gray-400 leading-relaxed">
                Get instant advice powered by advanced AI trained on thousands of successful college experiences
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/50 transition-all hover:scale-105 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Career Strategies</h3>
              <p className="text-gray-400 leading-relaxed">
                Build the right skills, make the right connections, and land your dream opportunities
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-green-500/50 transition-all hover:scale-105 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Answers</h3>
              <p className="text-gray-400 leading-relaxed">
                No more waiting. Get real-time responses to all your college-related questions, anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Images Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">Powered by Innovation</h2>
            <p className="text-xl text-gray-400">Cutting-edge technology meets real-world experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative group overflow-hidden rounded-3xl">
              <img
                src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Tech Innovation"
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <p className="text-xl font-bold">AI Technology</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-3xl">
              <img
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Future Ready"
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <p className="text-xl font-bold">Future Ready</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-3xl">
              <img
                src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Smart Learning"
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <p className="text-xl font-bold">Smart Learning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Ready to Level Up Your College Game?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of students who are already crushing it with AI College Senior
          </p>
          <button
            onClick={() => setShowChat(true)}
            className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 inline-flex items-center gap-3"
          >
            Get Started Now <Sparkles className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">AI College Senior</span>
          </div>
          <p className="text-gray-500 mb-4">
            Built with Care by Manas Jain, Malhar Joshi and Mehak Chugh
          </p>
          <p className="text-gray-600 text-sm">
            © 2025 AI College Senior. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
