import { describe, test, expect } from "vitest";
import getAvailablePositions from "~/board/logic/get-available-positions";
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
});
