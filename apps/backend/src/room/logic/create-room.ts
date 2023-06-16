import { Event, CreateRoomCommand, CreateRoomEvent } from "@packages/domain";
import { ResultAsync, errAsync } from "neverthrow";
import { EventSource } from "~/models/event";
import { error } from "~/utils";

const EventSourceWriteError = error("EventSourceWriteError");
export type EventSourceWriteError = ReturnType<typeof EventSourceWriteError>;

type CreateRoomError = EventSourceWriteError;

export interface CreateRoom {
  (source: EventSource<Event>, command: CreateRoomCommand): ResultAsync<
    CreateRoomEvent,
    CreateRoomError
  >;
}

/**
 * *description*
 * create room.
 *
 * *param* source - event source
 * *param* command - create room command
 */
export const createRoom: CreateRoom = (source, command) => {
  // @todo append event to event source
  return errAsync(EventSourceWriteError("not implemented"));
};

export default createRoom;
