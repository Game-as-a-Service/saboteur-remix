import { thunkify } from "ramda";
import { io } from "socket.io-client";
import { group, groupCollapsed, debug, error } from "@packages/utils";

const onOpen = thunkify(debug)`connection opened`;
const onClose = thunkify(debug)`connection closed`;
const onReconnect = thunkify(debug)`reconnected`;
const onReconnectAttempt = (attempt: number) =>
  debug`reconnect attempt: ${attempt}`;
const onPacket = groupCollapsed(debug)`packet received`;
const onPing = thunkify(debug)`ping`;
const onError = group(error)`error occurred`;
const onReconnectFailed = thunkify(error)`reconnect failed`;
const onReconnectError = group(error)`error occurred while reconnecting`;

function createSocket(url: string) {
  const socket = io(url);
  socket.io.on("open", onOpen);
  socket.io.on("ping", onPing);
  socket.io.on("error", onError);
  socket.io.on("close", onClose);
  socket.io.on("packet", onPacket);
  socket.io.on("reconnect", onReconnect);
  socket.io.on("reconnect_attempt", onReconnectAttempt);
  socket.io.on("reconnect_failed", onReconnectFailed);
  socket.io.on("reconnect_error", onReconnectError);
  return socket;
}

export default createSocket;
