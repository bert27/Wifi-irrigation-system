import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";

interface ControllerModelProps {
    rotation: [number, number, number];
}

export function ControllerModel({ rotation }: ControllerModelProps) {
    const mesh = useRef<any>(null);

    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.x = rotation[0];
            mesh.current.rotation.y = rotation[1];
            mesh.current.rotation.z = rotation[2];
        }
    });

    return (
        <group ref={mesh}>
            {/* Main Body (PCB + Case) */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2.2, 0.2, 1.2]} />
                <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
                <Edges scale={1.02} color="#06b6d4" />
            </mesh>

            {/* Joystick (Left) */}
            <mesh position={[-0.7, 0.2, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.2]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[-0.7, 0.4, 0]}>
                <sphereGeometry args={[0.2]} />
                <meshStandardMaterial color="#ef4444" />
            </mesh>

            {/* ESP32 Chip (Center) */}
            <mesh position={[0.2, 0.15, 0]}>
                <boxGeometry args={[0.8, 0.1, 0.8]} />
                <meshStandardMaterial color="#1f1f1f" />
                <Edges color="#555" />
            </mesh>

            {/* Antenna (End) */}
            <mesh position={[1.2, 0, 0]}>
                <boxGeometry args={[0.4, 0.05, 0.6]} />
                <meshStandardMaterial color="#d4af37" metalness={1} />
            </mesh>
        </group>
    );
}
