"use client";

import { useMemo } from "react";
import { projects } from "@/content/projects";
import { homePalette, moonPalette, planetPalettes } from "@/lib/space/palettes";
import type { QualitySettings } from "@/lib/space/quality";
import { seedFromString } from "@/lib/space/rng";
import { LAST_INDEX, placeAt, sceneIndex } from "@/lib/space/waypoints";
import Beacon from "./Beacon";
import Nebulae from "./Nebulae";
import Planet from "./Planet";
import Starfield from "./Starfield";
import Station from "./Station";

interface SceneObjectsProps {
  quality: QualitySettings;
  animate: boolean;
  onOpenProject: (id: string) => void;
}

const PROJECT_RADII = [3.6, 4.4, 3.2, 4.8, 3.8];

/** Everything in the sky, positioned relative to the flight path so it lines up with the page's scenes. */
export default function SceneObjects({ quality, animate, onOpenProject }: SceneObjectsProps) {
  const projectsStart = sceneIndex("projects");

  const projectPlanets = useMemo(
    () =>
      projects.map((project, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        return {
          project,
          // The planet hangs on the side opposite its card and a little way ahead of the camera.
          position: placeAt(projectsStart + (i + 0.5) / projects.length, side * 8.5, ((i * 7) % 5) - 2, 16),
          radius: PROJECT_RADII[i % PROJECT_RADII.length],
          palette: planetPalettes[i % planetPalettes.length],
          ring: i === 1 ? { inner: 6, outer: 8.6, color: "#c77dff" } : i === 3 ? { inner: 6.4, outer: 8, color: "#ffb3c1", tilt: 0.7 } : undefined,
        };
      }),
    [projectsStart]
  );

  const home = useMemo(() => placeAt(0, 13, -1, 38), []);
  const moon = useMemo(() => placeAt(0, 4, 5, 30), []);
  const returnHome = useMemo(() => placeAt(LAST_INDEX, 11, 1, 24), []);
  const station = useMemo(() => placeAt(sceneIndex("experience") + 0.5, 9, 1.5, 12), []);
  const beacon = useMemo(() => placeAt(sceneIndex("contact") + 0.5, 8, 0, 14), []);

  return (
    <>
      <Starfield count={quality.starCount} />
      <Nebulae animate={animate} />

      <Planet position={home} radius={9} palette={homePalette} seed={seedFromString("home")} segments={quality.planetSegments} atmosphere="#5fb4ff" spin={0.03} animate={animate} />
      <Planet position={moon} radius={1.6} palette={moonPalette} seed={seedFromString("moon")} segments={quality.planetSegments} atmosphere="#9ca3af" spin={0.02} animate={animate} />

      {projectPlanets.map(({ project, position, radius, palette, ring }) => (
        <Planet
          key={project.id}
          id={project.id}
          position={position}
          radius={radius}
          palette={palette}
          seed={seedFromString(project.id)}
          segments={quality.planetSegments}
          ring={ring}
          animate={animate}
          onSelect={() => onOpenProject(project.id)}
        />
      ))}

      <Station position={station} animate={animate} />
      <Beacon position={beacon} animate={animate} />

      <Planet position={returnHome} radius={8} palette={homePalette} seed={seedFromString("home")} segments={quality.planetSegments} atmosphere="#5fb4ff" spin={0.03} animate={animate} />
    </>
  );
}
