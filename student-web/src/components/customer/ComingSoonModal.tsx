"use client";

import React, { useEffect, useState } from "react";

interface ComingSoonModalProps {
  onClose: () => void;
}

export default function ComingSoonModal({ onClose }: ComingSoonModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation after mount
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-300 cursor-pointer ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />
      <div 
        className={`fixed top-1/2 left-1/2 z-[9999] w-full max-w-[calc(100%-2rem)] sm:max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] outline-none overflow-hidden transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        role="dialog"
      >
        {/* Decorative background shapes */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-green/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl"></div>

        <button 
          onClick={handleClose} 
          type="button" 
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="relative w-20 h-20 flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-brand-green/20 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-brand-green w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-brand-green/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21 16-4 4-4-4"/>
                <path d="M17 20V4"/>
                <path d="m3 8 4-4 4 4"/>
                <path d="M7 4v16"/>
              </svg>
            </div>
          </div>

          <h2 className="font-bold text-2xl text-gray-900 mb-2 font-inter tracking-tight">Coming Soon!</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-sm">
            We are working on something absolutely spectacular. Stay tuned for a brand new About Us experience!
          </p>

          <button 
            onClick={handleClose}
            className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-medium py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-green/20 active:scale-95 cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </>
  );
}
