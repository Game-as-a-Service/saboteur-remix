import { renderWithProviders } from "test-utils";
import { useSelector } from "react-redux";
import * as Board from "./board.slice";
import { Vec } from "@packages/domain";
import { act, screen, within } from "@testing-library/react";
import { PathCard } from "@packages/domain";
import { setupStore } from ".";

function View() {
  const boards = useSelector(Board.selectBoard);
  return (
    <ul>
      {boards.map((board) => (
        <li key={board.position.join("") + board.card}>
          <ul data-testid="position">
            {board.position.map((item, index) => (
              <li key={item + index}>{item}</li>
            ))}
          </ul>
          <div data-testid="card">{board.card}</div>
        </li>
      ))}
    </ul>
  );
}

describe("board state", () => {
  test("initial board state with empty", () => {
    renderWithProviders(<View />, {
      store: setupStore({
        board: {
          ids: [],
          entities: {},
        },
      }),
    });

    expect(screen.queryAllByTestId("position")).toHaveLength(0);
    expect(screen.queryAllByTestId("card")).toHaveLength(0);
  });

  test("board state with one card", async () => {
    const store = setupStore({
      board: {
        ids: [Vec.id([0, 0])],
        entities: {
          [Vec.id([0, 0])]: {
            position: [0, 0],
            card: PathCard.START,
          },
        },
      },
    });
    renderWithProviders(<View />, { store });

    // verify nodes exist
    const cards = screen.queryAllByTestId("card");
    const positions = screen.queryAllByTestId("position");

    // expect to find one card
    expect(cards).toHaveLength(1);
    // expect to find one position
    expect(positions).toHaveLength(1);

    // verify the card
    expect((cards[0])).toHaveTextContent("start");
    // verify the position
    const positionItems1 = within(positions[0]).queryAllByRole("listitem");
    expect(positionItems1).toHaveLength(2);
    expect(positionItems1[0]).toHaveTextContent("0");
    expect(positionItems1[1]).toHaveTextContent("0");
  });

  test("board state with multiple card", async () => {
    const store = setupStore({
      board: {
        ids: [Vec.id([0, 0]), Vec.id([0, 1])],
        entities: {
          [Vec.id([0, 0])]: {
            position: [0, 0],
            card: PathCard.START,
          },
          [Vec.id([0, 1])]: {
            position: [0, 1],
            card: PathCard.CONNECTED_TOP_BOTTOM,
          },
        },
      },
    });
    renderWithProviders(<View />, { store });

    // verify nodes exist
    const cards = screen.queryAllByTestId("card");
    const positions = screen.queryAllByTestId("position");

    // expect to find two cards
    expect(cards).toHaveLength(2);
    // expect to find two positions
    expect(positions).toHaveLength(2);

    // verify the first card
    expect(cards[0]).toHaveTextContent("start");
    // verify the first position
    const positionItems1 = within(positions[0]).queryAllByRole("listitem");
    expect(positionItems1).toHaveLength(2);
    expect(positionItems1[0]).toHaveTextContent("0");
    expect(positionItems1[1]).toHaveTextContent("0");

    // verify the second card
    expect(cards[1]).toHaveTextContent("connected top bottom");

    // verify the second position
    const positionItems2 = within(positions[1]).queryAllByRole("listitem");
    expect(positionItems2).toHaveLength(2);
    expect(positionItems2[0]).toHaveTextContent("0");
    expect(positionItems2[1]).toHaveTextContent("1");
  });

  test("add card to the board", async () => {
    const store = setupStore({
      board: {
        ids: [],
        entities: {},
      },
    });

    renderWithProviders(<View />, { store });

    // verify nodes is not exist
    expect(screen.queryAllByTestId("card")).toHaveLength(0);
    expect(screen.queryAllByTestId("position")).toHaveLength(0);

    await act(() =>
      store.dispatch(
        Board.add({
          position: [0, 0],
          card: "start",
        })
      )
    );

    // verify nodes has been added
    const cards = screen.queryAllByTestId("card");
    const positions = screen.queryAllByTestId("position");

    // expect to find one card
    expect(cards).toHaveLength(1);
    // expect to find one position
    expect(positions).toHaveLength(1);

    // verify the card
    expect(cards[0]).toHaveTextContent("start");
    // verify the position
    const positionItems1 = within(positions[0]).queryAllByRole("listitem");
    expect(positionItems1).toHaveLength(2);
    expect(positionItems1[0]).toHaveTextContent("0");
    expect(positionItems1[1]).toHaveTextContent("0");
  });

  test("remove card from the board", async () => {
    const store = setupStore({
      board: {
        ids: [Vec.id([0, 0])],
        entities: {
          [Vec.id([0, 0])]: {
            position: [0, 0],
            card: PathCard.START,
          },
        },
      },
    });

    renderWithProviders(<View />, { store });

    // verify nodes exist
    expect(screen.queryAllByTestId("position")).toHaveLength(1);
    expect(screen.queryAllByTestId("card")).toHaveLength(1);

    await act(() =>
      store.dispatch(
        Board.remove({
          position: [0, 0],
          card: "start",
        })
      )
    );

    // check nodes had been removed
    expect(screen.queryAllByTestId("position")).toHaveLength(0);
    expect(screen.queryAllByTestId("card")).toHaveLength(0);
  });
});
