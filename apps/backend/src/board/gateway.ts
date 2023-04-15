import { Socket } from "socket.io";
import createEventSource from "~/data/event-source";
import { Placement } from "~/models/placement";
import { PlacePathCardCommand } from "~/board/command";
import { BoardEvent, PathCardHasBeenPlacedEvent } from "~/board/event";
import { CurrentPlacementQuery } from "~/board/query";
import Aggregate from "~/board/aggregate";
import Projection from "~/board/projection";

interface ServerToClientEvents {
  "path card has been placed": (event: PathCardHasBeenPlacedEvent) => void;
  "update board": (placements: Placement[]) => void;
}

interface ClientToServerEvents {
  "place path card": (placement: Placement) => void;
}

export type Client = Socket<
  ClientToServerEvents,
  ServerToClientEvents
  //
>;

// todo: get room id from client
function getRoomIdFromClient(client: Client) {
  return "room:id";
}

function gateway(client: Client) {
  const room = getRoomIdFromClient(client);
  const source = createEventSource<BoardEvent>(room);
  const aggregate = Aggregate(source);
  const projection = Projection(source);

  client.on("place path card", (placement) =>
    aggregate(PlacePathCardCommand(placement))
  );
  source.on("path card has been placed", (event) => {
    client.in(room).emit("path card has been placed", event);

    projection(CurrentPlacementQuery()).then((placements) =>
      client.in(room).emit("update board", placements)
    );
  });
}

export default gateway;
