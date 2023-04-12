import type { EventSource } from "~/models/event";
import { PathCard } from "~/models/card";
import { never } from "~/utils";
import { PlacePathCardCommand } from "~/board/command";
import { PathCardHasBeenPlacedEvent } from "~/board/event";
import checkPositionsHasBeenPlaced from "./check-positions-has-been-placed";

describe("check positions has been placed", () => {
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
        place path card command
      expect:
        should return place path card command
    `, () =>
    Promise.resolve(
      checkPositionsHasBeenPlaced(
        source,
        PlacePathCardCommand({
          card: PathCard.CONNECTED_CROSS,
          position: [0, 0],
        })
      )
    )
      //
      .then((result) =>
        result.match(
          (command) =>
            expect(command).toStrictEqual(
              PlacePathCardCommand({
                card: PathCard.CONNECTED_CROSS,
                position: [0, 0],
              })
            ),
          never
        )
      ));

  test(`
      given:
        a board with:
          - start card at position (0, 0)
      when:
        place path card command with:
          - cross card at position (0, 0)
      expect:
        should throw placement has been placed error
    `, () =>
    Promise.resolve()
      .then(() =>
        source.append(
          PathCardHasBeenPlacedEvent({
            card: PathCard.CONNECTED_CROSS,
            position: [0, 0],
          })
        )
      )
      .then(() =>
        checkPositionsHasBeenPlaced(
          source,
          PlacePathCardCommand({
            card: PathCard.CONNECTED_CROSS,
            position: [0, 0],
          })
        )
      )
      .then((result) =>
        result.match(
          never,
          (error) =>
            expect(error).toStrictEqual(
              AggregateError([
                `the path card ${PathCard.CONNECTED_CROSS} cannot be placed at position (0,0)`,
                //
              ])
            )
          //
        )
      ));
});
