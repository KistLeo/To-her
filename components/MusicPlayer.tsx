import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { MUSIC_URL } from '../constants';

interface MusicPlayerProps {
  shouldPlay: boolean;
  shouldSwell?: boolean; // New prop to trigger volume increase
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ shouldPlay, shouldSwell }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userMuted, setUserMuted] = useState(false);

  // Initialize with low volume for gentle start
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = 0.1; // Start very quiet
        
        // Gentle fade in on load
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

  // Handle play/pause
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

  // Fallback: Try to play on any user interaction if it failed to autoplay
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

  // Handle volume swell effect
  useEffect(() => {
    if (shouldSwell && audioRef.current && !userMuted) {
        // Ensure volume cap logic handles existing volume
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

export default MusicPlayer;