import React, { useState } from 'react';
import { THEME } from '../constants';

interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    // Delay the actual onOpen callback to allow animation to play partially
    setTimeout(() => {
        onOpen();
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full relative z-10 p-4">
      <div 
        className={`relative w-full max-w-[320px] h-[220px] sm:max-w-[400px] sm:h-[260px] cursor-pointer transition-transform duration-500 ease-in-out ${isHovered && !isOpening ? 'scale-105' : ''} ${isOpening ? 'scale-110 opacity-0 translate-y-20' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        style={{ perspective: '1000px', transitionProperty: 'transform, opacity' }}
      >
        {/* Envelope Body (Back) */}
        <div 
          className="absolute inset-0 rounded-lg shadow-xl"
          style={{ backgroundColor: '#e8d5d5' }} 
        />

        {/* The Letter inside (Preview) */}
        <div 
          className={`absolute left-4 right-4 bg-white transition-all duration-700 ease-in-out`}
          style={{ 
            top: '10px',
            bottom: '10px',
            transform: isOpening ? 'translateY(-100px)' : 'translateY(0)',
            zIndex: 1
          }}
        >
             <div className="p-4 text-xs sm:text-sm text-gray-400 font-serif opacity-50">
                Dearest...
             </div>
        </div>

        {/* Bottom Flap */}
        <div 
          className="absolute bottom-0 w-full h-0 border-l-[160px] sm:border-l-[200px] border-l-transparent border-r-[160px] sm:border-r-[200px] border-r-transparent border-b-[110px] sm:border-b-[130px] z-20"
          style={{ borderBottomColor: '#dcb8b8' }} 
        />
        
        {/* Left Flap */}
         <div 
          className="absolute top-0 left-0 h-full w-0 border-t-[110px] sm:border-t-[130px] border-t-transparent border-b-[110px] sm:border-b-[130px] border-b-transparent border-l-[160px] sm:border-l-[200px] z-20"
          style={{ borderLeftColor: '#e2caca' }} 
        />

        {/* Right Flap */}
        <div 
          className="absolute top-0 right-0 h-full w-0 border-t-[110px] sm:border-t-[130px] border-t-transparent border-b-[110px] sm:border-b-[130px] border-b-transparent border-r-[160px] sm:border-r-[200px] z-20"
          style={{ borderRightColor: '#e2caca' }} 
        />

        {/* Top Flap (The one that opens) */}
        <div 
          className={`absolute top-0 left-0 w-full h-0 border-l-[160px] sm:border-l-[200px] border-l-transparent border-r-[160px] sm:border-r-[200px] border-r-transparent border-t-[110px] sm:border-t-[130px] origin-top transition-transform duration-700 ease-in-out z-30`}
          style={{ 
            borderTopColor: '#d4a5a5',
            transform: isOpening || isHovered ? 'rotateX(180deg)' : 'rotateX(0deg)',
            zIndex: isOpening || isHovered ? 10 : 30 // Drop z-index when open so letter can slide out nicely
          }} 
        />
        
        {/* Wax Seal */}
        <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-opacity duration-300 z-40`}
            style={{ 
                backgroundColor: '#b54e4e',
                opacity: isOpening ? 0 : 1,
                top: '45%'
            }}
        >
             <span className="text-[#e8d5d5] text-2xl" style={{ fontFamily: THEME.fonts.cursive }}>♥</span>
        </div>
        
        {/* Click Instruction */}
        {!isOpening && (
             <div className="absolute -bottom-16 w-full text-center text-gray-500 font-serif animate-pulse tracking-widest text-sm">
                (Click to open)
             </div>
        )}
      </div>
    </div>
  );
};

export default Envelope;
