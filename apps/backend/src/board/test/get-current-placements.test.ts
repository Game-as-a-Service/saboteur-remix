import type { EventSource } from "~/models/event";
import { describe, test, expect } from "vitest";
import { vi } from "vitest";
import getCurrentPlacements from "~/board/logic/get-current-placements";
import { PathCardHasBeenPlacedEvent } from "~/board/event";
import { PathCard } from "~/models/card";
import { never } from "~/utils";

describe("get current placements", () => {
  let source: EventSource;

  beforeEach(() => {
    let store: unknown[] = [];
    const append = vi.fn().mockImplementation((...args: unknown[]) => {
      store = store.concat(...args);
      return Promise.resolve(args);
    });
    const read = vi.fn().mockImplementation(() => {
      return Promise.resolve(store);
    });
    source = { append, read };
  });

  test(`
      given:
        an empty board
      when:
        get current placements
      expect:
        empty placements
    `, () =>
    getCurrentPlacements(source)
      //
      .then((result) =>
        result.match(
          (placements) => expect(placements).toStrictEqual([]),
          never
        )
      ));

  test(`
      given:
        a board with
          - a start card at position (0, 0)
      when:
        get current placements
      expect:
        placements includes
          - a start card at position (0, 0)
    `, () =>
    source
      .append(
        PathCardHasBeenPlacedEvent({
          card: PathCard.START,
          position: [0, 0],
        })
      )
      .then(() => getCurrentPlacements(source))
      .then((result) =>
        result.match(
          (placements) =>
            expect(placements).toStrictEqual([
              {
                card: PathCard.START,
                position: [0, 0],
              },
            ]),
          never
        )
      ));

  test(`
      given:
        a board with
          - a start card at position (0, 0)
          - a goal card at position  (8, 0)
          - a goal card at position  (8, 2)
          - a goal card at position  (8,-2)
      when:
        get current placements
      expect:
        placements includes
          - a start card at position (0, 0)
          - a goal card at position  (8, 0)
          - a goal card at position  (8, 2)
          - a goal card at position  (8,-2)
  `, () =>
    source
      .append(
        PathCardHasBeenPlacedEvent({
          card: PathCard.START,
          position: [0, 0],
        }),
        PathCardHasBeenPlacedEvent({
          card: PathCard.GOAL_COAL_BOTTOM_LEFT,
          position: [8, 0],
        }),
        PathCardHasBeenPlacedEvent({
          card: PathCard.GOAL_GOLD,
          position: [8, 2],
        }),
        PathCardHasBeenPlacedEvent({
          card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
          position: [8, -2],
        })
      )
      .then(() => getCurrentPlacements(source))
      .then((result) =>
        result.match(
          (placements) =>
            expect(placements).toStrictEqual([
              {
                card: PathCard.START,
                position: [0, 0],
              },
              {
                card: PathCard.GOAL_COAL_BOTTOM_LEFT,
                position: [8, 0],
              },
              {
                card: PathCard.GOAL_GOLD,
                position: [8, 2],
              },
              {
                card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
                position: [8, -2],
              },
            ]),
          never
        )
      ));

  test.todo(
    `
      given:
        a board with
          - a start card at position (0, 0)
          - a connected cross card at position (0, 1)
          - a goal card at position  (8, 0)
          - a goal card at position  (8, 2)
          - a goal card at position  (8,-2)
      when:
        get current placements
      expect:
        placements includes
          - a start card at position (0, 0)
          - a connected cross card at position (0, 1)
          - a goal card at position  (8, 0)
          - a goal card at position  (8, 2)
          - a goal card at position  (8,-2)
  `,
    () =>
      source
        .append(
          PathCardHasBeenPlacedEvent({
            card: PathCard.START,
            position: [0, 0],
          }),
          PathCardHasBeenPlacedEvent({
            card: PathCard.CONNECTED_CROSS,
            position: [0, 1],
          }),
          PathCardHasBeenPlacedEvent({
            card: PathCard.GOAL_COAL_BOTTOM_LEFT,
            position: [8, 0],
          }),
          PathCardHasBeenPlacedEvent({
            card: PathCard.GOAL_GOLD,
            position: [8, 2],
          }),
          PathCardHasBeenPlacedEvent({
            card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
            position: [8, -2],
          })
        )
        .then(() => getCurrentPlacements(source))
        .then((placements) =>
          expect(placements).toStrictEqual([
            {
              card: PathCard.START,
              position: [0, 0],
            },
            {
              card: PathCard.CONNECTED_CROSS,
              position: [0, 1],
            },
            {
              card: PathCard.GOAL_COAL_BOTTOM_LEFT,
              position: [8, 0],
            },
            {
              card: PathCard.GOAL_GOLD,
              position: [8, 2],
            },
            {
              card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
              position: [8, -2],
            },
          ])
        )
  );
});
