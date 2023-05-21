import createEventSource from "~/data/event-source";
import Aggregate from "~/board/aggregate";
import Projection from "~/board/projection";
import env from "~/env";
import { connectServer } from "@packages/socket";
import { Socket } from "socket.io";
import {
  Event,
  createCurrentPlacementQuery,
  createPlacePathCardCommand,
  createUpdateBoardEvent,
} from "@packages/domain";
import { flow } from "fp-ts/lib/function";

// todo: get room id from client
function getRoomIdFromClient(socket: Socket) {
  return "room:id";
}

function gateway(socket: Socket) {
  const room = getRoomIdFromClient(socket);
  const source = createEventSource<Event>({
    key: room,
    url: env.REDIS_URL,
  });
  const aggregate = Aggregate(source);
  const projection = Projection(source);

  const emit = connectServer({
    server: socket,
    onSchemaValidationError: console.error,
    onPlacePathCard: flow(
      createPlacePathCardCommand,
      aggregate
      //
    ),
  });

  source.on("path card has been placed", (event) => {
    emit(event);

    projection(createCurrentPlacementQuery())
      .then(createUpdateBoardEvent)
      .then(emit);
  });
}

export default gateway;
