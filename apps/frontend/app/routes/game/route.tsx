import { json } from "@remix-run/node";
import env from "~/env.server";
import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { Provider } from "react-redux";
import { setupStore } from "./store";
import { connectClient } from "@packages/socket";
import board from "./store/board.slice";
import { useEffectOnce } from "react-use";
import { pipe } from "ramda";

export const loader = () =>
  json({
    SOCKET_URL: env.SOCKET_URL,
  });

function App() {
  return <></>;
}

export default function Route() {
  const data = useLoaderData<typeof loader>();
  const store = useMemo(setupStore, []);
  useEffectOnce(() =>
    connectClient({
      url: data.SOCKET_URL,
      onSchemaValidationError: store.dispatch,
      // events
      onPathCardHasBeenPlaced: store.dispatch,
      onPathCardHasBeenRemoved: store.dispatch,
      onTurnHasBeenPassed: store.dispatch,
      onBrokenToolHasBeenPlaced: store.dispatch,
      onBrokenToolHasBeenRemoved: store.dispatch,
      // query
      onBoardUpdated: pipe(
        board.actions.reset,
        store.dispatch
        //
      ),
    })
  );

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
