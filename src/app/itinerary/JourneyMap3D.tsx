'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Float } from '@react-three/drei';
import * as THREE from 'three';

interface City {
  name: string;
  code: string;
  pos: [number, number, number];
  day: number;
  color: string;
}

const CITIES: City[] = [
  { name: 'Howrah', code: 'HWH', pos: [5.5, 0, -2.5], day: 1, color: '#3B82F6' },
  { name: 'Jalgaon', code: 'JLG', pos: [1.2, 0, -1.0], day: 2, color: '#F59E0B' },
  { name: 'Aurangabad', code: 'AUR', pos: [-0.5, 0, 0.2], day: 3, color: '#8B5CF6' },
  { name: 'Shirdi', code: 'SRD', pos: [-2.0, 0, 0.8], day: 5, color: '#EF4444' },
  { name: 'Nashik', code: 'NK', pos: [-3.2, 0, -0.4], day: 6, color: '#10B981' },
  { name: 'Pune', code: 'PUNE', pos: [-2.8, 0, 2.5], day: 8, color: '#EC4899' },
];

// ── Flowing Glow Pulse ──────────────────────────────────
function FlowingPulse({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);

  useFrame((_, delta) => {
    progress.current = (progress.current + delta * 0.12) % 1;
    if (meshRef.current) {
      const pt = curve.getPoint(progress.current);
      meshRef.current.position.copy(pt);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.18, 16, 16]} />
      <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={4} />
    </mesh>
  );
}

// ── Glowing Curved Route Tube ───────────────────────────
function GlowingRoute({ cities }: { cities: City[] }) {
  const curve = useMemo(() => {
    const pts = cities.map(c => new THREE.Vector3(...c.pos));
    // Add elevated arcs between nodes for 3D depth
    const elevatedPts: THREE.Vector3[] = [];
    for (let i = 0; i < pts.length; i++) {
      elevatedPts.push(pts[i]);
      if (i < pts.length - 1) {
        const mid = new THREE.Vector3().addVectors(pts[i], pts[i + 1]).multiplyScalar(0.5);
        mid.y += 0.8; // elevated arc curve
        elevatedPts.push(mid);
      }
    }
    return new THREE.CatmullRomCurve3(elevatedPts, false, 'catmullrom', 0.5);
  }, [cities]);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
  }, [curve]);

  return (
    <>
      {/* Route Tube */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#3B82F6"
          emissive="#6366F1"
          emissiveIntensity={1.8}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Moving Particle */}
      <FlowingPulse curve={curve} />
    </>
  );
}

// ── 3D City Marker Pin ──────────────────────────────────
function CityNodePin({ city, selected, onClick }: {
  city: City; selected: boolean; onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + city.day) * 0.06;
    }
  });

  return (
    <group position={city.pos} ref={groupRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Ring base on ground */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.25, selected ? 0.45 : 0.35, 32]} />
        <meshBasicMaterial color={city.color} transparent opacity={selected ? 0.8 : 0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Vertical Pin stem */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 12]} />
        <meshStandardMaterial color={city.color} emissive={city.color} emissiveIntensity={1} />
      </mesh>

      {/* Glowing Head Sphere */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[selected ? 0.28 : 0.22, 24, 24]} />
        <meshStandardMaterial
          color={city.color}
          emissive={city.color}
          emissiveIntensity={selected ? 2.5 : 1.2}
          roughness={0.2}
        />
      </mesh>

      <pointLight color={city.color} intensity={selected ? 4 : 1.5} distance={4} />

      {/* Interactive HTML Badge */}
      <Html position={[0, 1.3, 0]} center>
        <button
          onClick={onClick}
          style={{
            background: selected ? city.color : 'rgba(18, 26, 45, 0.92)',
            backdropFilter: 'blur(16px)',
            border: `1.5px solid ${selected ? '#FFFFFF' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: 14,
            padding: '6px 14px',
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 800,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            boxShadow: selected ? `0 8px 24px ${city.color}80` : '0 4px 16px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease',
            transform: selected ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          {city.code}
          <span style={{ marginLeft: 6, opacity: 0.8, fontSize: 10, fontWeight: 600 }}>
            Day {city.day}
          </span>
        </button>
      </Html>
    </group>
  );
}

// ── 3D Terrain Grid Floor ───────────────────────────────
function FloorGrid() {
  return (
    <group position={[0, -0.05, 0]}>
      <gridHelper args={[30, 30, '#3B82F6', '#1E293B']} position={[0, 0, 0]} />
    </group>
  );
}

// ── Smooth Camera Controller ────────────────────────────
function CameraController({ target }: { target: [number, number, number] | null }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!target) return;
    const [tx, ty, tz] = target;
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(tx + 1.5, 5, tz + 4.5);
    let p = 0;

    const interval = setInterval(() => {
      p += 0.05;
      camera.position.lerpVectors(startPos, endPos, Math.min(p, 1));
      if (p >= 1) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [target, camera]);

  return null;
}

// ── Main 3D Canvas ──────────────────────────────────────
export default function JourneyMap3D({ selectedDay, onSelectCity }: {
  selectedDay: number | null;
  onSelectCity: (day: number) => void;
}) {
  const selectedCity = CITIES.find(c => c.day === selectedDay) ?? null;

  return (
    <Canvas
      camera={{ position: [0, 8, 11], fov: 45 }}
      style={{ background: '#070B14', width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#93C5FD" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#8B5CF6" />

      <Stars radius={60} depth={40} count={2500} factor={3} saturation={0} fade speed={0.8} />

      <FloorGrid />
      <GlowingRoute cities={CITIES} />

      {CITIES.map((c) => (
        <CityNodePin
          key={c.name}
          city={c}
          selected={selectedDay === c.day}
          onClick={() => onSelectCity(c.day)}
        />
      ))}

      <CameraController target={selectedCity ? selectedCity.pos : null} />

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        autoRotate={!selectedDay}
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={4}
        maxDistance={22}
      />
    </Canvas>
  );
}
