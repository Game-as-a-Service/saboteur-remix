import { json } from "@remix-run/node";
import env from "~/env.server";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { connectClient } from "@packages/socket";

export function loader() {
  return json({
    SOCKET_URL: env.SOCKET_URL,
  });
}

function App() {
  return <></>;
}

export default function Route() {
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    const disconnect = connectClient({
      url: data.SOCKET_URL,
      onPathCardHasBeenPlaced: store.dispatch,
      onBoardUpdated: store.dispatch,
    });

    return disconnect;
  }, [data.SOCKET_URL]);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
