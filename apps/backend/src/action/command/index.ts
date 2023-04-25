import { UseActionCardMapCommand } from "./use-action-card-map.command";
import { UseActionCardFixToolCommand } from "./use-action-card-fix-tool.command";
import { UseActionCardBrokenToolCommand } from "./use-action-card-broken-tool.command";
import { UseActionCardRockfallCommand } from "./use-action-card-rockfall.command";
import { PassCommand } from "./pass.command";

export type Command =
  | UseActionCardMapCommand
  | UseActionCardFixToolCommand
  | UseActionCardBrokenToolCommand
  | UseActionCardRockfallCommand
  | PassCommand;

export * from "./use-action-card-map.command";
export * from "./use-action-card-fix-tool.command";
export * from "./use-action-card-broken-tool.command";
export * from "./use-action-card-rockfall.command";
export * from "./pass.command";
