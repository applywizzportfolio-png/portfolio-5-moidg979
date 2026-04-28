import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { usePortalStore } from "@stores";
import { usePortfolioData } from "../../../hooks/usePortfolioData";
import { useRef, useMemo } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from 'three';
import GridTile from "./GridTile";
import Projects from "./projects";
import Work from "./work";



const Experience = () => {
  const { data: portfolioData } = usePortfolioData();
  const titleRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const isActive = usePortalStore((state) => !!state.activePortalId);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: 0.4,
    color: 'white',
  };

  useFrame((state, delta) => {
    const d = scroll.range(0.8, 0.2);
    const e = scroll.range(0.7, 0.2);

    if (groupRef.current && !isActive) {
      groupRef.current.position.y = d > 0 ? -1 : -30;
      groupRef.current.visible = d > 0;
    }

    if (titleRef.current) {
      titleRef.current.children.forEach((text, i) => {
        const y =  Math.max(Math.min((1 - d) * (10 - i), 10), 0.5);
        text.position.y = THREE.MathUtils.damp(text.position.y, y, 7, delta);
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        (text as any).fillOpacity = e;
      });
    }
  });

  const getTitle = () => {
    const title = 'experience'.toUpperCase();
    return title.split('').map((char, i) => {
      const diff = isMobile ? 0.4 : 0.8;
      return (
        <Text key={i} {...fontProps} position={[i * diff, 2, 1]}>{char}</Text>
      );
    });
  };

  const sections = [
    { id: 'work', title: 'WORK & EDUCATION', color: '#b9c6d6', component: <Work /> },
    { id: 'projects', title: 'SIDE PROJECTS', color: '#bdd1e3', component: <Projects /> },
  ];

  return (
    <group position={[0, -41.5, 12]} rotation={[-Math.PI / 2, 0 ,-Math.PI / 2]}>
      <group rotation={[0, 0, Math.PI / 2]}>
        <group ref={titleRef} position={[isMobile ? -1.8 : -3.6, 2, -2]}>
          {getTitle()}
        </group>

        <group position={[0, -1, 0]} ref={groupRef}>
          {sections.map((section, i) => {
            const xPos = (i - 0.5) * 6; // Spaced for 2 items
            const textAlign = i % 2 === 0 ? 'left' : 'right';
            
            return (
              <GridTile 
                key={section.id}
                title={section.title}
                id={section.id}
                color={section.color}
                textAlign={textAlign}
                position={new THREE.Vector3(isMobile ? 0 : xPos, 0, isMobile ? i * 0.5 : 0)}
              >
                {section.component}
              </GridTile>
            );
          })}
        </group>
      </group>
    </group>
  );
};

export default Experience;