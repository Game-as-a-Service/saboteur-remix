import type { EventSource } from "~/models/event";
import { PathCardHasBeenPlacedEvent } from "~/board/event";
import { PathCard } from "~/models/card";
import { never } from "~/utils";
import removePathCard, { BoardCardEvent } from "./remove-path-card";
import { PathCardHasBeenRemovedEvent } from "../event";
import { RockfallCommand } from "../command";
import { Placement } from "~/models/placement";

describe("remove path card", () => {
  let source: EventSource<BoardCardEvent>;

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
      a board with:
        - start card at position (0, 0)
    when:
      remove
        - start card at position (0, 0)
    then:
      - should return error
        - the start card cannot be removed.
      - event source should not includes
        - path card has been removed
  `, async () =>
    source
      .append(
        PathCardHasBeenPlacedEvent({
          card: PathCard.START,
          position: [0, 0],
        })
      )
      .then(() =>
        removePathCard(
          source,
          RockfallCommand({
            card: PathCard.START,
            position: [0, 0],
          })
        )
      )
      .then((result) => {
        result.match(never, (error) =>
          expect(error).toStrictEqual(
            Error(`the path card ${PathCard.START} cannot be removed`)
          )
        );
      })
      .then(() =>
        source.read().then((events) =>
          expect(events).toStrictEqual([
            PathCardHasBeenPlacedEvent({
              card: PathCard.START,
              position: [0, 0],
            }),
          ])
        )
      ));

  test.each<{ placement: Placement; expectedError: Error }>([
    {
      placement: {
        card: PathCard.GOAL_GOLD,
        position: [8, 0],
      },
      expectedError: Error(
        `the path card ${PathCard.GOAL_GOLD} cannot be removed`
      ),
    },
    {
      placement: {
        card: PathCard.GOAL_COAL_BOTTOM_LEFT,
        position: [8, -2],
      },
      expectedError: Error(
        `the path card ${PathCard.GOAL_COAL_BOTTOM_LEFT} cannot be removed`
      ),
    },
    {
      placement: {
        card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
        position: [8, 2],
      },
      expectedError: Error(
        `the path card ${PathCard.GOAL_COAL_BOTTOM_RIGHT} cannot be removed`
      ),
    },
  ])(
    `
    given:
      a board with:
        - [$placement.card] at position $placement.position
    when:
      remove
        - [$placement.card] at position $placement.position
    then:
      - should return error
        - $expectedError.message
      - event source should not includes
        - path card has been removed
  `,
    async ({ placement, expectedError }) =>
      source
        .append(PathCardHasBeenPlacedEvent(placement))
        .then(() => removePathCard(source, RockfallCommand(placement)))
        .then((result) => {
          result.match(never, (error) =>
            expect(error).toStrictEqual(expectedError)
          );
        })
        .then(() =>
          source
            .read()
            .then((events) =>
              expect(events).toStrictEqual([
                PathCardHasBeenPlacedEvent(placement),
              ])
            )
        )
  );

  test(`
    given:
      a board with:
        - path card [connected cross] at position (1, 0)
    when:
      remove
        - path card [connected cross] at position (1, 0)
    then:
      - should return event
        - path card has been removed event.
      - event source should includes
        - path card has been removed
  `, async () =>
    source
      .append(
        PathCardHasBeenPlacedEvent({
          card: PathCard.CONNECTED_CROSS,
          position: [1, 0],
        })
      )
      .then(() =>
        removePathCard(
          source,
          RockfallCommand({
            card: PathCard.CONNECTED_CROSS,
            position: [1, 0],
          })
        )
      )
      .then((result) => {
        result.match(
          (result) =>
            expect(result).toStrictEqual(
              PathCardHasBeenRemovedEvent({
                card: PathCard.CONNECTED_CROSS,
                position: [1, 0],
              })
            ),
          never
        );
      })
      .then(() =>
        source.read().then((events) =>
          expect(events).toStrictEqual([
            PathCardHasBeenPlacedEvent({
              card: PathCard.CONNECTED_CROSS,
              position: [1, 0],
            }),
            PathCardHasBeenRemovedEvent({
              card: PathCard.CONNECTED_CROSS,
              position: [1, 0],
            }),
          ])
        )
      ));

  test(`
    given:
      an empty board
    when:
      remove
        - empty placement at position (1, 0)
    then:
      - should return error
        - empty placement cannot be removed.
      - event source should not includes
        - path card has been removed
  `, async () =>
    Promise.resolve()
      .then(() =>
        removePathCard(
          source,
          RockfallCommand({
            card: PathCard.CONNECTED_CROSS,
            position: [1, 0],
          })
        )
      )
      .then((result) => {
        result.match(never, (error) =>
          expect(error).toStrictEqual(
            Error("empty placement cannot be removed")
          )
        );
      })
      .then(() =>
        source.read().then((events) => expect(events).toStrictEqual([]))
      ));

  test(`
    given:
      a board with:
        - path card [connected cross] at position (1, 0)
    when:
      remove
        - path card [deadend cross] at position (1, 0)
    then:
      - should return error
        - unable to find the path card [deadend cross] at position (1, 0) on the board
      - event source should not includes
        - path card has been removed
  `, async () =>
    source
      .append(
        PathCardHasBeenPlacedEvent({
          card: PathCard.CONNECTED_CROSS,
          position: [1, 0],
        })
      )
      .then(() =>
        removePathCard(
          source,
          RockfallCommand({
            card: PathCard.DEADEND_CROSS,
            position: [1, 0],
          })
        )
      )
      .then((result) => {
        result.match(never, (error) =>
          expect(error).toStrictEqual(
            Error(
              `unable to find the ${PathCard.DEADEND_CROSS} card at position (1, 0) on the board`
            )
          )
        );
      })
      .then(() =>
        source.read().then((events) =>
          expect(events).toStrictEqual([
            PathCardHasBeenPlacedEvent({
              card: PathCard.CONNECTED_CROSS,
              position: [1, 0],
            }),
          ])
        )
      ));
});
