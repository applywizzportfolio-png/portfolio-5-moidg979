import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import ProjectTile from "./ProjectTile";

import { usePortfolioData } from "../../../../hooks/usePortfolioData";
import { PROJECTS } from "@constants";
import { usePortalStore } from "@stores";

const ProjectsCarousel = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const isActive = usePortalStore((state) => state.activePortalId === "projects");

  useEffect(() => {
    if (!isActive) setActiveId(null);
  }, [isActive]);

  const onClick = (id: number) => {
    if (!isMobile) return;
    setActiveId(id === activeId ? null : id);
  };

  const { data: portfolioData } = usePortfolioData();
  const tiles = useMemo(() => {
    const fov = Math.PI;
    const distance = 13;
    const projectList = portfolioData?.projects && portfolioData.projects.length > 0 
      ? portfolioData.projects.map((p: any) => ({
          ...p,
          image: p.image || "projects/placeholder.png", // Default placeholder
          description: p.description || "",
          techStack: p.techStack || []
        }))
      : PROJECTS;
    
    const count = projectList.length;

    return projectList.map((project: any, i: number) => {
      const angle = (fov / count) * i;
      const z = -distance * Math.sin(angle);
      const x = -distance * Math.cos(angle);
      const rotY = Math.PI / 2 - angle;

      return (
        <ProjectTile
          key={i}
          project={project}
          index={i}
          position={[x, 1, z]}
          rotation={[0, rotY, 0]}
          activeId={activeId}
          onClick={() => onClick(i)}
        />
      );
    });
  }, [activeId, isActive, portfolioData]);

  return (
    <group rotation={[0, -Math.PI / 12, 0]}>
      {tiles}
    </group>
  );
};

export default ProjectsCarousel;