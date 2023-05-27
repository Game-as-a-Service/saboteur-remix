import { BrokenToolCommand, Tool } from "@packages/domain";
import { Result, err, ok } from "neverthrow";
import { error } from "~/utils";

const ToolHasBeenBrokenError = error("ToolHasBeenBrokenError");
type ToolHasBeenBrokenError = ReturnType<typeof ToolHasBeenBrokenError>;

export type CheckToolHasBrokenError = ToolHasBeenBrokenError;

export type CheckToolHasBroken = (
  command: BrokenToolCommand
) => (
  toolsHasBroken: Tool[]
) => Result<BrokenToolCommand, CheckToolHasBrokenError>;

/**
 * *description*
 * check tool has broken on player
 *
 * *param* source - event source
 * *param* command - broken tool command
 */
export const checkToolHasBroken: CheckToolHasBroken =
  (command) => (toolsHasBroken) =>
    !toolsHasBroken.includes(command.data.tool)
      ? ok(command)
      : err(
          ToolHasBeenBrokenError(
            `the player ${command.data.playerId} tool has been broken`
          )
        );

export default checkToolHasBroken;
