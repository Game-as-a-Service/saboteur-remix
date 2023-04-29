import getAvailablePositions from "./get-available-positions";
import { PathCard } from "~/models/card";

describe("get available positions", () => {
  test(`
      given:
        an empty placement array 
      when:
        get available positions
      then:
        no available positions
  `, () => {
    expect(getAvailablePositions([])).toIncludeSameMembers([]);
  });

  test(`
      given:
        a placement array with
          - a start card at position (0, 0)
      when:
        get available positions
      then:
        positions includes
          - position ( 0, 1)
          - position ( 0,-1)
          - position (-1, 0)
          - position ( 1, 0)
  `, () => {
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

  test(`
      given:
        a placement array with
          - a start card at position (0, 0)
          - a path card [deadend cross] at position (1, 0)
      when:
        get available positions
      then:
        positions includes
          - position ( 0, 1)
          - position ( 0,-1)
          - position (-1, 0)
  `, () => {
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

  test(`
      given:
        a placement array with
          - a start card at position (0, 0)
          - a path card [connected bottom right] at position (0, 1)
          - a path card [connected top left right] at position (1, 1)
      when:
        get available positions
      then:
        positions includes
          - position ( 0,-1)
          - position (-1, 0)
          - position ( 1, 0)
          - position ( 1, 2)
          - position ( 2, 1)
  `, () => {
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

  test(`
      given:
        a placement array with
          - a start card at position (0, 0)
          - a path card [deadend top left right] at position (0, -1)
      when:
        get available positions
      then:
        positions includes
          - position (1, 0)
          - position (0, 1)
          - position (0,-1)
  `, () => {
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
