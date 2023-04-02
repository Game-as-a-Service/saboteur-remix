import type { EventSource } from "~/event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { PathCard } from "~/models/card";
import {
  PlacePathCardCommand,
  PathCardHasBeenPlacedEvent,
  aggregate,
} from "~/board";

describe("place", () => {
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
      when place:
        - start card at position (0, 0)
      expect:
        - should return
          - path card has been placed event with data
            - start card at position (0, 0)
        - event source should includes
          - path card has been placed event with data
            - start card at position (0, 0)
    `, () =>
    aggregate(source)(
      PlacePathCardCommand({
        position: [0, 0],
        card: PathCard.START,
      })
    )
      .then((event) =>
        expect(event).toStrictEqual([
          PathCardHasBeenPlacedEvent({
            position: [0, 0],
            card: PathCard.START,
          }),
        ])
      )
      .then(() =>
        source.read().then((events) =>
          expect(events).toStrictEqual([
            PathCardHasBeenPlacedEvent({
              position: [0, 0],
              card: PathCard.START,
            }),
          ])
        )
      ));

  test(`
      when place:
        - start card at position (0, 0)
        - goal card at position  (8, 0)
        - goal card at position  (8, 2)
        - goal card at position  (8,-2)
      expect:
        - should return have path card has been placed event
        - event source should have path card has been placed event at the end
    `, () =>
    aggregate(source)(
      PlacePathCardCommand(
        {
          position: [0, 0],
          card: PathCard.START,
        },
        {
          position: [8, 0],
          card: PathCard.GOAL_COAL_BOTTOM_LEFT,
        },
        {
          position: [8, 2],
          card: PathCard.GOAL_GOLD,
        },
        {
          position: [8, -2],
          card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
        }
      )
    ).then((event) =>
      expect(event).toStrictEqual([
        PathCardHasBeenPlacedEvent(
          {
            position: [0, 0],
            card: PathCard.START,
          },
          {
            position: [8, 0],
            card: PathCard.GOAL_COAL_BOTTOM_LEFT,
          },
          {
            position: [8, 2],
            card: PathCard.GOAL_GOLD,
          },
          {
            position: [8, -2],
            card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
          }
        ),
      ])
    ));

  test(`
      given:
        there is already a path card placed in the position where the player wants to place.
      when:
        the player chooses to place their path card in the position where there is already a path card.
      then:
        the path card cannot be placed.
    `, () =>
    aggregate(source)(
      PlacePathCardCommand({
        position: [0, 0],
        card: PathCard.START,
      })
    ).then(() =>
      expect(
        aggregate(source)(
          PlacePathCardCommand({
            position: [0, 0],
            card: PathCard.CONNECTED_CROSS,
          })
        )
      ).rejects.toThrow(
        "the path card connected-cross cannot be placed at position (0,0)"
      )
    ));
});
