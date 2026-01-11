import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ResponseWebSocketInterface } from "@/pages/car/models/robot-model";
import { Edges } from "@react-three/drei";

interface MpuGraphicProps {
  data: {
    height: string;
    width: string;
  };
  recibedMessage: ResponseWebSocketInterface;
  setOrientation?: (pitch: number, roll: number) => void;
}

export const MpuGraphic = (props: MpuGraphicProps) => {
  const { data, recibedMessage, setOrientation } = props;
  const { width, height } = data;
  
  const rotX = recibedMessage.giroscopeValues ? recibedMessage.giroscopeValues[0] : 0;
  const rotY = recibedMessage.giroscopeValues ? recibedMessage.giroscopeValues[1] : 0;

  const [isDragging, setIsDragging] = useState(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: rotX, y: rotY, z: 0 });

  useEffect(() => {
    if (!isDragging) {
      currentRotationRef.current = { x: rotX, y: rotY, z: 0 };
    }
  }, [rotX, rotY, isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!setOrientation) return;
    setIsDragging(true);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !setOrientation) return;
    
    const deltaX = e.clientX - lastPosRef.current.x;
    const deltaY = e.clientY - lastPosRef.current.y;
    
    lastPosRef.current = { x: e.clientX, y: e.clientY };

    const speed = 0.01;
    let newPitch = currentRotationRef.current.x + deltaY * speed;
    let newRoll = currentRotationRef.current.y + deltaX * speed;

    newPitch = Math.round(newPitch * 100) / 100;
    newRoll = Math.round(newRoll * 100) / 100;

    currentRotationRef.current.x = newPitch;
    currentRotationRef.current.y = newRoll;

    setOrientation(newPitch, newRoll);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      style={{ width, height, cursor: isDragging ? 'grabbing' : 'grab' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas 
        // Changed to a semi-transparent lighter background to create contrast
        style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%)' }} 
        camera={{ position: [0, 2, 3], fov: 50 }}
      >
        {/* High Intensity Lighting Setup */}
        <ambientLight intensity={2.0} />
        <directionalLight position={[5, 10, 5]} intensity={4} color="#ffffff" />
        <pointLight position={[10, 0, 10]} intensity={5} color="#06b6d4" />
        <pointLight position={[-10, 0, -10]} intensity={3} color="#d946ef" />

        <DataCube 
          rotation={[currentRotationRef.current.x - 0.7, currentRotationRef.current.y - 0.9, currentRotationRef.current.z]} 
          isDragging={isDragging}
        />
        
        {/* Much brighter grid */}
        <gridHelper args={[10, 10, 0x666666, 0x333333]} rotation={[Math.PI / 2, 0, 0]} position={[0, -2, 0]} />
      </Canvas>
    </div>
  );
};

function DataCube({ rotation, isDragging }: { rotation: [number, number, number], isDragging: boolean }) {
  const mesh = useRef<any>(null);
  const [hovered, setHover] = useState(false);

  // Apply rotation to mesh every frame
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x = rotation[0];
      mesh.current.rotation.y = rotation[1];
      mesh.current.rotation.z = rotation[2];
    }
  });

  return (
    <group
      ref={mesh}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Car Body - Main chassis */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2, 0.4, 1]} />
        <meshStandardMaterial
          color={hovered || isDragging ? "#818cf8" : "#6366F1"}
          metalness={0.6}
          roughness={0.2}
          emissive={hovered || isDragging ? "#6366F1" : "#4f46e5"}
          emissiveIntensity={0.8}
        />
        <Edges 
          scale={1.02} 
          threshold={15} 
          color={hovered || isDragging ? "#ffffff" : "#a5b4fc"} 
          linewidth={2} 
        />
      </mesh>

      {/* Car Cabin/Roof */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 0.5, 0.8]} />
        <meshStandardMaterial
          color={hovered || isDragging ? "#818cf8" : "#6366F1"}
          metalness={0.6}
          roughness={0.2}
          emissive={hovered || isDragging ? "#6366F1" : "#4f46e5"}
          emissiveIntensity={0.8}
        />
        <Edges 
          scale={1.02} 
          threshold={15} 
          color={hovered || isDragging ? "#ffffff" : "#a5b4fc"} 
          linewidth={2} 
        />
      </mesh>

      {/* Front Wheels */}
      <mesh position={[0.7, -0.15, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial
          color="#06B6D4"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.7, -0.15, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial
          color="#06B6D4"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Rear Wheels */}
      <mesh position={[-0.7, -0.15, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial
          color="#06B6D4"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.7, -0.15, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial
          color="#06B6D4"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Headlights */}
      <mesh position={[1.05, 0.15, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[1.05, 0.15, -0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#fef08a"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}
