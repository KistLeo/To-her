import React, { useState, useEffect, useRef } from 'react';
import { THEME, LETTER_CONTENT } from '../constants';
import { Position } from '../types';

interface LetterProps {
  onYes: () => void;
}

const Letter: React.FC<LetterProps> = ({ onYes }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState<Position>({ x: 0, y: 0 });
  const [isNoBtnMoved, setIsNoBtnMoved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= LETTER_CONTENT.length) {
        setDisplayedText(LETTER_CONTENT.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 50); // Speed of typing

    return () => clearInterval(typingInterval);
  }, []);

  // Auto-scroll when text updates
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText]);

  const handleNoHover = () => {
    const maxX = 100; // Reduced movement range slightly for better usability
    const maxY = 80;
    
    // Generate random movement within range, ensure it's not 0
    let x = (Math.random() - 0.5) * 2 * maxX;
    let y = (Math.random() - 0.5) * 2 * maxY;

    // Ensure it moves somewhat significantly
    if (Math.abs(x) < 40) x = x < 0 ? -50 : 50;
    if (Math.abs(y) < 20) y = y < 0 ? -30 : 30;

    setNoBtnPosition({ x, y });
    setIsNoBtnMoved(true);
  };

  return (
    <div className="relative z-20 w-full max-w-2xl mx-auto p-4 animate-fade-in-up">
      <div 
        className="bg-white/90 backdrop-blur-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-sm p-8 md:p-12 relative overflow-hidden min-h-[60vh] flex flex-col"
        style={{
            backgroundImage: `linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '-1px -1px'
        }}
      >
        {/* Paper Texture Overlay (Subtle) */}
        <div className="absolute inset-0 bg-[#fdfbf7] opacity-90 pointer-events-none"></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full items-center">
            
            {/* Header */}
            <h1 
                className="text-4xl md:text-5xl text-[#d4a5a5] mb-8 text-center"
                style={{ fontFamily: THEME.fonts.cursive }}
            >
                My Dearest,
            </h1>

            {/* Body Text */}
            <div 
                ref={scrollRef}
                className="flex-grow w-full text-center mb-12 overflow-y-auto max-h-[50vh] scroll-smooth"
            >
                <p 
                    className="text-lg md:text-xl leading-relaxed text-[#5d5555] whitespace-pre-line"
                    style={{ fontFamily: THEME.fonts.serif }}
                >
                    {displayedText}
                    <span className={`inline-block w-0.5 h-5 ml-1 bg-[#d4a5a5] ${isTypingComplete ? 'hidden' : 'animate-pulse'}`}></span>
                </p>
            </div>

            {/* Buttons Area */}
            <div 
                className={`flex flex-col md:flex-row gap-6 items-center justify-center transition-opacity duration-1000 ${isTypingComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <button
                    onClick={onYes}
                    className="group relative px-8 py-3 bg-[#d4a5a5] text-white rounded-full font-serif text-lg tracking-wide hover:bg-[#c29191] transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(212,165,165,0.6)] transform hover:scale-105"
                >
                    <span className="relative z-10">Yes, I will</span>
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:animate-ping"></div>
                </button>

                <div 
                    className="relative transition-all duration-300 ease-out"
                    style={{
                        transform: isNoBtnMoved ? `translate(${noBtnPosition.x}px, ${noBtnPosition.y}px)` : 'none',
                        position: isNoBtnMoved ? 'relative' : 'relative'
                    }}
                    onMouseEnter={handleNoHover}
                    onClick={handleNoHover} /* Also move on click for mobile/touch */
                >
                    <button
                        className="px-8 py-3 bg-white border border-[#d4a5a5] text-[#d4a5a5] rounded-full font-serif text-lg tracking-wide hover:bg-[#fcf5f5] transition-colors shadow-sm"
                    >
                        Let me think...
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Letter;