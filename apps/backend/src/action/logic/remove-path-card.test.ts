import type { EventSource } from "~/models/event";
import { never } from "~/utils";
import removePathCard from "./remove-path-card";
import {
  Event,
  PathCard,
  createPathCardHasBeenPlacedEvent,
  createPathCardHasBeenRemovedEvent,
  createRockfallCommand,
} from "@packages/domain";

describe("remove path card", () => {
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
  `, () => {
    source
      .append(
        createPathCardHasBeenPlacedEvent({
          card: PathCard.START,
          position: [0, 0],
        })
      )
      .then(() =>
        removePathCard(
          source,
          createRockfallCommand({
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
            createPathCardHasBeenPlacedEvent({
              card: PathCard.START,
              position: [0, 0],
            }),
          ])
        )
      );
  });

  test(`
    given:
      a board with:
        - goal card [Gold] at position (8, 0)
    when:
      remove
        - goal card [Gold] at position (8, 0)
    then:
      - should return error
        - the gold card [Gold] cannot be removed.
      - event source should not includes
        - path card has been removed
  `, () => {
    source
      .append(
        createPathCardHasBeenPlacedEvent({
          card: PathCard.GOAL_GOLD,
          position: [8, 0],
        })
      )
      .then(() =>
        removePathCard(
          source,
          createRockfallCommand({
            card: PathCard.GOAL_GOLD,
            position: [8, 0],
          })
        )
      )
      .then((result) => {
        result.match(never, (error) =>
          expect(error).toStrictEqual(
            Error(`the path card ${PathCard.GOAL_GOLD} cannot be removed`)
          )
        );
      })
      .then(() =>
        source.read().then((events) =>
          expect(events).toStrictEqual([
            createPathCardHasBeenPlacedEvent({
              card: PathCard.GOAL_GOLD,
              position: [8, 0],
            }),
          ])
        )
      );
  });

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
  `, () => {
    source
      .append(
        createPathCardHasBeenPlacedEvent({
          card: PathCard.CONNECTED_CROSS,
          position: [1, 0],
        })
      )
      .then(() =>
        removePathCard(
          source,
          createRockfallCommand({
            card: PathCard.CONNECTED_CROSS,
            position: [1, 0],
          })
        )
      )
      .then((result) => {
        result.match(
          (result) =>
            expect(result).toStrictEqual(
              createPathCardHasBeenRemovedEvent({
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
            createPathCardHasBeenPlacedEvent({
              card: PathCard.CONNECTED_CROSS,
              position: [1, 0],
            }),
            createPathCardHasBeenRemovedEvent({
              card: PathCard.CONNECTED_CROSS,
              position: [1, 0],
            }),
          ])
        )
      );
  });

  test(`
    given:
      an empty board
    when:
      remove
        - empty placement at position (1, 0)
    then:
      - should return event
        - empty placement cannot be removed.
      - event source should not includes
        - path card has been removed
  `, () => {
    Promise.resolve()
      .then(() =>
        removePathCard(
          source,
          createRockfallCommand({
            card: PathCard.START,
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
      );
  });
});
