import type { Placement } from "~/models/placement";

const PlacePathCardCommandSymbol = Symbol.for("place path card");

export type PlacePathCardCommand = {
  type: typeof PlacePathCardCommandSymbol;
  data: Placement[];
};
export type BoardCommand = PlacePathCardCommand;

export function PlacePathCardCommand(
  ...data: Placement[]
): PlacePathCardCommand {
  return { type: PlacePathCardCommandSymbol, data };
}
export function isPlacePathCardCommand(
  command: BoardCommand
): command is PlacePathCardCommand {
  return command.type === PlacePathCardCommandSymbol;
}
