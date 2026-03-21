'use client';

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  OrbitControls,
  Html,
  Stars,
  useTexture,
  Environment
} from "@react-three/drei";

// Coordinates for the markers (user countries + details)
const LOCATIONS = [
  { name: 'Argentina', lat: -34.6037, lon: -58.3816, city: 'Buenos Aires', flag: '🇦🇷', lead: 'TBD', handle: '@agents_arg' },
  { name: 'Bolivia', lat: -16.4897, lon: -68.1193, city: 'La Paz', flag: '🇧🇴', lead: 'TBD', handle: '@agents_bo' },
  { name: 'Peru', lat: -12.0464, lon: -77.0428, city: 'Lima', flag: '🇵🇪', lead: 'Gianella', handle: '@dev3pack_peru' },
  { name: 'India', lat: 28.6139, lon: 77.2090, city: 'New Delhi', flag: '🇮🇳', lead: 'TBD', handle: '@agents_in' },
  { name: 'Nigeria', lat: 6.5244, lon: 3.3792, city: 'Lagos', flag: '🇳🇬', lead: 'TBD', handle: '@agents_ng' },
  { name: 'Kenya', lat: -1.2921, lon: 36.8219, city: 'Nairobi', flag: '🇰🇪', lead: 'TBD', handle: '@agents_ke' }
];

const EARTH_RADIUS = 2.2;

const latLonToVector3 = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

