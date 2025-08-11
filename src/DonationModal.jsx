import React, { useState } from "react";
import dogImage from "./assets/dogdonation.png";
import qrImage from "./assets/qr.jpg";

export default function DonationModal({ onClose }) {
  const upiId = "manaspersonal3377@okhdfcbank";
  // `copyStatus` state is used to show a message after copying.
  const [copyStatus, setCopyStatus] = useState("");

  // This function copies the UPI ID to the clipboard.
  const handleCopyUpiId = () => {
    // Use `document.execCommand('copy')` because `navigator.clipboard.writeText()`
    // may not work in iFrames.
    const el = document.createElement('textarea');
    el.value = upiId; // Copy only the UPI ID
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // Display a message after copying.
    setCopyStatus("UPI ID copied!");
    setTimeout(() => setCopyStatus(""), 2000); // Remove the message after 2 seconds
  };

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
        <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-6 flex justify-center lg:justify-start">
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
          <div className="flex flex-col items-center mt-4 w-full">
            
            {/* QR Code */}
            <img
              src={qrImage}
              alt="Donation QR"
              className="w-40 h-40 object-cover"
            />

            {/* Payment Section */}
            <div className="mt-4 w-full max-w-xs flex flex-col items-center">
              <p className="text-center text-gray-300 font-semibold mb-2">Or, copy UPI ID to pay</p>
              <button
                onClick={handleCopyUpiId}
                className="w-full bg-[#d3a362] text-black font-semibold py-2 rounded-xl text-center hover:opacity-90 transition-colors"
              >
                Copy UPI ID
              </button>
              {copyStatus && (
                <div className="text-green-400 text-sm mt-2 text-center">
                  {copyStatus}
                </div>
              )}
            </div>
          </div>
          
          {/* Instructions for the user */}
          <div className="mt-4 p-3 bg-gray-700 rounded-lg text-white text-center w-full">
            You can donate from any UPI app, just paste the UPI ID there.
          </div>
        </div>
      </div>
    </div>
  );
}
