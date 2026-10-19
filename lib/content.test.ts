import { describe, expect, it } from "vitest";
import { about, getAboutStats } from "@/content/about";
import { credits } from "@/content/credits";
import { educationEntries } from "@/content/education";
import { experience } from "@/content/experience";
import { funFacts, testimonials } from "@/content/fun";
import { projects } from "@/content/projects";
import { embedUrl } from "./embed";
import { skillGroups } from "@/content/skills";
import { sectionOrder } from "@/content/types";
import { flavor } from "@/content/flavor";
import { sceneLabels } from "@/lib/movie/scenes";
import { bootLines } from "@/lib/terminal/boot";

const everything = JSON.stringify({ about, credits, educationEntries, experience, funFacts, testimonials, projects, skillGroups });

describe("content rules", () => {
  it("never writes the AEM version as just 'AEM 6.5' (versions are listed together or not at all)", () => {
    expect(everything).not.toMatch(/AEM 6\.5(?!\s*(and|,|\)))/);
    expect(everything).not.toContain("AEMaaCS");
  });

  it("keeps every private detail out of the content", () => {
    for (const forbidden of ["CGPA", "8368", "+91", "1996", "Gyan", "Libraries owned", "own and run"]) {
      expect(everything, forbidden).not.toContain(forbidden);
    }
  });

  it("presents the library work as client work", () => {
    const udaan = projects.find((p) => p.id === "udaan-library");
    expect(udaan?.description).toContain("client");
  });
});

describe("projects", () => {
  it("lists AEM Tutorial, YantraStack, English Daily, the library system and this portfolio", () => {
    expect(projects.map((p) => p.id)).toEqual(["aem-tutorial", "yantrastack", "english-daily", "udaan-library", "portfolio"]);
  });

  it("shows every project as live, with real links for the ones that can be previewed", () => {
    for (const project of projects) expect(project.status, project.id).toBe("Live");
    expect(projects.find((p) => p.id === "yantrastack")?.links.live).toBe("https://yantrastack.com/");
    expect(projects.find((p) => p.id === "english-daily")?.links.live).toBe("https://english-daily-iota.vercel.app/");
  });

  it("does not rely on static screenshots: the live site is previewed instead", () => {
    for (const project of projects) expect(project.image, project.id).toBeUndefined();
  });

  it("explains in words why a project has no live preview", () => {
    for (const project of projects) {
      if (!embedUrl(project)) expect(project.previewNote?.length ?? 0, project.id).toBeGreaterThan(10);
    }
  });

  it("counts live projects in the about stats", () => {
    const live = String(projects.filter((p) => p.status === "Live").length);
    expect(getAboutStats().find((s) => s.label === "Live projects")?.value).toBe(live);
  });
});

describe("education", () => {
  it("shows B.Tech, Intermediate and Matriculation in the same shape, each with syllabus highlights", () => {
    expect(educationEntries.map((e) => e.id)).toEqual(["btech", "intermediate", "matriculation"]);
    for (const entry of educationEntries) {
      expect(entry.summary.length, entry.id).toBeGreaterThan(40);
      expect(entry.highlights.length, entry.id).toBeGreaterThanOrEqual(5);
      expect(entry.period).toMatch(/^\d{4} – \d{4}$/);
    }
  });
});

describe("education subjects", () => {
  it("lists Sanskrit (not Hindi) for Matriculation", () => {
    const matric = educationEntries.find((e) => e.id === "matriculation")!;
    expect(matric.highlights).toContain("Sanskrit");
    expect(matric.highlights).not.toContain("Hindi");
  });
});

describe("experience and skills", () => {
  it("has substantial, real bullet points for both companies", () => {
    expect(experience.map((r) => r.company)).toEqual(["Concentrix Catalyst", "TA Digital"]);
    for (const role of experience) expect(role.highlights.length).toBeGreaterThanOrEqual(7);
  });

  it("covers the main AEM building blocks in skills", () => {
    const names = skillGroups.flatMap((g) => g.items.map((s) => s.name)).join(" | ");
    for (const topic of ["Components", "Templates", "Fragments", "Workflows", "Assets", "Dispatcher", "Sling Models", "OSGi", "JUnit"]) {
      expect(names, topic).toContain(topic);
    }
  });
});

describe("jokes", () => {
  it("has both running jokes in fun facts and the reviews", () => {
    const facts = funFacts.items.map((f) => f.text).join(" ");
    expect(facts).toContain("It was working on my system");
    expect(facts).toContain("a feature, not a bug");
    const reviews = testimonials.items.map((t) => t.quote).join(" ");
    expect(reviews).toContain("working on my system");
    expect(reviews).toContain("a feature, not a bug");
  });

  it("also appears in the credits and the terminal boot log", () => {
    expect(JSON.stringify(credits.items)).toContain("Features, not bugs");
    expect(bootLines.map((l) => l.text).join(" ")).toContain("works on my machine");
  });
});

describe("scenes", () => {
  it("no longer has a Client Work section, and never calls the opening scene 'Now Showing'", () => {
    expect(sectionOrder as readonly string[]).not.toContain("beyondCode");
    expect(sceneLabels.hero).not.toMatch(/now showing/i);
    for (const theme of Object.values(flavor)) expect(Object.keys(theme).sort()).toEqual([...sectionOrder].sort());
  });
});
