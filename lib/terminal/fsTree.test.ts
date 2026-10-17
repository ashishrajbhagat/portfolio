import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { getNode, root } from "./fsTree";

describe("virtual filesystem", () => {
  it("has a file for every project", () => {
    const dir = getNode(root, ["projects"]);
    expect(dir?.type).toBe("dir");
    if (dir?.type !== "dir") return;
    expect(dir.children.map((c) => c.name)).toEqual(projects.map((p) => `${p.id}.md`));
  });
  it("resolves nested files", () => {
    const node = getNode(root, ["projects", `${projects[0].id}.md`]);
    expect(node).toMatchObject({ type: "file", target: `project:${projects[0].id}` });
  });
  it("returns null for missing paths and for descending into files", () => {
    expect(getNode(root, ["nope"])).toBeNull();
    expect(getNode(root, ["about.md", "x"])).toBeNull();
  });
  it("returns the root for an empty path", () => {
    expect(getNode(root, [])).toBe(root);
  });
});
