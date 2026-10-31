'use client';

import React, { useEffect, useRef } from 'react';

interface PhysicsTextProps {
  text?: string;
  className?: string;
}

export default function PhysicsText({ text = 'JYOTIRLING', className = '' }: PhysicsTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;

    // Dynamically retrieve the current CSS custom property --accent
    const getAccentColor = (): string => {
      const computed = getComputedStyle(canvas).getPropertyValue('--accent').trim();
      return computed || '#2563EB';
    };

    let currentAccentColor = getAccentColor();

    const adjustCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth || 800;
        canvas.height = 150; // Fixed height for footer to prevent CLS
      }
    };

    const handleResize = () => {
      adjustCanvasSize();
      currentAccentColor = getAccentColor();
      init();
    };

    window.addEventListener('resize', handleResize);
    adjustCanvasSize();

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 80,
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.touches[0].clientX - rect.left;
        mouse.y = event.touches[0].clientY - rect.top;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchend', handleMouseLeave);

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = currentAccentColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = mouse.radius;

        if (distance < maxDistance && distance > 0) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            const stepDx = this.x - this.baseX;
            this.x -= stepDx / 10;
          }
          if (this.y !== this.baseY) {
            const stepDy = this.y - this.baseY;
            this.y -= stepDy / 10;
          }
        }
      }
    }

    const init = () => {
      particlesArray = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate font size relative to canvas width
      const fontSize = Math.min(canvas.width / 7, 110);
      ctx.fillStyle = 'white';
      ctx.font = `900 ${fontSize}px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0, y2 = textCoordinates.height; y < y2; y += 4) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x += 4) {
          // Alpha channel threshold
          if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
            particlesArray.push(new Particle(x, y));
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    // Tiny initial delay for custom font rendering
    const fontTimer = setTimeout(() => {
      init();
      animate();
    }, 250);

    return () => {
      clearTimeout(fontTimer);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchend', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text]);

  return (
    <div className={`w-full h-[150px] min-h-[150px] relative overflow-hidden flex items-center justify-center ${className}`}>
      <canvas 
        ref={canvasRef} 
        height={150}
        className="w-full h-[150px] cursor-crosshair touch-none block"
        style={{ display: 'block' }}
      />
    </div>
  );
}
