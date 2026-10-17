import { UnknownCommand, ErrorLine } from "@/components/terminal/outputs/system";
import { commandNames, findCommand } from "./commands";
import { tokenize } from "./parse";
import { closest } from "./suggest";
import type { CommandContext, CommandResult } from "./types";

/** Runs one command line and returns what to show plus any side effects for the UI. */
export function execute(line: string, ctx: CommandContext): CommandResult {
  const [rawName, ...args] = tokenize(line);
  if (!rawName) return {};

  const command = findCommand(rawName);
  if (!command) {
    return {
      error: true,
      output: <UnknownCommand name={rawName} suggestion={closest(rawName, commandNames())} />,
    };
  }

  try {
    return command.run(args, ctx);
  } catch (err) {
    console.error(`terminal: command "${command.name}" failed`, err);
    return {
      error: true,
      output: <ErrorLine>{command.name}: something went wrong. That is a bug, not a feature.</ErrorLine>,
    };
  }
}
