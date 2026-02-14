import React, { useEffect, useRef } from 'react';
import { Particle } from '../types';

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

    // Initialize particles
    const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      size: Math.random() * 15 + 5,
      speedY: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.3 + 0.1
    });

    // Populate initial particles
    for (let i = 0; i < 30; i++) {
      particles.current.push({
        ...createParticle(),
        y: Math.random() * canvas.height
      });
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      
      // Change color based on variant
      if (variant === 'warm') {
        // Mix of gold and warmer pink
        ctx.fillStyle = Math.random() > 0.5 ? '#eecfa1' : '#ffb7b2'; 
      } else {
        ctx.fillStyle = '#ffcfd8';
      }

      ctx.translate(x, y);
      
      // Heart shape path
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
        
        // Draw
        drawHeart(ctx, p.x, p.y, p.size, p.opacity);

        // Reset if off screen
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
  }, [variant]); // Re-run if variant changes

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};

export default Background;
