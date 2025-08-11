import React, { useState } from "react";
import dogImage from "./assets/dogdonation.png";
import qrImage from "./assets/qr.jpg";

export default function DonationModal({ onClose, upiId, qrImageUrl }) {
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  const amount = ""; // Leave empty for the user to choose the amount

  // Function to handle the UPI payment link click
  const handleUpiPay = (appLink) => {
    // Attempt to open the UPI app directly
    window.open(appLink, '_blank');

    // If the app doesn't open after 1 second, show a fallback message.
    // The '_blank' target opens a new tab, which is then handled by the OS.
    // We can't reliably detect success, so a timeout is the best we can do.
    const timeout = setTimeout(() => {
      setShowFallbackMessage(true);
    }, 1000);

    // Clear the timeout if the user switches tabs, assuming the app opened.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clearTimeout(timeout);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange, { once: true });
  };

  // UPI links for specific apps. Using these can improve reliability.
  const googlePayLink = `upi://pay?pa=${upiId}&pn=Donation&am=${amount}&cu=INR&apn=com.google.android.apps.nbu.paisa.user`;
  const phonePeLink = `phonepe://pay?pa=${upiId}&pn=Donation&am=${amount}&cu=INR&apn=com.phonepe.app`;
  const paytmLink = `paytmmp://pay?pa=${upiId}&pn=Donation&am=${amount}&cu=INR&apn=net.one97.paytm`;
  const anyUpiLink = `upi://pay?pa=${upiId}&pn=Donation&am=${amount}&cu=INR`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-[#3d3d3d] rounded-2xl shadow-xl flex flex-col lg:flex-row items-center lg:items-start p-6 lg:p-8 w-full max-w-2xl text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl"
        >
          ✕
        </button>

        {/* Dog Image */}
        <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-6">
          <img
            src={dogImage}
            alt="Stray Dog"
            className="w-28 h-28 lg:w-40 lg:h-40 object-cover rounded-full"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center lg:items-start w-full">
          <h2 className="text-center lg:text-left text-lg lg:text-xl font-bold leading-snug">
            Millions of <span className="text-[#d3a362]">stray dogs</span> in India face starvation.{" "}
            <span role="img" aria-label="broken-heart">💔</span>
          </h2>
          
          <p className="mt-2 text-center lg:text-left font-semibold text-sm">
            Donate Any Amount you wish to donate
          </p>

          {/* QR Code and Buttons Container */}
          <div className="flex flex-col lg:flex-row items-center mt-4 w-full lg:gap-6">
            
            {/* QR Code */}
            <img
              src={qrImageUrl}
              alt="Donation QR"
              className="w-40 h-40 object-cover"
            />

            {/* Buttons */}
            <div className="flex flex-col gap-3 mt-4 lg:mt-0 w-full max-w-xs">
              <button
                onClick={() => handleUpiPay(googlePayLink)}
                className="bg-[#b8b3ff] text-black font-semibold py-2 rounded-xl text-center hover:opacity-90"
              >
                Google Pay
              </button>
              <button
                onClick={() => handleUpiPay(phonePeLink)}
                className="bg-[#b8b3ff] text-black font-semibold py-2 rounded-xl text-center hover:opacity-90"
              >
                PhonePe
              </button>
              <button
                onClick={() => handleUpiPay(paytmLink)}
                className="bg-[#b8b3ff] text-black font-semibold py-2 rounded-xl text-center hover:opacity-90"
              >
                Paytm
              </button>
              <button
                onClick={() => handleUpiPay(anyUpiLink)}
                className="bg-[#b8b3ff] text-black font-semibold py-2 rounded-xl text-center hover:opacity-90"
              >
                Any other UPI
              </button>
            </div>
          </div>
          
          {/* Fallback Message */}
          {showFallbackMessage && (
            <div className="mt-4 p-3 bg-red-500 rounded-lg text-white text-center">
              The app did not open. Please scan the QR code directly.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
