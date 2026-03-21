"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface Arc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

interface City {
  lat: number;
  lng: number;
  name: string;
  region: string;
  flag: string;
  lead: string;
  twitter: string;
}

interface GlobeProps {
  arcs?: Arc[];
  arcColor?: string;
  onCitySelect?: (city: City | null) => void;
}

const ARC_CONNECTIONS: Arc[] = [
  { startLat: 28.6139, startLng: 77.2090, endLat: 1.3521, endLng: 103.8198 },
  { startLat: 28.6139, startLng: 77.2090, endLat: 25.2048, endLng: 55.2708 },
  { startLat: 1.3521, startLng: 103.8198, endLat: 22.3193, endLng: 114.1694 },
  { startLat: 22.3193, startLng: 114.1694, endLat: 21.0278, endLng: 105.8342 },
  { startLat: 21.0278, startLng: 105.8342, endLat: 13.7563, endLng: 100.5018 },
  { startLat: 13.7563, startLng: 100.5018, endLat: 28.6139, endLng: 77.2090 },
];

const CITIES: City[] = [
  { lat: 28.6139, lng: 77.2090, name: "New Delhi", region: "India", flag: "🇮🇳", lead: "A", twitter: "@agentsclan_a" },
  { lat: 1.3521, lng: 103.8198, name: "Singapore", region: "Singapore", flag: "🇸🇬", lead: "B", twitter: "@agentsclan_b" },
  { lat: 25.2048, lng: 55.2708, name: "Dubai", region: "UAE", flag: "🇦🇪", lead: "C", twitter: "@agentsclan_c" },
  { lat: 22.3193, lng: 114.1694, name: "Hong Kong", region: "Hong Kong", flag: "🇭🇰", lead: "D", twitter: "@agentsclan_d" },
  { lat: 21.0278, lng: 105.8342, name: "Hanoi", region: "Vietnam", flag: "🇻🇳", lead: "E", twitter: "@agentsclan_e" },
  { lat: 13.7563, lng: 100.5018, name: "Bangkok", region: "Thailand", flag: "🇹🇭", lead: "F", twitter: "@agentsclan_f" },
];

function latLngToPosition(lat: number, lng: number, radius: number = 120) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createArcLine(
  start: THREE.Vector3,
  end: THREE.Vector3,
  color: string,
  segments: number = 150
) {
  const points: THREE.Vector3[] = [];
  const startNorm = start.clone().normalize();
  const endNorm = end.clone().normalize();

  for (let i = 0; i <= segments; i++) {
    const alpha = i / segments;
    const point = new THREE.Vector3();

    const dotProduct = startNorm.dot(endNorm);
    const theta = Math.acos(Math.min(1, dotProduct));

    if (theta > 0.001) {
      const sinTheta = Math.sin(theta);
      point
        .copy(startNorm)
        .multiplyScalar(Math.sin((1 - alpha) * theta) / sinTheta)
        .addScaledVector(endNorm, Math.sin(alpha * theta) / sinTheta);
    } else {
      point.copy(startNorm).lerp(endNorm, alpha);
    }

    const lift = Math.sin(alpha * Math.PI) * 30;
    point.multiplyScalar(120 + lift);

    points.push(point);
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: 3,
  });

  return new THREE.Line(geometry, material);
}

