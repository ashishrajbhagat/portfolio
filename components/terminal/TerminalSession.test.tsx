// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { defaultSettings } from "@/lib/terminal/settings";
import TerminalSession from "./TerminalSession";

beforeAll(() => {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
});

afterEach(cleanup);

function setup() {
  const props = {
    settings: defaultSettings,
    onSettingsChange: vi.fn(),
    onExit: vi.fn(),
    onReboot: vi.fn(),
    onPlain: vi.fn(),
  };
  const user = userEvent.setup();
  render(<TerminalSession {...props} />);
  const input = screen.getByLabelText("Terminal command input") as HTMLInputElement;
  return { ...props, user, input };
}

const log = () => screen.getByRole("log");
const promptText = () => document.querySelector('label[for="terminal-input"]')?.textContent;

describe("TerminalSession", () => {
  it("shows the welcome message and an empty prompt", () => {
    const { input } = setup();
    expect(log().textContent).toContain("Ashish");
    expect(input.value).toBe("");
    expect(promptText()).toBe("guest@ashish-os:~$");
  });

  it("runs help", async () => {
    const { user, input } = setup();
    await user.type(input, "help{Enter}");
    expect(log().textContent).toContain("Available commands");
    expect(input.value).toBe("");
  });

  it("changes directory, lists files and reads one", async () => {
    const { user, input } = setup();
    await user.type(input, "cd projects{Enter}");
    expect(promptText()).toBe("guest@ashish-os:~/projects$");
    await user.type(input, "ls{Enter}");
    expect(log().textContent).toContain("udaan-library.md");
    await user.type(input, "cat udaan-library.md{Enter}");
    expect(log().textContent).toContain("Udaan Library Management System");
  });

  it("reports errors and suggests close commands", async () => {
    const { user, input } = setup();
    await user.type(input, "cat nope.txt{Enter}");
    expect(log().textContent).toContain("cat: nope.txt: No such file or directory");
    await user.type(input, "projcts{Enter}");
    expect(log().textContent).toContain("command not found: projcts");
    expect(log().textContent).toContain("Did you mean projects?");
  });

  it("clears the screen", async () => {
    const { user, input } = setup();
    await user.type(input, "help{Enter}");
    await user.type(input, "clear{Enter}");
    expect(log().textContent).not.toContain("Available commands");
  });

  it("completes with Tab", async () => {
    const { user, input } = setup();
    await user.type(input, "ski{Tab}");
    expect(input.value).toBe("skills ");
  });

  it("walks through history with the arrow keys", async () => {
    const { user, input } = setup();
    await user.type(input, "whoami{Enter}");
    await user.type(input, "pwd{Enter}");
    await user.type(input, "{ArrowUp}");
    expect(input.value).toBe("pwd");
    await user.type(input, "{ArrowUp}");
    expect(input.value).toBe("whoami");
    await user.type(input, "{ArrowDown}{ArrowDown}");
    expect(input.value).toBe("");
  });

  it("answers the running jokes", async () => {
    const { user, input } = setup();
    await user.type(input, "git blame{Enter}");
    expect(log().textContent).toContain("It was working on my system");
    await user.type(input, "bug{Enter}");
    expect(log().textContent).toContain("it's not a bug, it's a feature");
  });

  it("shows education as three stages with syllabus highlights", async () => {
    const { user, input } = setup();
    await user.type(input, "education{Enter}");
    const text = log().textContent ?? "";
    for (const level of ["B.Tech in Computer Science and Engineering", "Intermediate in Science", "Matriculation"]) {
      expect(text).toContain(level);
    }
    expect(text.match(/syllabus highlights/g)).toHaveLength(3);
    expect(text).not.toContain("CGPA");
  });

  it("no longer offers a client-work command or directory", async () => {
    const { user, input } = setup();
    await user.type(input, "ls{Enter}");
    expect(log().textContent).not.toContain("client-work");
    await user.type(input, "clients{Enter}");
    expect(log().textContent).toContain("command not found: clients");
  });

  it("runs quick-command buttons", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "skills" }));
    expect(log().textContent).toContain("Web & Front-end");
    expect(log().textContent).toContain("C++");
  });

  it("changes theme through settings", async () => {
    const { user, input, onSettingsChange } = setup();
    await user.type(input, "theme amber{Enter}");
    expect(onSettingsChange).toHaveBeenCalledWith({ ...defaultSettings, theme: "amber" });
    await user.type(input, "theme pink{Enter}");
    expect(log().textContent).toContain("unknown theme 'pink'");
  });

  it("logs out through onExit", async () => {
    const { user, input, onExit } = setup();
    await user.type(input, "exit{Enter}");
    await waitFor(() => expect(onExit).toHaveBeenCalledTimes(1), { timeout: 2000 });
  });

  it("does not run hidden commands from help but still answers them", async () => {
    const { user, input } = setup();
    await user.type(input, "help{Enter}");
    expect(log().textContent).not.toContain("sudo hire-me");
    await user.type(input, "sudo hire-me{Enter}");
    expect(log().textContent).toContain("Permission granted");
  });
});
