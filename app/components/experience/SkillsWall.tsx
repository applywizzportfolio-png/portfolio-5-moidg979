"use client";
import { Text, Float, Center } from "@react-three/drei";
import { useMemo } from "react";
import { usePortfolioData } from "../../../hooks/usePortfolioData";

const SkillBadge = ({ name, position }: { name: string, position: [number, number, number] }) => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Text
        position={position}
        font="./soria-font.ttf"
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {(name || "").toUpperCase()}
      </Text>
    </Float>
  );
};

const SkillsWall = () => {
  const { data } = usePortfolioData();
  const skills = useMemo(() => data?.skills || [], [data]);

  return (
    <group>
      <mesh receiveShadow>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      
      <Center position={[0, 0, 0]}>
        <group>
          {skills.map((skill: any, i: number) => {
            // Arrange skills in a grid or cluster
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = (col - 1) * 1.2;
            const y = (row - 2) * -0.6;
            
            // Handle both { name: "..." } and "..." string formats
            const skillName = typeof skill === 'string' ? skill : skill?.name || "";
            
            return (
              <SkillBadge 
                key={i} 
                name={skillName} 
                position={[x, y, 0]} 
              />
            );
          })}
        </group>
      </Center>

      <Text
        position={[0, 1.5, 0.1]}
        font="./soria-font.ttf"
        fontSize={0.4}
        color="#indigo-400"
      >
        TECHNICAL STACK
      </Text>
    </group>
  );
};

export default SkillsWall;