const Marker = ({ location, onMarkerClick }: { location: typeof LOCATIONS[0], onMarkerClick: (loc: typeof LOCATIONS[0], pos: THREE.Vector3) => void }) => {
  const [hovered, setHovered] = useState(false);
  const position = useMemo(() => latLonToVector3(location.lat, location.lon, EARTH_RADIUS), [location.lat, location.lon]);
  const markerRef = useRef<THREE.Group | null>(null);

  const [isFacingCamera, setIsFacingCamera] = useState(true);
  const pulseRef = useRef(0);

  useFrame((state, delta) => {
    if (!markerRef.current) return;
    const cameraPosition = state.camera.position;
    const markerWorldPosition = new THREE.Vector3();
    markerRef.current.getWorldPosition(markerWorldPosition);
    const dot = cameraPosition.clone().normalize().dot(markerWorldPosition.clone().normalize());
    setIsFacingCamera(dot > 0.2);

    // animate pulse
    pulseRef.current += delta * (hovered ? 3 : 1.2);
    if (pulseRef.current > Math.PI * 2) pulseRef.current -= Math.PI * 2;
  });

  const pulseScale = 1 + Math.abs(Math.sin(pulseRef.current)) * 0.6;

  return (
    <group
      ref={markerRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onMarkerClick(location, position);
      }}
    >
      {/* Core dot */}
      <mesh scale={hovered ? 1.6 : 1}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial
          color={hovered ? "#7c3aed" : "#60a5fa"}
          transparent
          opacity={isFacingCamera ? (hovered ? 0.95 : 0.9) : 0.15}
          toneMapped={false}
        />
      </mesh>

      {/* Pulsing ring */}
      <mesh scale={isFacingCamera ? pulseScale : 1}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial
          color="#b794f4"
          transparent
          opacity={isFacingCamera ? (hovered ? 0.35 : 0.18) : 0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow subtle */}
      <mesh scale={[1.6, 1.6, 1.6]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color="#6ee7b7"
          transparent
          opacity={isFacingCamera ? (hovered ? 0.08 : 0.06) : 0}
          toneMapped={false}
        />
      </mesh>

      {/* Hover label */}
      {hovered && isFacingCamera && (
        <Html distanceFactor={10} position={[0, 0.14, 0]} center>
          <div
            style={{
              background: "rgba(0,0,0,0.85)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              whiteSpace: "nowrap",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.08)",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {location.name}
          </div>
        </Html>
      )}
    </group>
  );
};

const EarthModel = ({ onMarkerClick }: { onMarkerClick: (loc: typeof LOCATIONS[0], pos: THREE.Vector3) => void }) => {
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);

  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    '/globe.png',
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"
  ]);

  // Create a point-cloud representation of the land by sampling the colorMap image.
  const pointsData = useMemo(() => {
    const tex = colorMap as THREE.Texture | undefined;
    const img = tex?.image as HTMLImageElement | undefined;
    if (!img || !img.width) return null;

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    const positions: number[] = [];
    const colors: number[] = [];

    // sampling resolution - adjust for performance/quality
    const lonStep = 1.5; // degrees (balanced density)
    const latStep = 1.5; // degrees (balanced density)

    for (let lat = -90; lat <= 90; lat += latStep) {
      for (let lon = -180; lon <= 180; lon += lonStep) {
        const u = Math.floor(((lon + 180) / 360) * (width - 1));
        const v = Math.floor(((90 - lat) / 180) * (height - 1));
        const idx = (v * width + u) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;
        // threshold to decide land vs ocean
        if (brightness > 20) {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);
          const radius = EARTH_RADIUS;
          const x = -(radius * Math.sin(phi) * Math.cos(theta));
          const z = radius * Math.sin(phi) * Math.sin(theta);
          const y = radius * Math.cos(phi);
          positions.push(x, y, z);
          // color slightly varied
          const c = 1.0; // white
          colors.push(c, c, c);
        }
      }
    }

    return { positions: new Float32Array(positions), colors: new Float32Array(colors) };
  }, [colorMap]);

  useFrame((_state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.03;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      {/* Point-cloud Earth */}
      {pointsData ? (
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[pointsData.positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[pointsData.colors, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.035} sizeAttenuation vertexColors transparent depthTest={true} color="#ffffff" />
          {LOCATIONS.map((loc) => (
            <Marker key={loc.name} location={loc} onMarkerClick={onMarkerClick} />
          ))}
        </points>
      ) : (
        // fallback to textured sphere while texture loads
        <mesh ref={earthRef} castShadow receiveShadow>
          <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
          <meshStandardMaterial
            map={colorMap}
            normalMap={normalMap}
            metalnessMap={specularMap}
            roughness={0.8}
            metalness={0.35}
          />
          {LOCATIONS.map((loc) => (
            <Marker key={loc.name} location={loc} onMarkerClick={onMarkerClick} />
          ))}
        </mesh>
      )}

      {/* Clouds (kept subtle) */}
      <mesh ref={cloudsRef} scale={[1.006, 1.006, 1.006]}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshStandardMaterial
          alphaMap={cloudsMap}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      {/* Inner atmospheric glow */}
      <mesh scale={[1.03, 1.03, 1.03]}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshBasicMaterial
          color="#4c1d95"
          transparent
          opacity={0.14}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* Outer purple ring (stronger) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[EARTH_RADIUS + 0.22, EARTH_RADIUS + 0.56, 128]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.12} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* Faint halo for glow */}
      <mesh>
        <ringGeometry args={[EARTH_RADIUS + 0.6, EARTH_RADIUS + 0.9, 128]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.04} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const Popup = ({
  location,
  position,
  onClose,
}: {
  location: typeof LOCATIONS[0] | null;
  position: THREE.Vector3 | null;
  onClose: () => void;
}) => {
  if (!location || !position) return null;

  return (
    <Html position={position} center distanceFactor={10} zIndexRange={[100, 0]}>
      <div style={{ position: "relative", animation: "fadeIn 0.2s ease" }}>
        <div
          style={{
            width: "280px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(124,58,237,0.35)",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 8px 48px rgba(0,0,0,0.7)",
            color: "white",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              lineHeight: 1,
              fontSize: "16px",
              padding: "2px 6px",
            }}
          >
            ×
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 28 }}>{location.flag ?? '📍'}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{location.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{location.city}</div>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '8px 0 12px' }} />

          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.9)", lineHeight: 1.4 }}>
            <div style={{ marginBottom: 8 }}>Country Lead: <strong style={{ textDecoration: 'underline' }}>{location.lead}</strong></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.8)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08C21.72 11.14 20.9 11.29 19.8 10.94C19.97 10.18 20.06 9.36 20.06 8.5C20.06 6.69 19.47 4.63 18.07 3.24C16.68 1.85 14.62 1.26 12.81 1.26C9.23 1.26 6.39 3.96 6.39 7.27C6.39 7.7 6.43 8.11 6.51 8.5C4 8.36 1.73 7.02 0 4.8C0.66 7.28 2.41 9.35 4.7 10.05C4.28 10.15 3.82 10.21 3.34 10.21C3.02 10.21 2.7 10.19 2.39 10.15C3.03 12.18 4.6 13.75 6.58 13.99C5.86 14.48 5.03 14.74 4.13 14.74C3.82 14.74 3.52 14.72 3.23 14.68C3.83 16.23 5.46 17.36 7.3 17.4C5.9 18.47 4.11 19.06 2.28 19.06C1.95 19.06 1.63 19.05 1.31 19C3.18 20.11 5.42 20.74 7.78 20.74C12.81 20.74 16.95 17.02 17.31 12.2C17.6 11.92 17.87 11.59 18.09 11.24C18.61 11.03 19.14 10.78 19.66 10.48C19.86 10.36 20.06 10.24 20.25 10.11C20.48 10.08 20.86 10.03 21.37 9.99C21.87 9.96 22.16 10 22 11.08Z" fill="currentColor" />
              </svg>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{location.handle}</a>
            </div>
          </div>
        </div>
        {/* Arrow */}
        <div
          style={{
            position: "absolute",
            bottom: "-8px",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: "16px",
            height: "16px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.18)",
            borderRight: "1px solid rgba(255,255,255,0.18)",
          }}
        />
      </div>
    </Html>
  );
};

