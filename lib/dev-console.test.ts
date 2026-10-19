import { describe, expect, it, vi } from "vitest";
import { installWarnFilter, isSilenced } from "./dev-console";

describe("dev console filter", () => {
  it("silences only the framer-motion reduced-motion notice", () => {
    expect(isSilenced(["You have Reduced Motion enabled on your device. Animations may not appear as expected.. For more information..."])).toBe(true);
    expect(isSilenced(["Something else went wrong"])).toBe(false);
    expect(isSilenced([new Error("x")])).toBe(false);
    expect(isSilenced([])).toBe(false);
  });

  it("drops silenced warnings, passes the rest through, and can be undone", () => {
    const warn = vi.fn();
    const target = { warn };
    const restore = installWarnFilter(target);

    target.warn("You have Reduced Motion enabled on your device. Animations may not appear as expected.");
    target.warn("a real warning", 42);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith("a real warning", 42);

    restore();
    target.warn("You have Reduced Motion enabled on your device. Animations may not appear as expected.");
    expect(warn).toHaveBeenCalledTimes(2);
  });
});
