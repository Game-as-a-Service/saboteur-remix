import { json } from "@remix-run/node";
import env from "~/env.server";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import createSocket from "~/services/socket.client";

export function loader() {
  return json({
    SOCKET_URL: env.SOCKET_URL,
  });
}

type Socket = ReturnType<typeof createSocket>;
function useSocket(url: string) {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = createSocket(url);

    socket.open();
    socket.once("connect", () => setSocket(socket));
    return () => {
      socket.disconnect();
    };
  }, [url, setSocket]);

  return socket;
}

export default function Route() {
  const data = useLoaderData<typeof loader>();

  const socket = useSocket(data.SOCKET_URL);

  console.log(socket);

  return <></>;
}
