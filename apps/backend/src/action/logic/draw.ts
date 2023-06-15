import { Event, DrawCommand, DrawEvent } from "@packages/domain";
import { ResultAsync, errAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import { error } from "~/utils";

const EventSourceReadError = error("EventSourceReadError");
export type EventSourceReadError = ReturnType<typeof EventSourceReadError>;

const EventSourceWriteError = error("EventSourceWriteError");
export type EventSourceWriteError = ReturnType<typeof EventSourceWriteError>;

const DrawCardError = error("DrawCardError");
type DrawCardError = ReturnType<typeof DrawCardError>;

type DrawError = DrawCardError | EventSourceReadError | EventSourceWriteError;

export interface Pass {
  (source: EventSource<Event>, command: DrawCommand): ResultAsync<
    DrawEvent,
    DrawError
  >;
}

/**
 * *description*
 * player draws a card.
 *
 * *param* source - event source
 * *param* command - draw command
 */
export const draw: Pass = (source, command) => {
  // @todo read all events from event source
  // @todo aggregate all events to get deck
  // @todo draw a card randomly from the deck
  // @todo append event to event source
  return errAsync(DrawCardError("not implemented"));
};

export default draw;
