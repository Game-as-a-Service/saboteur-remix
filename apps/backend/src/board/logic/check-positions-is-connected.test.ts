import { PathCard } from "~/models/card";
import { Position } from "./get-available-positions";
import {
  getNeighbors,
  isConnectNeighbor,
} from "./check-positions-is-connected";
import { Placement } from "~/models/placement";

describe("check positions is connected", () => {
  let board: Placement[];

  beforeEach(() => {
    board = [
      { position: [0, 0], card: PathCard.START },
      { position: [0, 1], card: PathCard.CONNECTED_BOTTOM_RIGHT },
      { position: [1, 1], card: PathCard.CONNECTED_TOP_LEFT_RIGHT },
      { position: [-1, 0], card: PathCard.DEADEND_TOP_BOTTOM_RIGHT },
    ];
  });

  it.each<[Position, Position[]]>([
    [
      [1, 1],
      [
        [1, 2],
        [1, 0],
        [2, 1],
        [0, 1],
      ],
    ],
    [
      [-1, -1],
      [
        [-1, 0],
        [-1, -2],
        [0, -1],
        [-2, -1],
      ],
    ],
  ])(
    `
      [getNeighbors]
      when:
        input position %j
      expect:
        should return positions %j
    `,
    (position: Position, expected: Position[]) => {
      expect(getNeighbors(position)).toIncludeSameMembers(expected);
    }
  );

  it.each<[Placement, boolean]>([
    [{ position: [1, 0], card: PathCard.CONNECTED_BOTTOM_RIGHT }, false],
    [{ position: [1, 0], card: PathCard.CONNECTED_LEFT_RIGHT }, true],
    [{ position: [1, 0], card: PathCard.CONNECTED_CROSS }, false],
    [{ position: [1, 0], card: PathCard.CONNECTED_TOP_LEFT_RIGHT }, false],
    [{ position: [1, 0], card: PathCard.DEADEND_LEFT }, true],
    [{ position: [1, 0], card: PathCard.DEADEND_BOTTOM_LEFT }, true],
    [{ position: [-1, 1], card: PathCard.DEADEND_LEFT }, false],
    [{ position: [-1, 1], card: PathCard.DEADEND_BOTTOM_LEFT }, true],
    [{ position: [-1, 1], card: PathCard.DEADEND_BOTTOM_RIGHT }, false],
    [{ position: [-1, 1], card: PathCard.DEADEND_BOTTOM }, true],
  ])(
    `
      [isConnectNeighbor]
      given:
        - a board with:
          - start card at position (0, 0)
          - path card connected bottom right at position (0, 1)
          - path card connected top left right at position (1, 1)
          - path card deadend top bottom right at position (-1, 0)
      when:
        add new placement %j
      expect:
        is placement connected to neighbors on current board: %j
    `,
    (y: Placement, expected: boolean) => {
      expect(isConnectNeighbor(board)(y)).toStrictEqual(expected);
    }
  );
});
