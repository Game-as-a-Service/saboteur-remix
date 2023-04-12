import type { EventSource } from "~/models/event";
import { PlacePathCardCommand } from "~/board/command";
import { PathCard } from "~/models/card";
import placePathCard from "~/board/logic/place-path-card";
import { PathCardHasBeenPlacedEvent } from "~/board/event";
import { never } from "~/utils";

describe("place path card", () => {
  let source: EventSource;

  beforeEach(() => {
    let store: unknown[] = [];
    const append = jest.fn().mockImplementation((...args: unknown[]) => {
      store = store.concat(...args);
      return Promise.resolve(args);
    });
    const read = jest.fn().mockImplementation(() => {
      return Promise.resolve(store);
    });
    source = { append, read };
  });

  test(`
      given:
        an empty board
      when:
        place
          - start card at position (0, 0)
      expect:
        - should return
          - path card has been placed event with
            - start card at position (0, 0)
        - event source should includes
          - path card has been placed event with
            - start card at position (0, 0)
    `, async () =>
    placePathCard(
      source,
      PlacePathCardCommand({
        position: [0, 0],
        card: PathCard.START,
      })
    )
      .then((result) =>
        result.match(
          (event) =>
            expect(event).toStrictEqual([
              PathCardHasBeenPlacedEvent({
                position: [0, 0],
                card: PathCard.START,
              }),
            ]),
          never
        )
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
      given:
        an empty board
      when:
        place
          - start card at position (0, 0)
          - goal card at position  (8, 0)
          - goal card at position  (8, 2)
          - goal card at position  (8,-2)
      expect:
        - should return
          - path card has been placed event with
            - start card at position (0, 0)
            - goal card at position  (8, 0)
            - goal card at position  (8, 2)
            - goal card at position  (8,-2)
        - event source should includes
          - path card has been placed event with
            - start card at position (0, 0)
            - goal card at position  (8, 0)
            - goal card at position  (8, 2)
            - goal card at position  (8,-2)
    `, async () =>
    placePathCard(
      source,
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
    )
      .then((event) =>
        event.match(
          (event) =>
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
            ]),
          never
        )
      )
      .then(() =>
        source.read().then((events) =>
          expect(events).toStrictEqual([
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
        )
      ));

  test(`
      given:
        there is already a path card placed in the position where the player wants to place.
      when:
        the player chooses to place their path card in the position where there is already a path card.
      expect:
        the path card cannot be placed.
    `, () =>
    Promise.resolve()
      .then(() =>
        placePathCard(
          source,
          PlacePathCardCommand({
            position: [0, 0],
            card: PathCard.START,
          })
        )
      )
      .then(() =>
        placePathCard(
          source,
          PlacePathCardCommand({
            position: [0, 0],
            card: PathCard.START,
          })
        )
      )
      .then((result) =>
        result.match(never, (error) =>
          expect(error).toStrictEqual(
            AggregateError([
              "the path card start cannot be placed at position (0,0)",
            ])
          )
        )
      ));
});
