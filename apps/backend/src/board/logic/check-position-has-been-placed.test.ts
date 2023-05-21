import { never } from "~/utils";
import checkPositionHasBeenPlaced from "./check-position-has-been-placed";
import { PathCard, createPlacePathCardCommand } from "@packages/domain";

describe("check positions has been placed", () => {
  test(`
      given:
        an empty board
      when:
        place path card command
      expect:
        should return place path card command
    `, () =>
    Promise.resolve(
      checkPositionHasBeenPlaced([])(
        createPlacePathCardCommand({
          card: PathCard.CONNECTED_CROSS,
          position: [0, 0],
        })
      )
    ).then((result) =>
      result.match(
        (command) =>
          expect(command).toStrictEqual(
            createPlacePathCardCommand({
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
    Promise.resolve(
      checkPositionHasBeenPlaced([
        {
          card: PathCard.CONNECTED_CROSS,
          position: [0, 0],
        },
      ])(
        createPlacePathCardCommand({
          card: PathCard.CONNECTED_CROSS,
          position: [0, 0],
        })
      )
    ).then((result) =>
      result.match(never, (error) =>
        expect(error).toStrictEqual(
          Error(
            `the path card ${PathCard.CONNECTED_CROSS} cannot be placed at position (0,0)`
          )
        )
      )
    ));
});
