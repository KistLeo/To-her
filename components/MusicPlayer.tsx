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

  // Initialize with low volume
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = 0.2;
    }
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (shouldPlay && !userMuted) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              console.log("Autoplay prevented:", error);
              setIsPlaying(false);
            });
        }
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [shouldPlay, userMuted]);

  // Handle volume swell effect
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

export default MusicPlayer;
