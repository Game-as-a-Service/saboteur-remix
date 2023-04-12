import {
  PathCardHasBeenPlacedEvent,
  isPathCardHasBeenPlacedEvent,
} from "./path-card-has-been-placed.event";
import { PathCard } from "~/models/card";

describe("event > path card has been placed", () => {
  test("create path card has been placed event", () =>
    expect(
      PathCardHasBeenPlacedEvent({ card: PathCard.START, position: [0, 0] })
    ).toStrictEqual({
      type: "path card has been placed",
      data: [{ card: PathCard.START, position: [0, 0] }],
    }));

  test("is path card has been placed event", () => {
    expect(
      isPathCardHasBeenPlacedEvent({
        type: "path card has been placed",
        data: [{ card: PathCard.START, position: [0, 0] }],
      })
    ).toBe(true);

    expect(
      isPathCardHasBeenPlacedEvent({
        type: "path card has been placed",
      })
    ).toBe(false);

    expect(
      isPathCardHasBeenPlacedEvent({
        data: [{ card: PathCard.START, position: [0, 0] }],
      })
    ).toBe(false);
  });
});
