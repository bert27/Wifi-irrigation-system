/* eslint-disable react/no-unknown-property */
import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";

import { CarModel } from "./components/car-model";
import { ControllerModel } from "./components/controller-model";

interface MpuGraphicProps {
  pitch: number;
  roll: number;
  type?: 'car' | 'controller';
  headlightColor?: string;
}

export const MpuGraphic = (props: MpuGraphicProps) => {
  const { pitch, roll, type = 'car', headlightColor } = props;

  const rotX = pitch;
  const rotY = roll;

  const currentRotationRef = useRef({ x: rotX, y: rotY, z: 0 });

  useEffect(() => {
    // Controller might be rotated differently (e.g. flat vs upright), 
    // but assuming standard orientation for now.
    currentRotationRef.current = { x: rotX, y: rotY, z: 0 };
  }, [rotX, rotY]);

  return (
    <div
      style={{ width: '100%', height: '100%', cursor: 'default' }}>
      <Canvas
        style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%)' }}
        camera={{ position: [0, 2, 3], fov: 50 }}
      >
        <ambientLight intensity={2.0} />
        <directionalLight position={[5, 10, 5]} intensity={4} color="#ffffff" />
        <pointLight position={[10, 0, 10]} intensity={5} color="#06b6d4" />
        <pointLight position={[-10, 0, -10]} intensity={3} color="#d946ef" />

        {type === 'car' ? (
          <CarModel
            rotation={[currentRotationRef.current.x - 0.7, currentRotationRef.current.y - 0.9, currentRotationRef.current.z]}
            isDragging={false}
            headlightColor={headlightColor}
          />
        ) : (
          <ControllerModel
            rotation={[currentRotationRef.current.x, currentRotationRef.current.y, currentRotationRef.current.z]}
          />
        )}

        <gridHelper args={[10, 10, 0x666666, 0x333333]} rotation={[Math.PI / 2, 0, 0]} position={[0, -2, 0]} />
      </Canvas>
    </div >
  );
};
