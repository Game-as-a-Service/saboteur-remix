import getAvailablePositions from "./get-available-positions";
import { PathCard } from "~/models/card";

describe("get available positions", () => {
  test("start", () => {
    expect(
      getAvailablePositions([
        { position: [0, 0], card: PathCard.START },
        //
      ])
    ).toIncludeSameMembers([
      expect.toIncludeAllMembers([0, 1]),
      expect.toIncludeAllMembers([0, -1]),
      expect.toIncludeAllMembers([-1, 0]),
      expect.toIncludeAllMembers([1, 0]),
    ]);
  });

  test("start and deadend_cross test", () => {
    expect(
      getAvailablePositions([
        { position: [0, 0], card: PathCard.START },
        { position: [1, 0], card: PathCard.DEADEND_CROSS },
      ])
    ).toIncludeSameMembers([
      expect.toIncludeAllMembers([0, 1]),
      expect.toIncludeAllMembers([0, -1]),
      expect.toIncludeAllMembers([-1, 0]),
    ]);
  });

  test("test for place-path-card-logic-1", () => {
    expect(
      getAvailablePositions([
        { position: [0, 0], card: PathCard.START },
        { position: [0, 1], card: PathCard.CONNECTED_BOTTOM_RIGHT },
        { position: [1, 1], card: PathCard.CONNECTED_TOP_LEFT_RIGHT },
      ])
    ).toIncludeSameMembers([
      expect.toIncludeAllMembers([0, -1]),
      expect.toIncludeAllMembers([-1, 0]),
      expect.toIncludeAllMembers([1, 0]),
      expect.toIncludeAllMembers([1, 2]),
      expect.toIncludeAllMembers([2, 1]),
    ]);
  });

  test("test for place-path-card-logic-3", () => {
    expect(
      getAvailablePositions([
        { position: [0, 0], card: PathCard.START },
        { position: [0, -1], card: PathCard.DEADEND_TOP_LEFT_RIGHT },
      ])
    ).toIncludeSameMembers([
      expect.toIncludeAllMembers([1, 0]),
      expect.toIncludeAllMembers([0, 1]),
      expect.toIncludeAllMembers([0, -1]),
    ]);
  });
});
