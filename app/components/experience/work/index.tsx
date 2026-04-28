import { ScrollControls, Html } from "@react-three/drei";
import { usePortalStore, useScrollStore } from "@stores";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Memory } from "../../models/Memory";
import Timeline from "./Timeline";

import { usePortfolioData } from "../../../../hooks/usePortfolioData";

const Work = () => {
  const { data: portfolioData } = usePortfolioData();
  const isActive = usePortalStore((state) => state.activePortalId === 'work');
  const { scrollProgress, setScrollProgress } = useScrollStore();

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
    setScrollProgress(progress);
  }

  // Hack: If the portal is active, add the scroll event listener to the scroll
  // wrapper div. If the portal is not active, remove the scroll event listener.
  // ScrollControls doesn't work out of the box, so we have to manually handle
  // the scroll event.


  // Map work and education to the timeline format
  const timelinePoints = useMemo(() => {
    const points: any[] = [];
    
    // Add experiences
    if (portfolioData?.experiences) {
      portfolioData.experiences.forEach((exp: any, i: number) => {
        points.push({
          title: exp.role,
          subtitle: exp.company,
          year: exp.duration || exp.date,
          point: new THREE.Vector3(0, 0, points.length * -5),
          position: points.length % 2 === 0 ? 'left' : 'right'
        });
      });
    }

    // Add educations
    if (portfolioData?.educations) {
      portfolioData.educations.forEach((edu: any) => {
        points.push({
          title: edu.degree,
          subtitle: edu.school,
          year: edu.duration || edu.date,
          point: new THREE.Vector3(0, 0, points.length * -5),
          position: points.length % 2 === 0 ? 'left' : 'right'
        });
      });
    }

    return points;
  }, [portfolioData]);

  const wasActive = useRef(false);

  useEffect(() => {
    if (isActive) {
      wasActive.current = true;
      // Target the local scroll wrapper (the one with z-index: -1 initially)
      const scrollWrappers = document.querySelectorAll('div[style*="z-index: -1"]');
      const scrollWrapper = Array.from(scrollWrappers).find(el => el.contains(document.querySelector('.timeline-container'))) as HTMLElement;
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
      const scrollWrapper = Array.from(scrollWrappers).find(el => el.contains(document.querySelector('.timeline-container'))) as HTMLElement;
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

  return (
    <group>
      <Html><div className="timeline-container" /></Html>
      <mesh receiveShadow>
        <planeGeometry args={[4, 4, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      <ScrollControls style={{ zIndex: isActive ? 1 : -10, pointerEvents: isActive ? 'auto' : 'none', display: isActive ? 'block' : 'none' }} pages={Math.max(2, timelinePoints.length)} maxSpeed={0.4}>
        <Memory scale={new THREE.Vector3(5, 5, 5)} position={new THREE.Vector3(0, -6, 1)}/>
        <Timeline 
          progress={isActive ? scrollProgress : 0} 
          points={timelinePoints.length > 0 ? timelinePoints : undefined}
          activeId="work"
        />
      </ScrollControls>
    </group>
  );
};

export default Work;