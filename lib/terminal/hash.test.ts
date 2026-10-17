import { describe, expect, it } from "vitest";
import { fakeCommitHash } from "./hash";

describe("fakeCommitHash", () => {
  it("is deterministic and 7 hex characters", () => {
    expect(fakeCommitHash("concentrix")).toBe(fakeCommitHash("concentrix"));
    expect(fakeCommitHash("concentrix")).toMatch(/^[0-9a-f]{7}$/);
  });
  it("differs per seed", () => {
    expect(fakeCommitHash("concentrix")).not.toBe(fakeCommitHash("ta-digital"));
  });
});
