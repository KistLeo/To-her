import React, { useState, useEffect } from 'react';
import Background from './components/Background';
import Envelope from './components/Envelope';
import Letter from './components/Letter';
import MusicPlayer from './components/MusicPlayer';
import { THEME } from './constants';

const App: React.FC = () => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // Update body background class for the warm transition
  useEffect(() => {
    if (accepted) {
        document.body.classList.add('warm-mode');
    } else {
        document.body.classList.remove('warm-mode');
    }
  }, [accepted]);

  // Success view with cinematic sequencing
  if (accepted) {
    return (
        <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-6">
             <Background variant="warm" />
             
             {/* Content Container - Cinematic Reveal */}
             <div className="z-20 text-center flex flex-col items-center max-w-3xl w-full">
                
                {/* 1. Header - Immediate Fade In */}
                <div className="mb-10 animate-fade-in flex flex-col items-center">
                    <p className="text-sm md:text-base text-[#9e8c8c] tracking-[0.2em] uppercase font-serif mb-4">
                        Restaurant Name
                    </p>
                    <h1 
                        className="text-5xl md:text-7xl text-[#d4a5a5] drop-shadow-sm"
                        style={{ fontFamily: THEME.fonts.serif }}
                    >
                        Le de fleur
                    </h1>
                </div>

                {/* 2. Message - Slow Upward Motion + Fade after 1s */}
                <div className="opacity-0 animate-fade-in-up delay-1000 mb-12">
                    <p 
                        className="text-xl md:text-2xl text-[#5d5555] leading-loose tracking-wide"
                        style={{ fontFamily: THEME.fonts.serif }}
                    >
                        So this will be my first February 14th<br/>
                        with the person and the love<br/>
                        I always dreamed I deserved.
                    </p>
                </div>

                {/* 3. Final Line - Soft Fade after 3.5s */}
                <div className="opacity-0 animate-fade-in-slow delay-3000 mt-4">
                    <p 
                        className="text-lg md:text-xl text-[#9e8c8c] italic"
                        style={{ fontFamily: THEME.fonts.serif }}
                    >
                        “No matter time and distance,<br/>
                        my heart will always choose you.”
                    </p>
                </div>

             </div>
             
             <MusicPlayer shouldPlay={true} shouldSwell={true} />
        </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center">
      <Background variant="default" />
      
      {/* Music Control - Autoplay enabled */}
      <MusicPlayer shouldPlay={true} />

      <main className="w-full relative z-10 flex flex-col items-center justify-center min-h-screen">
        {!isEnvelopeOpen ? (
          <Envelope onOpen={() => setIsEnvelopeOpen(true)} />
        ) : (
          <Letter onYes={() => setAccepted(true)} />
        )}
      </main>

      <footer className="fixed bottom-2 w-full text-center p-2 opacity-30 text-xs font-serif text-[#5d5555] pointer-events-none">
        Made with love
      </footer>
    </div>
  );
};

export default App;