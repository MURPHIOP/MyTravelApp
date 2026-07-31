'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

interface City {
  name: string;
  code: string;
  pos: [number, number, number];
  day: number;
  color: string;
}

const CITIES: City[] = [
  { name: 'Howrah', code: 'HWH', pos: [4.2, 0, -3.5], day: 1, color: '#3B82F6' },
  { name: 'Jalgaon', code: 'JLG', pos: [-0.5, 0, -2.2], day: 2, color: '#F59E0B' },
  { name: 'Aurangabad', code: 'AUR', pos: [-0.8, 0, -1.0], day: 3, color: '#8B5CF6' },
  { name: 'Shirdi', code: 'SRD', pos: [-1.6, 0, -0.7], day: 5, color: '#EF4444' },
  { name: 'Nashik', code: 'NK', pos: [-2.2, 0, -1.3], day: 6, color: '#10B981' },
  { name: 'Pune', code: 'PUNE', pos: [-2.0, 0, 0.8], day: 8, color: '#EC4899' },
];

// ── Animated travel dot along path ─────────────────────
function TravelDot({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current = (t.current + delta * 0.08) % 1;
    if (!ref.current) return;
    const pt = curve.getPoint(t.current);
    ref.current.position.copy(pt);
    ref.current.position.y = 0.25;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshStandardMaterial color="#FFF" emissive="#FFF" emissiveIntensity={3} />
    </mesh>
  );
}

// ── Journey path ────────────────────────────────────────
function JourneyPath({ cities }: { cities: City[] }) {
  const points = cities.map(c => new THREE.Vector3(...c.pos));
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.4);
  const pts = curve.getPoints(120);

  const linePoints = pts.map(p => [p.x, p.y + 0.05, p.z] as [number, number, number]);

  return (
    <>
      <Line points={linePoints} color="#F59E0B" lineWidth={2.5} dashed dashScale={2} dashSize={0.3} gapSize={0.15} />
      <TravelDot curve={curve} />
    </>
  );
}

// ── City Node ───────────────────────────────────────────
function CityNode({ city, selected, onClick }: {
  city: City; selected: boolean; onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = Math.sin(Date.now() * 0.001 + city.day) * 0.08 + (selected ? 0.5 : 0.2);
  });

  return (
    <group position={city.pos} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Glow ring */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.28, selected ? 0.45 : 0.38, 48]} />
        <meshBasicMaterial color={city.color} transparent opacity={selected ? 0.6 : 0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Pulse ring */}
      {selected && (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.45, 0.58, 48]} />
          <meshBasicMaterial color={city.color} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Sphere */}
      <mesh ref={meshRef} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={city.color}
          emissive={city.color}
          emissiveIntensity={selected ? 1.2 : 0.5}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Point light */}
      <pointLight color={city.color} intensity={selected ? 3 : 1.2} distance={3} />

      {/* HTML label */}
      <Html position={[0, 1.0, 0]} center>
        <div
          onClick={onClick}
          style={{
            background: selected ? city.color : 'rgba(15,24,41,0.85)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${selected ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 10,
            padding: '4px 10px',
            color: '#fff',
            fontSize: 11,
            fontWeight: 800,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            boxShadow: selected ? `0 4px 20px ${city.color}66` : 'none',
            transition: 'all 0.2s',
            transform: selected ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {city.code}
          <span style={{ marginLeft: 4, fontWeight: 500, opacity: 0.75, fontSize: 9 }}>D{city.day}</span>
        </div>
      </Html>
    </group>
  );
}

// ── Ground Grid ─────────────────────────────────────────
function GroundGrid() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]}>
      <planeGeometry args={[20, 20, 20, 20]} />
      <meshBasicMaterial color="#1A2847" wireframe opacity={0.3} transparent />
    </mesh>
  );
}

// ── Camera Animator ──────────────────────────────────────
function CameraControl({ target }: { target: [number, number, number] | null }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!target) return;
    const [tx, ty, tz] = target;
    gsapLike(camera.position, { x: tx + 2, y: 6, z: tz + 5 }, 800);
  }, [target, camera]);

  return null;
}

function gsapLike(obj: THREE.Vector3, to: { x: number; y: number; z: number }, ms: number) {
  const from = { x: obj.x, y: obj.y, z: obj.z };
  const start = Date.now();
  const animate = () => {
    const p = Math.min((Date.now() - start) / ms, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    obj.set(
      from.x + (to.x - from.x) * ease,
      from.y + (to.y - from.y) * ease,
      from.z + (to.z - from.z) * ease,
    );
    if (p < 1) requestAnimationFrame(animate);
  };
  animate();
}

// ── Main Export ──────────────────────────────────────────
export default function JourneyMap3D({ selectedDay, onSelectCity }: {
  selectedDay: number | null;
  onSelectCity: (day: number) => void;
}) {
  const selectedCity = CITIES.find(c => c.day === selectedDay) ?? null;

  return (
    <Canvas
      camera={{ position: [1, 10, 12], fov: 42 }}
      style={{ background: '#070B14' }}
    >
      <Stars radius={80} depth={50} count={3000} factor={4} saturation={0.2} fade speed={0.5} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#6BAED6" />

      <GroundGrid />
      <JourneyPath cities={CITIES} />

      {CITIES.map((c) => (
        <CityNode
          key={c.name}
          city={c}
          selected={selectedDay === c.day}
          onClick={() => onSelectCity(c.day)}
        />
      ))}

      <CameraControl target={selectedCity ? selectedCity.pos : null} />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={!selectedDay}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={6}
        maxDistance={18}
      />
    </Canvas>
  );
}