const Earth = () => {
  const [selectedLocation, setSelectedLocation] = useState<typeof LOCATIONS[0] | null>(null);
  const [popupPos, setPopupPos] = useState<THREE.Vector3 | null>(null);

  const handleMarkerClick = (loc: typeof LOCATIONS[0], pos: THREE.Vector3) => {
    setSelectedLocation(loc);
    setPopupPos(pos);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#030712", position: "relative", overflow: "hidden" }}>
      {/* Subtle background gradient */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(23,37,84,0.15), black, black)", pointerEvents: "none" }} />

      <Canvas
        className="aspect-square w-full cursor-grab opacity-100 transition-opacity duration-500"
        shadows
        camera={{ position: [0, 0, 6], fov: 35 }}
        onPointerMissed={() => setSelectedLocation(null)}
      >
        <React.Suspense fallback={null}>
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />

          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 3, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-5, -2, -5]} intensity={0.5} color="#1e3a8a" />

          <EarthModel onMarkerClick={handleMarkerClick} />

          <Popup
            location={selectedLocation}
            position={popupPos}
            onClose={() => setSelectedLocation(null)}
          />

          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            autoRotate={!selectedLocation}
            autoRotateSpeed={0.5}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />

          <Environment preset="night" />
        </React.Suspense>
      </Canvas>

      {/* Country list (Global Presence) */}
      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'auto' }}>
        <div className="mt-6 flex items-center justify-center">
          <img src="/lo.png" alt="Country list" style={{ maxWidth: '900px', width: '100%', height: 'auto', opacity: 0.95 }} />
        </div>
      </div>

      {/* Corner hints */}
      <div style={{ position: "absolute", bottom: "24px", left: "24px", color: "rgba(255,255,255,0.25)", pointerEvents: "none" }}>
        <p style={{ fontSize: "14px", fontWeight: 300, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2px" }}>Global Presence</p>
        <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Interactive 3D Earth</p>
      </div>

      <div style={{ position: "absolute", top: "24px", right: "24px", color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", pointerEvents: "none" }}>
        <span>Click + Drag to Rotate</span>
        <span>Scroll to Zoom</span>
        <span>Click Markers to Explore</span>
      </div>
    </div>
  );
};

export default Earth;
