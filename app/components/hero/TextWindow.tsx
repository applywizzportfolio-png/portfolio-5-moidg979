'use client';

import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { usePortfolioData } from "../../../hooks/usePortfolioData";

const TextWindow = () => {
  const { data } = usePortfolioData();
  const scroll = useScroll();
  const windowRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const c = scroll.range(0.65, 0.15);

    if (windowRef.current) {
      windowRef.current.setRotationFromAxisAngle(new THREE.Vector3(0, -1, 0), 0.5 *Math.PI * c);
      windowRef.current.position.x =  -0.6 * c;
      windowRef.current.position.z = -0.6 * c;
    }
  });

  const fontProps = {
    font: "./soria-font.ttf",
  };

  const role = (data?.targetRole || "Frontend Engineer").toUpperCase();

  return (
    <group position={[0, -0.3, 0]} ref={windowRef}>

      <Text color="white" anchorX="left" anchorY="middle"
        fontSize={1.3}
        position={[0.12, 0, 0]}
        {...fontProps}
        scale={[1, -1, 1]}
        rotation={[0, 0,  -Math.PI / 2]}>
        {role}
      </Text>

      <Text color="white" anchorX="right" anchorY="middle"
        {...fontProps}
        scale={[-1, -1, 1]}
        fontSize={1.3}
        position={[0.12, 0, -1.4]}
        rotation={[0, 0,  -Math.PI / 2]}>
        DESIGNER. DEVELOPER
      </Text>

      <group position={[-0.45, 0, -0.3]}>
        <Text color="white" anchorX="left" anchorY="middle"
          {...fontProps}
          scale={[1, -1, 1]}
          fontSize={0.8}
          rotation={[0, -Math.PI / 2,  -Math.PI / 2]}>
          {(typeof data?.skills?.[0] === 'string' ? data?.skills?.[0] : data?.skills?.[0]?.name)?.toUpperCase() || "DESIGNER"}. {(typeof data?.skills?.[1] === 'string' ? data?.skills?.[1] : data?.skills?.[1]?.name)?.toUpperCase() || "DEVELOPER"}
        </Text>

        <Text color="white" anchorX="left" anchorY="middle"
          {...fontProps}
          scale={[1, -1, 1]}
          fontSize={0.8}
          position={[0, 0, -0.6]}
          rotation={[0, -Math.PI / 2,  -Math.PI / 2]}>
          {(typeof data?.skills?.[2] === 'string' ? data?.skills?.[2] : data?.skills?.[2]?.name)?.toUpperCase() || "CREATIVE"}. {(typeof data?.skills?.[3] === 'string' ? data?.skills?.[3] : data?.skills?.[3]?.name)?.toUpperCase() || "OPTIMIST"}
        </Text>
      </group>

      <group position={[0.45, 0, -0.3]}>
        <Text color="white" anchorX="right" anchorY="middle"
          {...fontProps}
          scale={[-1, -1, 1]}
          fontSize={0.8}
          rotation={[0, -Math.PI / 2,  -Math.PI / 2]}>
          {(typeof data?.skills?.[4] === 'string' ? data?.skills?.[4] : data?.skills?.[4]?.name)?.toUpperCase() || "GAMER"}. {(typeof data?.skills?.[5] === 'string' ? data?.skills?.[5] : data?.skills?.[5]?.name)?.toUpperCase() || "CREATIVE"}
        </Text>
        <Text color="white" anchorX="right" anchorY="middle"
          {...fontProps}
          scale={[-1, -1, 1]}
          fontSize={0.8}
          position={[0, 0, -0.6]}
          rotation={[0, -Math.PI / 2,  -Math.PI / 2]}>
          {(typeof data?.skills?.[6] === 'string' ? data?.skills?.[6] : data?.skills?.[6]?.name)?.toUpperCase() || "OPTIMIST"}. {(typeof data?.skills?.[7] === 'string' ? data?.skills?.[7] : data?.skills?.[7]?.name)?.toUpperCase() || "DESIGNER"}
        </Text>
      </group>
    </group>
  );
}

export default TextWindow;