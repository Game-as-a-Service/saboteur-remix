import { EventSource } from "~/models/event";
import {
  Event,
  PathCard,
  createGoalCardHasBeenRevealEvent,
  createMapCommand,
  createPathCardHasBeenPlacedEvent,
} from "@packages/domain";
import revealGoal from "./reveal-goal";
import { never } from "~/utils";

describe("reveal goal", () => {
  let source: EventSource<Event>;

  beforeEach(() => {
    let store: unknown[] = [];
    const append = jest.fn().mockImplementation((...args: unknown[]) => {
      store = store.concat(...args);
      return Promise.resolve(args);
    });
    const read = jest.fn().mockImplementation(() => {
      return Promise.resolve(store);
    });

    source = { append, read, on: jest.fn(), off: jest.fn() };
  });

  test(`
    given:
      a board with
        - a goal card at position  (8, 0)
        - a goal card at position  (8, 2)
        - a goal card at position  (8,-2)
    when:
      player using reveal goal at position (8, 0)
    then:
      - should return event
        - goal card has been reveal event
      - event source should includes
        - goal card has been reveal event
  `, () =>
    Promise.resolve()
      .then(() =>
        source.append(
          createPathCardHasBeenPlacedEvent({
            card: PathCard.GOAL_COAL_BOTTOM_LEFT,
            position: [8, 0],
          }),
          createPathCardHasBeenPlacedEvent({
            card: PathCard.GOAL_GOLD,
            position: [8, 2],
          }),
          createPathCardHasBeenPlacedEvent({
            card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
            position: [8, -2],
          })
        )
      )
      .then(() =>
        revealGoal(
          source,
          createMapCommand({
            playerId: "player-1",
            position: [8, 0],
          })
        )
      )
      .then((result) =>
        result.match(
          (event) =>
            expect(event).toStrictEqual(
              createGoalCardHasBeenRevealEvent({
                playerId: "player-1",
                placement: {
                  position: [8, 0],
                  card: PathCard.GOAL_COAL_BOTTOM_LEFT,
                },
              })
            ),
          never
        )
      )
      .then(() =>
        source.read().then((events) =>
          expect(events).toStrictEqual([
            createPathCardHasBeenPlacedEvent({
              card: PathCard.GOAL_COAL_BOTTOM_LEFT,
              position: [8, 0],
            }),
            createPathCardHasBeenPlacedEvent({
              card: PathCard.GOAL_GOLD,
              position: [8, 2],
            }),
            createPathCardHasBeenPlacedEvent({
              card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
              position: [8, -2],
            }),
            createGoalCardHasBeenRevealEvent({
              playerId: "player-1",
              placement: {
                position: [8, 0],
                card: PathCard.GOAL_COAL_BOTTOM_LEFT,
              },
            }),
          ])
        )
      ));
});
