import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ResponseWebSocketInterface } from "../../car-page";
import { BoxGeometry } from "three";

interface MpuGraphicProps {
  data: {
    height: string;
    width: string;
  };
  recibedMessage: ResponseWebSocketInterface;
}

export const MpuGraphic = (props: MpuGraphicProps) => {
  const { data, recibedMessage } = props;
  const { width, height } = data;
  return (
    <Canvas style={{ width, height }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box
        position={[0, 0.2, 2.2]}
        geometry={
          new BoxGeometry()
            .rotateX(recibedMessage.giroscopeValues[0]) // 180 degrees in the x-axis
            .rotateY(recibedMessage.giroscopeValues[1]) // 90 degrees in the y-axis
        }
      />
    </Canvas>
  );
};

function Box(props: any) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<any>(null);
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (ref.current.rotation.x += 0.01));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={hovered ? "hotpink" : "orange"}
        //  map={texture}
      />
    </mesh>
  );
}
