import type { EventSource } from "~/models/event";
import placePathCard from "~/board/logic/place-path-card";
import {
  PathCard,
  PathCardHasBeenPlacedEvent,
  createPathCardHasBeenPlacedEvent,
  createPlacePathCardCommand,
} from "@packages/domain";
import { never } from "~/utils";

describe("place path card", () => {
  let source: EventSource<PathCardHasBeenPlacedEvent>;

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
        an empty board
      when:
        place
          start card at position (0, 0)
      then:
        - should return
          - path card has been placed event with
            - start card at position (0, 0)
        - event source should includes
          - path card has been placed event with
            - start card at position (0, 0)
    `, async () =>
    placePathCard(
      source,
      createPlacePathCardCommand({
        position: [0, 0],
        card: PathCard.START,
      })
    )
      .then((result) =>
        result.match(
          (event) =>
            expect(event).toStrictEqual(
              createPathCardHasBeenPlacedEvent({
                position: [0, 0],
                card: PathCard.START,
              })
            ),
          never
        )
      )
      .then(() =>
        source.read().then((events) =>
          expect(events).toStrictEqual([
            createPathCardHasBeenPlacedEvent({
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
      then:
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
    `, () =>
    Promise.resolve()
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [0, 0],
            card: PathCard.START,
          })
        )
      )
      .then((event) =>
        event.match(
          (event) =>
            expect(event).toStrictEqual(
              createPathCardHasBeenPlacedEvent({
                position: [0, 0],
                card: PathCard.START,
              })
            ),
          never
        )
      )
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [8, 0],
            card: PathCard.GOAL_COAL_BOTTOM_LEFT,
          })
        )
      )
      .then((event) =>
        event.match(
          (event) =>
            expect(event).toStrictEqual(
              createPathCardHasBeenPlacedEvent({
                position: [8, 0],
                card: PathCard.GOAL_COAL_BOTTOM_LEFT,
              })
            ),
          never
        )
      )
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [8, 2],
            card: PathCard.GOAL_GOLD,
          })
        )
      )
      .then((event) =>
        event.match(
          (event) =>
            expect(event).toStrictEqual(
              createPathCardHasBeenPlacedEvent({
                position: [8, 2],
                card: PathCard.GOAL_GOLD,
              })
            ),
          never
        )
      )
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [8, -2],
            card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
          })
        )
      )
      .then((event) =>
        event.match(
          (event) =>
            expect(event).toStrictEqual(
              createPathCardHasBeenPlacedEvent({
                position: [8, -2],
                card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
              })
            ),
          never
        )
      )
      .then(() =>
        source.read().then((events) =>
          expect(events).toStrictEqual([
            createPathCardHasBeenPlacedEvent({
              position: [0, 0],
              card: PathCard.START,
            }),
            createPathCardHasBeenPlacedEvent({
              position: [8, 0],
              card: PathCard.GOAL_COAL_BOTTOM_LEFT,
            }),
            createPathCardHasBeenPlacedEvent({
              position: [8, 2],
              card: PathCard.GOAL_GOLD,
            }),
            createPathCardHasBeenPlacedEvent({
              position: [8, -2],
              card: PathCard.GOAL_COAL_BOTTOM_RIGHT,
            }),
          ])
        )
      ));

  test(`
      given:
        a board:
          - a start card at position (0, 0)
      when:
        place
          - path card [connected cross] at position (0, 0)
      then:
        the path card cannot be placed.
    `, () =>
    Promise.resolve()
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [0, 0],
            card: PathCard.START,
          })
        )
      )
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [0, 0],
            card: PathCard.CONNECTED_CROSS,
          })
        )
      )
      .then((result) =>
        result.match(never, (error) =>
          expect(error).toStrictEqual(
            Error(
              "the path card connected cross cannot be placed at position (0,0)"
            )
          )
        )
      ));

  test(`
    given:
      a board with
        - a start card at position (0, 0)
        - a path card [connected bottom right] at position (0, 1)
        - a path card [connected top left right] at position (1, 1)
    when:
      place
        path card [connected bottom right] at position (1, 0)
    then:
      the path card cannot be placed.
  `, () =>
    Promise.resolve()
      .then(() => {
        source.append(
          createPathCardHasBeenPlacedEvent({
            position: [0, 0],
            card: PathCard.START,
          })
        );
        source.append(
          createPathCardHasBeenPlacedEvent({
            position: [0, 1],
            card: PathCard.CONNECTED_BOTTOM_RIGHT,
          })
        );
        source.append(
          createPathCardHasBeenPlacedEvent({
            position: [1, 1],
            card: PathCard.CONNECTED_TOP_LEFT_RIGHT,
          })
        );
      })
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [1, 0],
            card: PathCard.CONNECTED_BOTTOM_RIGHT,
          })
        )
      )
      .then((result) =>
        result.match(never, (error) =>
          expect(error).toStrictEqual(
            Error(
              "the path card connected bottom right cannot be placed at position (1,0)"
            )
          )
        )
      ));

  test(`
      given:
        a board with
          - start card at position (0, 0)
          - path card [connected bottom left] at position (1, 0)
      when:
        place
          path card [connected left right] at position (2, 0)
      then:
        the path card cannot be placed.
    `, () => {
    Promise.resolve()
      .then(() => {
        source.append(
          createPathCardHasBeenPlacedEvent({
            position: [0, 0],
            card: PathCard.START,
          })
        );
        source.append(
          createPathCardHasBeenPlacedEvent({
            position: [1, 0],
            card: PathCard.CONNECTED_BOTTOM_LEFT,
          })
        );
      })
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [2, 0],
            card: PathCard.CONNECTED_LEFT_RIGHT,
          })
        )
      )
      .then((result) =>
        result.match(never, (error) =>
          expect(error).toStrictEqual(
            Error(
              "the path card connected left right cannot be placed at position (2,0)"
            )
          )
        )
      );
  });

  test(`
  given:
    a board with
      - a start card at position (0, 0)
      - a path card [deadend top left right] at position (0, -1)
  when:
    place
      path card [deadend left right] at position (1, -1)
  then:
    the path card cannot be placed.
`, () =>
    Promise.resolve()
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [0, 0],
            card: PathCard.START,
          })
        )
      )
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [0, -1],
            card: PathCard.DEADEND_TOP_LEFT_RIGHT,
          })
        )
      )
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [1, -1],
            card: PathCard.DEADEND_LEFT_RIGHT,
          })
        )
      )
      .then((result) =>
        result.match(never, (error) =>
          expect(error).toStrictEqual(
            Error(
              "the path card deadend left right cannot be placed at position (1,-1)"
            )
          )
        )
      ));

  test(`
    given:
      a board with
        - a start card at position (0, 0)
        - a path card [connected top left right] at position (1, 0)
    when:
      place
        a path card [connected left bottom] at position (2, 0)
    then:
      - should return
        - path card has been placed event with
          - path card [connected left bottom] at position (2, 0)
      - event source should includes
        - path card has been placed event with
          - a start card at position (0, 0)
          - a path card [connected top left right] at position (1, 0)
          - path card [connected left bottom] at position (2, 0)
          `, async () =>
    placePathCard(
      source,
      createPlacePathCardCommand({
        position: [0, 0],
        card: PathCard.START,
      })
    )
      .then((result) =>
        result.match(
          (event) =>
            expect(event).toStrictEqual(
              createPathCardHasBeenPlacedEvent({
                position: [0, 0],
                card: PathCard.START,
              })
            ),
          never
        )
      )
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [1, 0],
            card: PathCard.CONNECTED_TOP_LEFT_RIGHT,
          })
        )
          .then((result) =>
            result.match(
              (event) =>
                expect(event).toStrictEqual(
                  createPathCardHasBeenPlacedEvent({
                    position: [1, 0],
                    card: PathCard.CONNECTED_TOP_LEFT_RIGHT,
                  })
                ),
              never
            )
          )
          .then(() =>
            placePathCard(
              source,
              createPlacePathCardCommand({
                position: [2, 0],
                card: PathCard.CONNECTED_BOTTOM_LEFT,
              })
            )
          )
          .then((result) =>
            result.match(
              (event) =>
                expect(event).toStrictEqual(
                  createPathCardHasBeenPlacedEvent({
                    position: [2, 0],
                    card: PathCard.CONNECTED_BOTTOM_LEFT,
                  })
                ),
              never
            )
          )
          .then(() =>
            source.read().then((events) =>
              expect(events).toStrictEqual([
                createPathCardHasBeenPlacedEvent({
                  position: [0, 0],
                  card: PathCard.START,
                }),
                createPathCardHasBeenPlacedEvent({
                  position: [1, 0],
                  card: PathCard.CONNECTED_TOP_LEFT_RIGHT,
                }),
                createPathCardHasBeenPlacedEvent({
                  position: [2, 0],
                  card: PathCard.CONNECTED_BOTTOM_LEFT,
                }),
              ])
            )
          )
      ));

  test(`
    given:
      a board with
        - a start card at position (0, 0)
    when:
      place
        - path card [connected cross] at position (0, 1)
    then:
      - should return
        - path card has been placed event with
          - path card [connected cross] at position (0, 1)
      - event source should includes
        - path card has been placed event with
          - path card [connected cross] at position (0, 1)
  `, async () =>
    placePathCard(
      source,
      createPlacePathCardCommand({
        position: [0, 0],
        card: PathCard.START,
      })
    )
      .then((result) =>
        result.match(
          (event) =>
            expect(event).toStrictEqual(
              createPathCardHasBeenPlacedEvent({
                position: [0, 0],
                card: PathCard.START,
              })
            ),
          never
        )
      )
      .then(() =>
        placePathCard(
          source,
          createPlacePathCardCommand({
            position: [0, 1],
            card: PathCard.CONNECTED_CROSS,
          })
        )
          .then((result) =>
            result.match(
              (event) =>
                expect(event).toStrictEqual(
                  createPathCardHasBeenPlacedEvent({
                    position: [0, 1],
                    card: PathCard.CONNECTED_CROSS,
                  })
                ),
              never
            )
          )
          .then(() =>
            source.read().then((events) =>
              expect(events).toStrictEqual([
                createPathCardHasBeenPlacedEvent({
                  position: [0, 0],
                  card: PathCard.START,
                }),
                createPathCardHasBeenPlacedEvent({
                  position: [0, 1],
                  card: PathCard.CONNECTED_CROSS,
                }),
              ])
            )
          )
      ));
});
