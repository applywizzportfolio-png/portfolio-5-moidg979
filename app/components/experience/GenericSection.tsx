"use client";
import { ScrollControls } from "@react-three/drei";
import { usePortalStore, useScrollStore } from "@stores";
import { useEffect, useMemo, useRef } from "react";
import { usePortfolioData } from "../../../hooks/usePortfolioData";
import * as THREE from "three";
import { Memory } from "../models/Memory";
import Timeline from "./work/Timeline";

const GenericSection = ({ section }: { section: any }) => {
  const isActive = usePortalStore((state) => state.activePortalId === section.id);
  const { scrollProgress, setScrollProgress } = useScrollStore();

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
    setScrollProgress(progress);
  }

  const wasActive = useRef(false);

  useEffect(() => {
    if (isActive) {
      wasActive.current = true;
      const scrollWrappers = document.querySelectorAll('div[style*="z-index: -1"]');
      const scrollWrapper = Array.from(scrollWrappers).find(el => el.contains(document.querySelector(`.timeline-container-${section.id}`))) as HTMLElement;
      const originalScrollWrapper = document.querySelector('div[style*="z-index: 1"]') as HTMLElement;
      
      setScrollProgress(0);
      if (scrollWrapper) {
        scrollWrapper.addEventListener('scroll', handleScroll)
        scrollWrapper.style.zIndex = '1';
      }
      if (originalScrollWrapper) originalScrollWrapper.style.zIndex = '-1';
    } else if (wasActive.current) {
      wasActive.current = false;
      const scrollWrappers = document.querySelectorAll('div[style*="z-index: 1"]');
      const scrollWrapper = Array.from(scrollWrappers).find(el => el.contains(document.querySelector(`.timeline-container-${section.id}`))) as HTMLElement;
      const originalScrollWrapper = document.querySelector('div[style*="z-index: -1"]') as HTMLElement;

      if (scrollWrapper) {
        scrollWrapper.scrollTo({ top: 0, behavior: 'smooth' });
        setScrollProgress(0);
        scrollWrapper.removeEventListener('scroll', handleScroll);
        scrollWrapper.style.zIndex = '-1';
      }
      if (originalScrollWrapper) originalScrollWrapper.style.zIndex = '1';
    }
  }, [isActive]);

  // Map custom section items to the Timeline format
  // section.items: [{ title, subtitle, description, date }]
  const timelinePoints = useMemo(() => {
    if (!section.items) return [];
    return section.items.map((item: any, i: number) => ({
      title: item.title,
      subtitle: item.subtitle || item.description?.substring(0, 50) + "...",
      year: item.date || "",
      point: new THREE.Vector3(0, 0, i * -5), // Space them out on Z axis
      position: i % 2 === 0 ? 'left' : 'right'
    }));
  }, [section]);

  return (
    <group className={`timeline-container-${section.id}`}>
      <mesh receiveShadow>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      <ScrollControls style={{ zIndex: isActive ? 1 : -10, pointerEvents: isActive ? 'auto' : 'none', display: isActive ? 'block' : 'none' }} pages={Math.max(2, timelinePoints.length)} maxSpeed={0.4}>
        <Memory scale={new THREE.Vector3(5, 5, 5)} position={new THREE.Vector3(0, -6, 1)}/>
        <Timeline 
          progress={isActive ? scrollProgress : 0} 
          points={timelinePoints as any} 
          activeId={section.id} 
        />
      </ScrollControls>
    </group>
  );
};

export default GenericSection;
