import { describe, expect, it, vi } from "vitest";
import { createKonami } from "./konami";

const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const type = (handler: (key: string) => void, keys: string[]) => keys.forEach(handler);

describe("createKonami", () => {
  it("fires after the full sequence", () => {
    const onMatch = vi.fn();
    type(createKonami(onMatch), CODE);
    expect(onMatch).toHaveBeenCalledTimes(1);
  });

  it("ignores case", () => {
    const onMatch = vi.fn();
    type(createKonami(onMatch), [...CODE.slice(0, 8), "B", "A"]);
    expect(onMatch).toHaveBeenCalledTimes(1);
  });

  it("does not fire for a partial or wrong sequence", () => {
    const onMatch = vi.fn();
    const handler = createKonami(onMatch);
    type(handler, CODE.slice(0, 9));
    type(handler, ["x", "a"]);
    expect(onMatch).not.toHaveBeenCalled();
  });

  it("starts over after a mistake, even when the mistake is the first key of a new attempt", () => {
    const onMatch = vi.fn();
    const handler = createKonami(onMatch);
    type(handler, ["ArrowUp", "ArrowUp", "ArrowUp"]); // a stray extra "up" then...
    type(handler, CODE.slice(1)); // ...the rest of the code completes the attempt that began with the stray key
    expect(onMatch).toHaveBeenCalledTimes(1);
  });

  it("can be triggered again", () => {
    const onMatch = vi.fn();
    const handler = createKonami(onMatch);
    type(handler, CODE);
    type(handler, CODE);
    expect(onMatch).toHaveBeenCalledTimes(2);
  });
});