function GlobeComponent({
  arcs = ARC_CONNECTIONS,
  arcColor = "#00ff88",
  onCitySelect,
}: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Group>(null);
  const pointMeshesRef = useRef<Array<{ mesh: THREE.Mesh; city: City }>>([]);
  const { camera, raycaster, mouse } = useThree();

  useEffect(() => {
    if (!groupRef.current) return;

    while (groupRef.current.children.length > 0) {
      const child = groupRef.current.children[0];
      groupRef.current.remove(child);
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) {
        if (Array.isArray((child as any).material)) {
          (child as any).material.forEach((m: any) => m.dispose());
        } else {
          (child as any).material.dispose();
        }
      }
    }

    pointMeshesRef.current = [];

    // Main globe
    const geometry = new THREE.SphereGeometry(120, 128, 128);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0d2e1a,
      emissive: 0x001a0d,
      emissiveIntensity: 0.3,
      shininess: 5,
    });
    const globe = new THREE.Mesh(geometry, material);
    groupRef.current.add(globe);

    // Atmosphere layer 1
    const atm1Geo = new THREE.SphereGeometry(128, 128, 128);
    const atm1Mat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atm1 = new THREE.Mesh(atm1Geo, atm1Mat);
    groupRef.current.add(atm1);

    // Atmosphere layer 2
    const atm2Geo = new THREE.SphereGeometry(132, 128, 128);
    const atm2Mat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
    });
    const atm2 = new THREE.Mesh(atm2Geo, atm2Mat);
    groupRef.current.add(atm2);

    // Add arcs
    arcs.forEach((arc) => {
      const start = latLngToPosition(arc.startLat, arc.startLng);
      const end = latLngToPosition(arc.endLat, arc.endLng);
      const arcLine = createArcLine(start, end, arcColor);
      groupRef.current?.add(arcLine);
    });

    // Points group
    pointsRef.current = new THREE.Group();
    groupRef.current.add(pointsRef.current);

    const pointsGroup = pointsRef.current;

    // City points
    CITIES.forEach((city) => {
      const position = latLngToPosition(city.lat, city.lng);

      // Main point (clickable)
      const pointGeo = new THREE.SphereGeometry(4, 32, 32);
      const pointMat = new THREE.MeshStandardMaterial({
        color: arcColor,
        emissive: arcColor,
        emissiveIntensity: 1,
        metalness: 0.5,
        roughness: 0.3,
      });
      const point = new THREE.Mesh(pointGeo, pointMat);
      point.position.copy(position);
      point.userData.city = city;
      pointsGroup.add(point);
      pointMeshesRef.current.push({ mesh: point, city });

      // Glow ring
      const ringGeo = new THREE.SphereGeometry(7, 32, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: arcColor,
        transparent: true,
        opacity: 0.2,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(position);
      pointsGroup.add(ring);

      // Halo
      const haloGeo = new THREE.SphereGeometry(10, 32, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: arcColor,
        transparent: true,
        opacity: 0.1,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(position);
      pointsGroup.add(halo);
    });
  }, [arcs, arcColor]);

  // Handle clicks
  useEffect(() => {
    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(
        pointMeshesRef.current.map((p) => p.mesh),
        false
      );

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as any;
        const city = clickedMesh.userData.city;
        if (city && onCitySelect) {
          onCitySelect(city);
        }
      } else {
        if (onCitySelect) {
          onCitySelect(null);
        }
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [camera, raycaster, mouse, onCitySelect]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0002;
    }

    // Pulse effect
    if (pointsRef.current) {
      const time = Date.now() * 0.001;
      const children = pointsRef.current.children;
      for (let i = 0; i < children.length; i += 3) {
        const halo = children[i + 2];
        if (halo) {
          const scale = 1 + Math.sin(time * 2 + (i / 3) * Math.PI) * 0.3;
          halo.scale.set(scale, scale, scale);
        }
      }
    }
  });

  return <group ref={groupRef} />;
}

export function Globe({ arcs, arcColor = "#00ff88", onCitySelect }: GlobeProps) {
  return (
    <div className="w-full h-full relative bg-black rounded-xl overflow-hidden shadow-2xl border border-[#00ff88]/20">
      <Canvas
        camera={{
          position: [0, 0, 300],
          fov: 40,
          near: 0.1,
          far: 10000,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <color attach="background" args={["#000000"]} />

        <ambientLight intensity={0.8} />
        <pointLight position={[200, 200, 200]} intensity={1.2} color={0xffffff} />
        <pointLight position={[-200, -200, 200]} intensity={0.6} color={0x00ff88} />
        <pointLight position={[0, 0, 200]} intensity={0.4} color={0x00ff88} />

        <GlobeComponent arcs={arcs} arcColor={arcColor} onCitySelect={onCitySelect} />

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.3}
          maxDistance={600}
          minDistance={200}
        />
      </Canvas>
    </div>
  );
}

export default Globe;
