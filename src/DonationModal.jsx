import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react'; // You'll need to install this library

// Custom styles can be added here
const modalStyles = {
  backdrop: 'fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50',
  modal: 'bg-gray-900 text-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300',
  header: 'text-2xl md:text-3xl font-bold mb-4 text-center',
  subHeader: 'text-sm md:text-md text-gray-400 mb-6 text-center',
  closeBtn: 'absolute top-4 right-4 text-gray-500 hover:text-white transition-colors duration-200',
  options: 'flex justify-center flex-wrap gap-4 mb-6',
  amountBtn: 'bg-gray-800 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-violet-600 transition-colors duration-200 cursor-pointer',
  amountBtnActive: 'bg-violet-600 text-white px-6 py-3 rounded-full text-lg font-semibold transition-colors duration-200',
  customInput: 'w-full bg-gray-800 text-center text-white text-3xl md:text-4xl rounded-2xl p-4 font-bold tracking-wide',
  orText: 'text-gray-500 font-bold text-center my-6',
  qrContainer: 'p-4 bg-white rounded-xl shadow-lg flex justify-center items-center',
  qrText: 'text-sm text-center text-gray-400 mt-4 font-mono',
  upiIdText: 'text-sm md:text-md text-center text-violet-400 font-bold mt-2',
  qrImage: 'w-64 h-64 rounded-lg',
};

const predefinedAmounts = [50, 100, 200];
const upiId = 'aashimasfund@upi'; // Replace with your actual UPI ID
const qrPlaceholderImage = 'https://placehold.co/256x256/333333/FFFFFF?text=QR+Code';

const DonationModal = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [upiLink, setUpiLink] = useState('');

  // Function to generate the UPI deep link
  const generateUpiLink = (amount) => {
    if (!amount || amount <= 0) {
      setUpiLink('');
      return;
    }
    const link = `upi://pay?pa=${upiId}&pn=Aashima's Fund&am=${amount}`;
    setUpiLink(link);
  };

  // Effect to handle amount changes and update the UPI link
  useEffect(() => {
    const amountToUse = selectedAmount || (customAmount ? Number(customAmount) : 0);
    generateUpiLink(amountToUse);
  }, [selectedAmount, customAmount]);

  // Handler for predefined buttons
  const handlePredefinedClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  // Handler for custom input field
  const handleCustomChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  if (!isOpen) return null;

  return (
    <div className={modalStyles.backdrop}>
      <div className={modalStyles.modal}>
        <button onClick={onClose} className={modalStyles.closeBtn}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className={modalStyles.header}>Aashima के नेक काम में योगदान दें 🙏</h2>
        <p className={modalStyles.subHeader}>आपका दिया हुआ हर एक रुपया बेघर जानवरों का पेट भरेगा।</p>
        
        {/* Predefined amount buttons */}
        <div className={modalStyles.options}>
          {predefinedAmounts.map(amount => (
            <div
              key={amount}
              className={selectedAmount === amount ? modalStyles.amountBtnActive : modalStyles.amountBtn}
              onClick={() => handlePredefinedClick(amount)}
            >
              ₹{amount}
            </div>
          ))}
        </div>
        
        <div className={modalStyles.orText}>OR</div>
        
        {/* Custom amount input */}
        <input 
          type="text" 
          placeholder="अपनी मर्ज़ी का amount डालें" 
          value={customAmount} 
          onChange={handleCustomChange} 
          className={modalStyles.customInput}
        />
        
        {/* QR Code and UPI ID */}
        {(selectedAmount > 0 || customAmount > 0) && (
          <div className="mt-8 flex flex-col items-center">
            <p className="text-xl font-bold mb-4">Scan & Pay</p>
            <div className={modalStyles.qrContainer}>
              {/* This is the placeholder image for the QR code */}
              <img src={qrPlaceholderImage} alt="Placeholder QR Code" className={modalStyles.qrImage} />
            </div>
            <p className={modalStyles.qrText}>
              Scan with any UPI app like GPay, PhonePe, Paytm, etc.
            </p>
            <p className={modalStyles.upiIdText}>
              UPI ID: {upiId}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

// Main App Component for demonstration
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center font-sans p-4 text-white">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 leading-tight">
        Aashima's Humanity Project
      </h1>
      <p className="text-lg md:text-xl text-center max-w-xl mb-8 text-gray-300">
        AI for juniors, funds for stray dogs. Let's make a difference together.
      </p>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="bg-violet-600 hover:bg-violet-700 transition-colors duration-200 text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-105"
      >
        Donate to Feed a Stray
      </button>

      {/* The Modal Component */}
      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

