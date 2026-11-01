'use client';

import React, { useEffect, useRef } from 'react';
import { useTrip } from '@/context/TripContext';

interface InteractiveCanvasBackgroundProps {
  variant?: 'global' | 'admin';
}

interface Orb {
  xRatio: number;
  yRatio: number;
  radiusRatio: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
}

export default function InteractiveCanvasBackground({
  variant = 'global',
}: InteractiveCanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeTrip } = useTrip();
  const accentColor = activeTrip?.accent_color || '#2563EB';

  const mouseRef = useRef({
    x: -2000,
    y: -2000,
    targetX: -2000,
    targetY: -2000,
    isActive: false,
  });

  const isAdmin = variant === 'admin';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isTabVisible = true;

    // Ambient floating orbs with harmonic color mixing
    const orbs: Orb[] = [
      {
        xRatio: 0.25,
        yRatio: 0.3,
        radiusRatio: isAdmin ? 0.35 : 0.28,
        speedX: 0.0006,
        speedY: 0.0008,
        color: accentColor,
        alpha: isAdmin ? 0.28 : 0.12,
      },
      {
        xRatio: 0.75,
        yRatio: 0.65,
        radiusRatio: isAdmin ? 0.4 : 0.32,
        speedX: -0.0007,
        speedY: -0.0005,
        color: '#6366F1', // Indigo ambient
        alpha: isAdmin ? 0.22 : 0.08,
      },
      {
        xRatio: 0.5,
        yRatio: 0.8,
        radiusRatio: isAdmin ? 0.32 : 0.25,
        speedX: 0.0005,
        speedY: -0.0007,
        color: '#06B6D4', // Cyan electric
        alpha: isAdmin ? 0.2 : 0.07,
      },
      {
        xRatio: 0.8,
        yRatio: 0.2,
        radiusRatio: isAdmin ? 0.28 : 0.22,
        speedX: -0.0008,
        speedY: 0.0006,
        color: '#F59E0B', // Amber golden
        alpha: isAdmin ? 0.18 : 0.06,
      },
    ];

    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking with smooth lerp
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.isActive = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
      mouseRef.current.targetX = -2000;
      mouseRef.current.targetY = -2000;
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTime = performance.now();
        render(lastTime);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();

    const render = (now: number) => {
      if (!isTabVisible) return;

      lastTime = now;

      // Mouse position lerping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.15;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // ── 1. DRAW MORPHING AMBIENT LIGHT GRADIENTS ──
      ctx.globalCompositeOperation = 'screen';

      orbs.forEach((orb, i) => {
        const timeOffset = i * 2.5;
        const currentX =
          width * orb.xRatio + Math.sin(now * orb.speedX + timeOffset) * (width * 0.12);
        const currentY =
          height * orb.yRatio + Math.cos(now * orb.speedY + timeOffset) * (height * 0.12);
        const radius = Math.max(width, height) * orb.radiusRatio;

        const gradient = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          radius
        );

        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(0.4, `${orb.color}66`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.globalAlpha = orb.alpha;
        ctx.beginPath();
        ctx.arc(currentX, currentY, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;

      // ── 2. DRAW CURSOR-REACTIVE GEOMETRIC GRID PATTERN ──
      const gridPitch = isAdmin ? 36 : 42;
      const mouse = mouseRef.current;
      const reactiveRadius = isAdmin ? 220 : 180;
      const reactiveRadiusSq = reactiveRadius * reactiveRadius;

      const startX = 0;
      const startY = 0;
      const endX = width;
      const endY = height;

      const nearestNodes: { x: number; y: number; dist: number }[] = [];

      for (let x = startX; x <= endX; x += gridPitch) {
        for (let y = startY; y <= endY; y += gridPitch) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (mouse.isActive && distSq < reactiveRadiusSq) {
            const dist = Math.sqrt(distSq);
            const intensity = 1 - dist / reactiveRadius;

            if (isAdmin && nearestNodes.length < 5) {
              nearestNodes.push({ x, y, dist });
            }

            // Magnetic displacement
            const pushFactor = (1 - dist / reactiveRadius) * (isAdmin ? 4.5 : 2.5);
            const renderX = x - (dx / (dist || 1)) * pushFactor;
            const renderY = y - (dy / (dist || 1)) * pushFactor;

            // Reactive tactical crosshair (+)
            ctx.save();
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = isAdmin ? 1.5 : 1.2;
            ctx.globalAlpha = intensity * (isAdmin ? 0.9 : 0.65);

            const crossSize = isAdmin ? 5 : 3.5;
            ctx.beginPath();
            ctx.moveTo(renderX - crossSize, renderY);
            ctx.lineTo(renderX + crossSize, renderY);
            ctx.moveTo(renderX, renderY - crossSize);
            ctx.lineTo(renderX, renderY + crossSize);
            ctx.stroke();

            // Tactical glowing inner node
            ctx.fillStyle = '#FFFFFF';
            ctx.globalAlpha = intensity * 0.8;
            ctx.fillRect(renderX - 1, renderY - 1, 2, 2);
            ctx.restore();
          } else {
            // Subtle baseline tactical node
            ctx.fillStyle = isAdmin ? '#52525B' : '#71717A';
            ctx.globalAlpha = isAdmin ? 0.18 : 0.08;
            ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
          }
        }
      }

      // ── 3. ADMIN GOD-MODE TACTICAL LATTICE & TELEMETRY ──
      if (isAdmin && mouse.isActive && nearestNodes.length > 0) {
        ctx.save();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        nearestNodes.forEach(node => {
          const ratio = 1 - node.dist / reactiveRadius;
          ctx.globalAlpha = ratio * 0.45;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        });
        ctx.restore();

        // Cursor Coordinate Telemetry Pill (Admin Canvas HUD)
        ctx.save();
        ctx.font = '10px monospace';
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.7;
        const telemetry = `SYS_GRID: [${Math.round(mouse.x)}, ${Math.round(mouse.y)}] | LAT: 19.896 N | ACCENT_SYNC: ONLINE`;
        ctx.fillText(telemetry, 24, height - 24);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [accentColor, isAdmin]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-[-1] overflow-hidden ${
        isAdmin ? 'bg-[#060608]' : 'bg-[var(--bg-color)]'
      }`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
