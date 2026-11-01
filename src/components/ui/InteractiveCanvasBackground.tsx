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

interface Shape3D {
  xRatio: number;
  yRatio: number;
  zBase: number;
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  speedRotX: number;
  speedRotY: number;
  speedRotZ: number;
  speedFloatX: number;
  speedFloatY: number;
  floatOffset: number;
  vertices: [number, number, number][];
  edges: [number, number][];
  color: string;
}

// 3D Geometric Primitives
const OCTAHEDRON_VERTICES: [number, number, number][] = [
  [0, 1.2, 0],
  [0, -1.2, 0],
  [1, 0, 0],
  [-1, 0, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const OCTAHEDRON_EDGES: [number, number][] = [
  [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 2], [1, 3], [1, 4], [1, 5],
  [2, 4], [4, 3], [3, 5], [5, 2],
];

const CUBE_VERTICES: [number, number, number][] = [
  [-0.8, -0.8, -0.8], [0.8, -0.8, -0.8], [0.8, 0.8, -0.8], [-0.8, 0.8, -0.8],
  [-0.8, -0.8, 0.8], [0.8, -0.8, 0.8], [0.8, 0.8, 0.8], [-0.8, 0.8, 0.8],
];

const CUBE_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

const PHI = (1 + Math.sqrt(5)) / 2;
const ICOSAHEDRON_VERTICES: [number, number, number][] = [
  [-0.6, PHI * 0.6, 0], [0.6, PHI * 0.6, 0], [-0.6, -PHI * 0.6, 0], [0.6, -PHI * 0.6, 0],
  [0, -0.6, PHI * 0.6], [0, 0.6, PHI * 0.6], [0, -0.6, -PHI * 0.6], [0, 0.6, -PHI * 0.6],
  [PHI * 0.6, 0, -0.6], [PHI * 0.6, 0, 0.6], [-PHI * 0.6, 0, -0.6], [-PHI * 0.6, 0, 0.6],
];

const ICOSAHEDRON_EDGES: [number, number][] = [
  [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
  [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
  [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
  [4, 9], [9, 8], [8, 6], [6, 2], [2, 4],
  [4, 5], [5, 9], [9, 1], [1, 8], [8, 7],
  [7, 6], [6, 10], [10, 2], [2, 11], [11, 4]
];

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
    radarPulse: 0,
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
        xRatio: 0.22,
        yRatio: 0.28,
        radiusRatio: isAdmin ? 0.38 : 0.28,
        speedX: 0.0006,
        speedY: 0.0008,
        color: accentColor,
        alpha: isAdmin ? 0.32 : 0.12,
      },
      {
        xRatio: 0.78,
        yRatio: 0.62,
        radiusRatio: isAdmin ? 0.42 : 0.32,
        speedX: -0.0007,
        speedY: -0.0005,
        color: '#6366F1', // Indigo ambient
        alpha: isAdmin ? 0.26 : 0.08,
      },
      {
        xRatio: 0.5,
        yRatio: 0.85,
        radiusRatio: isAdmin ? 0.35 : 0.25,
        speedX: 0.0005,
        speedY: -0.0007,
        color: '#06B6D4', // Cyan electric
        alpha: isAdmin ? 0.22 : 0.07,
      },
      {
        xRatio: 0.85,
        yRatio: 0.18,
        radiusRatio: isAdmin ? 0.3 : 0.22,
        speedX: -0.0008,
        speedY: 0.0006,
        color: '#F59E0B', // Amber golden
        alpha: isAdmin ? 0.2 : 0.06,
      },
    ];

    // Floating 3D Wireframe Polyhedra for Admin God-Mode
    const shapes3D: Shape3D[] = isAdmin ? [
      {
        xRatio: 0.18,
        yRatio: 0.35,
        zBase: 0,
        scale: 48,
        rotX: 0.2, rotY: 0.4, rotZ: 0.1,
        speedRotX: 0.008, speedRotY: 0.012, speedRotZ: 0.005,
        speedFloatX: 0.0007, speedFloatY: 0.0009,
        floatOffset: 0,
        vertices: OCTAHEDRON_VERTICES,
        edges: OCTAHEDRON_EDGES,
        color: accentColor,
      },
      {
        xRatio: 0.82,
        yRatio: 0.28,
        zBase: 0,
        scale: 54,
        rotX: 0.5, rotY: 0.2, rotZ: 0.3,
        speedRotX: 0.01, speedRotY: 0.007, speedRotZ: 0.009,
        speedFloatX: -0.0006, speedFloatY: 0.0008,
        floatOffset: 1.5,
        vertices: ICOSAHEDRON_VERTICES,
        edges: ICOSAHEDRON_EDGES,
        color: '#6366F1',
      },
      {
        xRatio: 0.88,
        yRatio: 0.72,
        zBase: 0,
        scale: 44,
        rotX: 0.3, rotY: 0.6, rotZ: 0.2,
        speedRotX: 0.007, speedRotY: 0.011, speedRotZ: 0.006,
        speedFloatX: 0.0008, speedFloatY: -0.0006,
        floatOffset: 3.0,
        vertices: CUBE_VERTICES,
        edges: CUBE_EDGES,
        color: '#06B6D4',
      },
      {
        xRatio: 0.12,
        yRatio: 0.78,
        zBase: 0,
        scale: 50,
        rotX: 0.4, rotY: 0.1, rotZ: 0.5,
        speedRotX: 0.009, speedRotY: 0.008, speedRotZ: 0.01,
        speedFloatX: -0.0005, speedFloatY: -0.0007,
        floatOffset: 4.5,
        vertices: OCTAHEDRON_VERTICES,
        edges: OCTAHEDRON_EDGES,
        color: '#F59E0B',
      },
      {
        xRatio: 0.5,
        yRatio: 0.15,
        zBase: 0,
        scale: 38,
        rotX: 0.1, rotY: 0.7, rotZ: 0.3,
        speedRotX: 0.006, speedRotY: 0.009, speedRotZ: 0.004,
        speedFloatX: 0.0004, speedFloatY: 0.0005,
        floatOffset: 2.2,
        vertices: CUBE_VERTICES,
        edges: CUBE_EDGES,
        color: accentColor,
      },
    ] : [];

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
      mouseRef.current.radarPulse = (mouseRef.current.radarPulse + 0.02) % 1;

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
            ctx.lineTo(renderX + crossSize, renderY);
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

      // ── 3. 3D CURSOR-REACTIVE WIREFRAME POLYHEDRA (ADMIN ONLY) ──
      if (isAdmin && shapes3D.length > 0) {
        const cameraDist = 4.5;

        shapes3D.forEach((shape) => {
          // Floating parametric center position
          const centerX = width * shape.xRatio + Math.sin(now * shape.speedFloatX + shape.floatOffset) * (width * 0.06);
          const centerY = height * shape.yRatio + Math.cos(now * shape.speedFloatY + shape.floatOffset) * (height * 0.06);

          // Cursor proximity magnetic interaction
          const distToMouse = Math.hypot(centerX - mouse.x, centerY - mouse.y);
          const isNearMouse = mouse.isActive && distToMouse < 260;
          const mouseFactor = isNearMouse ? 1 - distToMouse / 260 : 0;

          // Accelerate rotation when cursor approaches
          const speedBoost = 1 + mouseFactor * 3.5;
          shape.rotX += shape.speedRotX * speedBoost;
          shape.rotY += shape.speedRotY * speedBoost;
          shape.rotZ += shape.speedRotZ * speedBoost;

          // 3D Rotation matrices (Euler)
          const radX = shape.rotX;
          const radY = shape.rotY;
          const radZ = shape.rotZ;

          const cosX = Math.cos(radX), sinX = Math.sin(radX);
          const cosY = Math.cos(radY), sinY = Math.sin(radY);
          const cosZ = Math.cos(radZ), sinZ = Math.sin(radZ);

          const currentScale = shape.scale * (1 + mouseFactor * 0.35);

          // Project 3D vertices to 2D
          const projected = shape.vertices.map(([vx, vy, vz]) => {
            // Rotate around X
            const y1 = vy * cosX - vz * sinX;
            const z1 = vy * sinX + vz * cosX;

            // Rotate around Y
            const x2 = vx * cosY + z1 * sinY;
            const z2 = -vx * sinY + z1 * cosY;

            // Rotate around Z
            const x3 = x2 * cosZ - y1 * sinZ;
            const y3 = x2 * sinZ + y1 * cosZ;

            // Perspective factor
            const factor = cameraDist / (cameraDist + z2);
            return {
              px: centerX + x3 * currentScale * factor,
              py: centerY + y3 * currentScale * factor,
              pz: z2,
            };
          });

          // Draw Edges
          ctx.save();
          ctx.strokeStyle = isNearMouse ? accentColor : shape.color;
          ctx.lineWidth = isNearMouse ? 1.5 : 1.0;
          ctx.globalAlpha = isNearMouse ? 0.75 : 0.28;

          ctx.beginPath();
          shape.edges.forEach(([i, j]) => {
            const p1 = projected[i];
            const p2 = projected[j];
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
          });
          ctx.stroke();

          // Draw Vertex Nodes
          projected.forEach((p) => {
            ctx.fillStyle = isNearMouse ? '#FFFFFF' : shape.color;
            ctx.globalAlpha = isNearMouse ? 0.9 : 0.45;
            ctx.beginPath();
            ctx.arc(p.px, p.py, isNearMouse ? 2.5 : 1.5, 0, Math.PI * 2);
            ctx.fill();
          });

          // Laser connection to cursor when magnetically engaged
          if (isNearMouse) {
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.globalAlpha = mouseFactor * 0.55;

            // Connect nearest 2 vertices to mouse
            const sorted = [...projected].sort(
              (a, b) => Math.hypot(a.px - mouse.x, a.py - mouse.y) - Math.hypot(b.px - mouse.x, b.py - mouse.y)
            );

            ctx.beginPath();
            ctx.moveTo(sorted[0].px, sorted[0].py);
            ctx.lineTo(mouse.x, mouse.y);
            if (sorted[1]) {
              ctx.moveTo(sorted[1].px, sorted[1].py);
              ctx.lineTo(mouse.x, mouse.y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
          }

          ctx.restore();
        });
      }

      // ── 4. ADMIN GOD-MODE TACTICAL LATTICE & RADAR HUD ──
      if (isAdmin && mouse.isActive) {
        // Concentric Radar Rings around cursor
        ctx.save();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.2;
        const ringRadius = mouse.radarPulse * 160;
        ctx.globalAlpha = (1 - mouse.radarPulse) * 0.5;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary tight tactical reticle
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 24, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Tactical lattice dashed lines to grid nodes
        if (nearestNodes.length > 0) {
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
        }

        // Cursor Coordinate Telemetry Pill (Admin Canvas HUD)
        ctx.save();
        ctx.font = '10px monospace';
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.75;
        const telemetry = `SYS_3D_CANVAS: [${Math.round(mouse.x)}, ${Math.round(mouse.y)}] | POLYHEDRA: 5 ACTIVE | RADAR: ONLINE`;
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
