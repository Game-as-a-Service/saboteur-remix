import {
  Event,
  GoalCardHasBeenRevealEvent,
  MapCommand,
  Placement,
  Vec,
  createGoalCardHasBeenRevealEvent,
  isPathCardHasBeenPlacedEvent,
} from "@packages/domain";
import { pipe } from "fp-ts/lib/function";
import { ResultAsync, errAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import { always, error } from "~/utils";
import * as Array from "fp-ts/lib/Array";
import * as Option from "fp-ts/lib/Option";

const GoalCardNotFound = error("Goal card not found");
type GoalCardNotFound = ReturnType<typeof GoalCardNotFound>;

const EventSourceReadError = error("EventSourceReadError");
type EventSourceReadError = ReturnType<typeof EventSourceReadError>;
const EventSourceWriteError = error("EventSourceWriteError");
type EventSourceWriteError = ReturnType<typeof EventSourceWriteError>;

type RevealGoalError =
  | GoalCardNotFound
  | EventSourceReadError
  | EventSourceWriteError;

export interface RevealGoal {
  (source: EventSource<Event>, command: MapCommand): ResultAsync<
    GoalCardHasBeenRevealEvent,
    RevealGoalError
  >;
}

const readAllEventsFromEventSource = (source: EventSource<Event>) =>
  ResultAsync.fromPromise(
    source.read(),
    always(EventSourceReadError("failed to read events from source"))
  );

const appendEventToEventSource = (
  source: EventSource<Event>,
  data: {
    playerId: string;
    placement: Placement;
  }
) =>
  pipe(
    createGoalCardHasBeenRevealEvent(data),
    (event) =>
      ResultAsync.fromPromise(
        source.append(event),
        always(EventSourceWriteError("failed to write event to repository"))
      )
    //
  );

/**
 * *description*
 * reveal the goal
 *
 * *param* source - event source
 * *param* command - map command
 */
export const revealGoal: RevealGoal = (source, command) => {
  return readAllEventsFromEventSource(source).andThen((events) =>
    pipe(
      events,
      Array.filter(isPathCardHasBeenPlacedEvent),
      Array.findFirst((event) =>
        Vec.eq(event.data.position, command.data.position)
      ),
      Option.matchW(
        () =>
          errAsync(
            GoalCardNotFound(
              `goal card not found at position:${command.data.position}`
            )
          ),
        (event) =>
          appendEventToEventSource(source, {
            playerId: command.data.playerId,
            placement: {
              position: command.data.position,
              card: event.data.card,
            },
          }).map(
            always(
              createGoalCardHasBeenRevealEvent({
                playerId: command.data.playerId,
                placement: {
                  position: command.data.position,
                  card: event.data.card,
                },
              })
            )
          )
      )
    )
  );
};

export default revealGoal;
