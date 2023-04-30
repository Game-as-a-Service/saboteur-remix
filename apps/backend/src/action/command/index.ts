import { MapCommand } from "./map.command";
import { FixToolCommand } from "./fix-tool.command";
import { BrokenToolCommand } from "./broken-tool.command";
import { RockfallCommand } from "./rockfall.command";
import { PassCommand } from "./pass.command";

export type Command =
  | MapCommand
  | FixToolCommand
  | BrokenToolCommand
  | RockfallCommand
  | PassCommand;

export * from "./map.command";
export * from "./fix-tool.command";
export * from "./broken-tool.command";
export * from "./rockfall.command";
export * from "./pass.command";
