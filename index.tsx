import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Volume2, VolumeX } from 'lucide-react';

// --- TYPES ---
interface Position {
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
}

// --- CONSTANTS ---
const MUSIC_URL = "./lover.mp3";

const LETTER_CONTENT = `From the moment you walked into my life, everything felt softer, warmer, and brighter.

I don’t need grand fireworks or loud confessions — just this quiet moment to ask you something simple…

Will you be my Valentine?`;

const THEME = {
  colors: {
    bg: '#fdfbf7',
    bgWarm: '#fff5f5',
    primary: '#d4a5a5',
    secondary: '#9e8c8c',
    text: '#5d5555',
    accent: '#ff8fa3',
    gold: '#d4af37'
  },
  fonts: {
    serif: "'Playfair Display', serif",
    cursive: "'Great Vibes', cursive"
  }
};

// --- COMPONENTS ---

// 1. Background Component
interface BackgroundProps {
    variant?: 'default' | 'warm';
}

const Background: React.FC<BackgroundProps> = ({ variant = 'default' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      size: Math.random() * 15 + 5,
      speedY: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.3 + 0.1
    });

    for (let i = 0; i < 30; i++) {
      particles.current.push({
        ...createParticle(),
        y: Math.random() * canvas.height
      });
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      
      if (variant === 'warm') {
        ctx.fillStyle = Math.random() > 0.5 ? '#eecfa1' : '#ffb7b2'; 
      } else {
        ctx.fillStyle = '#ffcfd8';
      }

      ctx.translate(x, y);
      
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, size / 2, 0, size * 0.8, 0, size);
      ctx.bezierCurveTo(0, size * 0.8, size / 2, size / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p, index) => {
        p.y -= p.speedY;
        drawHeart(ctx, p.x, p.y, p.size, p.opacity);

        if (p.y < -50) {
          particles.current[index] = createParticle();
        }
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};

// 2. Envelope Component
interface EnvelopeProps {
  onOpen: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
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
        <div 
          className="absolute inset-0 rounded-lg shadow-xl"
          style={{ backgroundColor: '#e8d5d5' }} 
        />
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
        <div 
          className="absolute bottom-0 w-full h-0 border-l-[160px] sm:border-l-[200px] border-l-transparent border-r-[160px] sm:border-r-[200px] border-r-transparent border-b-[110px] sm:border-b-[130px] z-20"
          style={{ borderBottomColor: '#dcb8b8' }} 
        />
         <div 
          className="absolute top-0 left-0 h-full w-0 border-t-[110px] sm:border-t-[130px] border-t-transparent border-b-[110px] sm:border-b-[130px] border-b-transparent border-l-[160px] sm:border-l-[200px] z-20"
          style={{ borderLeftColor: '#e2caca' }} 
        />
        <div 
          className="absolute top-0 right-0 h-full w-0 border-t-[110px] sm:border-t-[130px] border-t-transparent border-b-[110px] sm:border-b-[130px] border-b-transparent border-r-[160px] sm:border-r-[200px] z-20"
          style={{ borderRightColor: '#e2caca' }} 
        />
        <div 
          className={`absolute top-0 left-0 w-full h-0 border-l-[160px] sm:border-l-[200px] border-l-transparent border-r-[160px] sm:border-r-[200px] border-r-transparent border-t-[110px] sm:border-t-[130px] origin-top transition-transform duration-700 ease-in-out z-30`}
          style={{ 
            borderTopColor: '#d4a5a5',
            transform: isOpening || isHovered ? 'rotateX(180deg)' : 'rotateX(0deg)',
            zIndex: isOpening || isHovered ? 10 : 30
          }} 
        />
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
        {!isOpening && (
             <div className="absolute -bottom-16 w-full text-center text-gray-500 font-serif animate-pulse tracking-widest text-sm">
                (Click to open)
             </div>
        )}
      </div>
    </div>
  );
};

// 3. Letter Component
interface LetterProps {
  onYes: () => void;
}

const Letter: React.FC<LetterProps> = ({ onYes }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState<Position>({ x: 0, y: 0 });
  const [isNoBtnMoved, setIsNoBtnMoved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText]);

  const handleNoHover = () => {
    const maxX = 100;
    const maxY = 80;
    
    let x = (Math.random() - 0.5) * 2 * maxX;
    let y = (Math.random() - 0.5) * 2 * maxY;

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
        <div className="absolute inset-0 bg-[#fdfbf7] opacity-90 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col h-full items-center">
            <h1 
                className="text-4xl md:text-5xl text-[#d4a5a5] mb-8 text-center"
                style={{ fontFamily: THEME.fonts.cursive }}
            >
                My Dearest,
            </h1>

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
                    onClick={handleNoHover}
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

// 4. MusicPlayer Component
interface MusicPlayerProps {
  shouldPlay: boolean;
  shouldSwell?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ shouldPlay, shouldSwell }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userMuted, setUserMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = 0.1;
        const fadeIn = setInterval(() => {
             if (audioRef.current && audioRef.current.volume < 0.2) {
                 audioRef.current.volume += 0.01;
             } else {
                 clearInterval(fadeIn);
             }
        }, 200);
        return () => clearInterval(fadeIn);
    }
  }, []);

  useEffect(() => {
    const playAudio = async () => {
        if (audioRef.current) {
            if (shouldPlay && !userMuted) {
              try {
                await audioRef.current.play();
                setIsPlaying(true);
              } catch (error) {
                console.log("Autoplay prevented:", error);
                setIsPlaying(false);
              }
            } else {
              audioRef.current.pause();
              setIsPlaying(false);
            }
          }
    };

    playAudio();
  }, [shouldPlay, userMuted]);

  useEffect(() => {
      const handleInteraction = () => {
          if (shouldPlay && !userMuted && audioRef.current && audioRef.current.paused) {
              audioRef.current.play()
                  .then(() => setIsPlaying(true))
                  .catch(() => {});
          }
      };

      window.addEventListener('click', handleInteraction);
      return () => window.removeEventListener('click', handleInteraction);
  }, [shouldPlay, userMuted]);

  useEffect(() => {
    if (shouldSwell && audioRef.current && !userMuted) {
        const fadeAudio = setInterval(() => {
            if (audioRef.current && audioRef.current.volume < 0.6) {
                audioRef.current.volume = Math.min(0.6, audioRef.current.volume + 0.05);
            } else {
                clearInterval(fadeAudio);
            }
        }, 200);

        return () => clearInterval(fadeAudio);
    }
  }, [shouldSwell, userMuted]);

  const toggleMute = () => {
    setUserMuted(prev => !prev);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />
      <button
        onClick={toggleMute}
        className="p-3 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-all duration-300 text-[#5d5555] hover:text-[#d4a5a5]"
        aria-label="Toggle music"
      >
        {isPlaying && !userMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </div>
  );
};

// 5. Main App Component
const App: React.FC = () => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (accepted) {
        document.body.classList.add('warm-mode');
    } else {
        document.body.classList.remove('warm-mode');
    }
  }, [accepted]);

  if (accepted) {
    return (
        <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-6">
             <Background variant="warm" />
             
             <div className="z-20 text-center flex flex-col items-center max-w-3xl w-full">
                
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

// --- MOUNTING ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);