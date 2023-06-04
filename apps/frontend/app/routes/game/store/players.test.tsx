import { renderWithProviders } from "test-utils";
import { useSelector } from "react-redux";
import * as Players from "./players.slice";
import { Vec } from "@packages/domain";
import { act, screen, within } from "@testing-library/react";
import { setupStore } from ".";

function View() {
  const players = useSelector(Players.selectPlayers);
  return (
    <ul>
      {players.map((player) => (
        <li key={player.id}>
          <div data-testid="id">{player.id}</div>
          <div data-testid="connection-state">{player.connectionState}</div>
          <ul data-testid="hands">
            {player.hands.map((hand) => (
              <li key={hand}>{hand}</li>
            ))}
          </ul>
          <ul data-testid="broken-tools">
            {player.brokenTools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
          <ul data-testid="revealed-goal">
            {player.revealedGoal.map((placement) => (
              <li key={Vec.id(placement.position)}>
                <div data-testid="goal-position">
                  {Vec.id(placement.position)}
                </div>
                <div data-testid="goal-card">{placement.card}</div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

describe("player state", () => {
  test("initial player state with empty", () => {
    renderWithProviders(<View />, {
      store: setupStore({
        players: {
          ids: [],
          entities: {},
        },
      }),
    });
    expect(screen.queryByTestId("id")).not.toBeInTheDocument();
    expect(screen.queryByTestId("connection-state")).not.toBeInTheDocument();
    expect(screen.queryByTestId("hands")).not.toBeInTheDocument();
    expect(screen.queryByTestId("broken-tools")).not.toBeInTheDocument();
    expect(screen.queryByTestId("revealed-goal")).not.toBeInTheDocument();
  });

  test("initial player state with 1 player", () => {
    renderWithProviders(<View />, {
      store: setupStore({
        players: {
          ids: ["1"],
          entities: {
            "1": {
              id: "1",
              connectionState: "connected",
              hands: [],
              brokenTools: [],
              revealedGoal: [],
            },
          },
        },
      }),
    });

    // should render player id
    expect(screen.queryByTestId("id")).toHaveTextContent("1");

    // should render player connection state
    expect(screen.queryByTestId("connection-state")).toHaveTextContent(
      "connected"
    );

    // should render player hands
    expect(screen.queryByTestId("hands")).toBeInTheDocument();

    // player hands should be empty
    expect(
      within(screen.getByTestId("hands")).queryAllByRole("listitem")
    ).toHaveLength(0);

    // should render player broken tools
    expect(screen.queryByTestId("broken-tools")).toBeInTheDocument();
    // player broken tools should be empty
    expect(
      within(screen.getByTestId("broken-tools")).queryAllByRole("listitem")
    ).toHaveLength(0);

    // should render player revealed goal
    expect(screen.queryByTestId("revealed-goal")).toBeInTheDocument();
    // player revealed goal should be empty
    expect(
      within(screen.getByTestId("revealed-goal")).queryAllByRole("listitem")
    ).toHaveLength(0);
  });

  test("when player state update, should update ui", async () => {
    const store = setupStore({
      players: {
        ids: [],
        entities: {},
      },
    });

    // initial render with no player
    renderWithProviders(<View />, { store });
    expect(screen.queryByTestId("id")).not.toBeInTheDocument();
    expect(screen.queryByTestId("connection-state")).not.toBeInTheDocument();
    expect(screen.queryByTestId("hands")).not.toBeInTheDocument();
    expect(screen.queryByTestId("broken-tools")).not.toBeInTheDocument();
    expect(screen.queryByTestId("revealed-goal")).not.toBeInTheDocument();

    // to make sure the ui is updated, we need to wait for the next tick
    await act(() =>
      store.dispatch(
        Players.add({
          id: "1",
          connectionState: "disconnected",
          hands: [],
          brokenTools: [],
          revealedGoal: [],
        })
      )
    );

    // should render player 1
    expect(screen.queryByTestId("id")).toHaveTextContent("1");
    expect(screen.queryByTestId("connection-state")).toHaveTextContent(
      "disconnected"
    );

    // update player 1 connection state
    await act(() =>
      store.dispatch(
        Players.update({
          id: "1",
          changes: {
            connectionState: "connected",
          },
        })
      )
    );

    // player 1 connection state should be connected
    expect(screen.queryByTestId("id")).toHaveTextContent("1");
    expect(screen.queryByTestId("connection-state")).toHaveTextContent(
      "connected"
    );
  });
});
