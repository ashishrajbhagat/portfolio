"use client";

import {
  Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode,
} from "react";
import { complete } from "@/lib/terminal/complete";
import { commandNames } from "@/lib/terminal/commands";
import { execute } from "@/lib/terminal/engine";
import { formatPath } from "@/lib/terminal/path";
import type { Effect, TerminalSettings } from "@/lib/terminal/types";
import { Whoami } from "./outputs/profile";
import { WelcomeBanner } from "./outputs/welcome";

interface Entry {
  id: number;
  /** Directory shown in the prompt when the entry echoes a typed command. Undefined for system entries. */
  cwd?: string[];
  input?: string;
  output?: ReactNode;
  error?: boolean;
}

const MAX_ENTRIES = 80;
const MAX_HISTORY = 100;
const QUICK_COMMANDS = [
  "help", "whoami", "about", "experience", "projects", "skills", "education",
  "certs", "fortune", "reviews", "resume", "contact",
];

interface TerminalSessionProps {
  settings: TerminalSettings;
  onSettingsChange: (settings: TerminalSettings) => void;
  onExit: () => void;
  onReboot: () => void;
  onPlain: () => void;
}

/** Colourful `guest@ashish-os:~/path$` prompt. Its text content is the plain prompt string. */
function PromptText({ cwd }: { cwd: string[] }) {
  return (
    <>
      <span className="t-green font-bold">guest</span>
      <span className="t-dim">@</span>
      <span className="t-pink font-bold">ashish-os</span>
      <span className="t-dim">:</span>
      <span className="t-blue">{formatPath(cwd)}</span>
      <span className="t-yellow">$</span>
    </>
  );
}

const welcomeEntries = (): Entry[] => [
  {
    id: 0,
    output: (
      <div className="space-y-4">
        <WelcomeBanner />
        <Whoami />
      </div>
    ),
  },
];

export default function TerminalSession({ settings, onSettingsChange, onExit, onReboot, onPlain }: TerminalSessionProps) {
  const [entries, setEntries] = useState<Entry[]>(welcomeEntries);
  const [history, setHistory] = useState<string[]>([]);
  const [cwd, setCwd] = useState<string[]>([]);
  const [value, setValue] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const historyIndex = useRef(-1);
  const draft = useRef("");
  const lastTabValue = useRef<string | null>(null);
  const exitTimer = useRef<number | null>(null);

  // Focus the prompt on desktop. On touch devices it would pop the keyboard open uninvited.
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) inputRef.current?.focus();
    return () => {
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
    };
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  const push = useCallback((entry: Omit<Entry, "id">, clear = false) => {
    setEntries((prev) => {
      const base = clear ? [] : prev;
      const next = clear ? base : [...base, { ...entry, id: nextId.current++ }];
      return next.slice(-MAX_ENTRIES);
    });
  }, []);

  const applyEffect = useCallback(
    (effect: Effect) => {
      switch (effect.type) {
        case "cd":
          setCwd(effect.path);
          break;
        case "theme":
          onSettingsChange({ ...settings, theme: effect.value });
          break;
        case "crt":
          onSettingsChange({ ...settings, crt: effect.value });
          break;
        case "open":
          if (effect.url.startsWith("mailto:")) window.location.href = effect.url;
          else window.open(effect.url, "_blank", "noopener,noreferrer");
          break;
        case "plain":
          onPlain();
          break;
        case "reboot":
          exitTimer.current = window.setTimeout(onReboot, 500);
          break;
        case "exit":
          exitTimer.current = window.setTimeout(onExit, 650);
          break;
        case "clear":
          break; // handled while pushing the entry
      }
    },
    [onExit, onPlain, onReboot, onSettingsChange, settings]
  );

  const run = useCallback(
    (raw: string) => {
      const line = raw.trim();
      if (!line) {
        push({ cwd, input: "" });
        return;
      }

      const nextHistory = history[history.length - 1] === line ? history : [...history, line].slice(-MAX_HISTORY);
      setHistory(nextHistory);

      const result = execute(line, { cwd, history: nextHistory, settings });
      const effects = result.effects ?? [];
      const clears = effects.some((e) => e.type === "clear");

      push({ cwd, input: line, output: result.output, error: result.error }, clears);
      effects.forEach(applyEffect);
    },
    [applyEffect, cwd, history, push, settings]
  );

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    run(value);
    setValue("");
    historyIndex.current = -1;
    draft.current = "";
    lastTabValue.current = null;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Tab") lastTabValue.current = null;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      if (historyIndex.current === -1) {
        draft.current = value;
        historyIndex.current = history.length - 1;
      } else if (historyIndex.current > 0) {
        historyIndex.current -= 1;
      }
      setValue(history[historyIndex.current]);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex.current === -1) return;
      if (historyIndex.current < history.length - 1) {
        historyIndex.current += 1;
        setValue(history[historyIndex.current]);
      } else {
        historyIndex.current = -1;
        setValue(draft.current);
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
      const result = complete(value, cwd, commandNames());
      if (!result) return;
      if (result.value !== value) {
        setValue(result.value);
        lastTabValue.current = null;
      } else if (result.matches.length > 1) {
        if (lastTabValue.current === value) {
          push({
            cwd,
            input: value,
            output: <p className="t-dim">{result.matches.join("   ")}</p>,
          });
          lastTabValue.current = null;
        } else {
          lastTabValue.current = value;
        }
      }
    } else if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      push({}, true);
    } else if (event.ctrlKey && event.key.toLowerCase() === "c") {
      event.preventDefault();
      push({ cwd, input: `${value}^C` });
      setValue("");
      historyIndex.current = -1;
    } else if (event.ctrlKey && event.key.toLowerCase() === "u") {
      event.preventDefault();
      setValue("");
    }
  };

  const focusInput = () => {
    if (window.getSelection()?.toString()) return; // don't steal focus while the user selects text
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} onClick={focusInput} className="min-h-0 flex-1 cursor-text overflow-y-auto overscroll-contain px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-4xl text-[13px] leading-relaxed sm:text-sm">
          <div role="log" aria-live="polite" aria-label="Terminal output" className="space-y-3">
            {entries.map((entry) => (
              <Fragment key={entry.id}>
                {entry.cwd !== undefined && (
                  <p className="break-all">
                    <PromptText cwd={entry.cwd} /> {entry.input}
                  </p>
                )}
                {entry.output && <div>{entry.output}</div>}
              </Fragment>
            ))}
          </div>

          <form onSubmit={submit} className="mt-3 flex items-baseline gap-2" autoComplete="off">
            <label htmlFor="terminal-input" className="shrink-0 select-none">
              <PromptText cwd={cwd} />
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              type="text"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              enterKeyHint="go"
              aria-label="Terminal command input"
              className="term-input min-w-0 flex-1 bg-transparent text-base outline-none sm:text-sm"
            />
          </form>
        </div>
      </div>

      <div role="toolbar" aria-label="Quick commands" className="term-bar flex shrink-0 gap-2 overflow-x-auto px-4 py-2">
        {QUICK_COMMANDS.map((command) => (
          <button key={command} type="button" onClick={() => run(command)} className="t-btn shrink-0 text-xs sm:text-sm">
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}
