/* eslint-disable react/no-unknown-property */
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";

interface CarModelProps {
    rotation: [number, number, number];
    isDragging: boolean;
    headlightColor?: string;
}

export function CarModel({ rotation, isDragging, headlightColor = "#fef08a" }: CarModelProps) {
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
                    color={headlightColor}
                    emissive={headlightColor}
                    emissiveIntensity={2}
                />
            </mesh>
            <mesh position={[1.05, 0.15, -0.3]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial
                    color={headlightColor}
                    emissive={headlightColor}
                    emissiveIntensity={2}
                />
            </mesh>
        </group>
    );
}
