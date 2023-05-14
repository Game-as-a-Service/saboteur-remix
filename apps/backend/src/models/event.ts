import type { Json } from "~/models/json";

/**
 * An event is a message that describes a change in the state of the system.
 */
export type Event<
  Type extends string = string,
  Data extends Json = Json,
  Metadata extends Json | unknown = unknown
> = Readonly<{
  type: Type;
  data: Data;
  metadata?: Metadata;
}>;

/**
 * A revision is a unique identifier for an event.
 */
export type ReadRevision = "start" | "end" | bigint;
/**
 * The direction of the read.
 */
export type Direction = "forwards" | "backwards";

/**
 * Options for reading events.
 */
export interface ReadOption {
  /**
   * The number of events to read.
   * @default Number.MAX_SAFE_INTEGER
   */
  maxCount?: number | bigint;
  /**
   * Starts the read at the given event revision.
   * @default START
   */
  fromRevision?: ReadRevision;

  /**
   * Sets the read direction of the stream.
   * @default FORWARDS
   */
  direction?: Direction;
}

/**
 * An event listener is a function that is called when an event is emitted.
 */
type EventListener<E extends Event> = (event: E) => void;

/**
 * An event source is a place where events can be stored and read.
 */
export interface EventSource<E extends Event> {
  /**
   * Append events to the event source.
   * @param events The events to append.
   */
  append(...events: E[]): Promise<E[]>;
  /**
   * Read events from the event source.
   * @param option The options for reading events.
   */
  read(option?: ReadOption): Promise<E[]>;

  /**
   * Subscribe to events from the event source.
   * @param type The type of event to subscribe to.
   * @param listener The listener to subscribe.
   */
  on(type: E["type"], listener: EventListener<E>): void;

  /**
   * Unsubscribe from events from the event source.
   * @param type The type of event to unsubscribe from.
   * @param listener The listener to unsubscribe.
   */
  off(type: E["type"], listener: EventListener<E>): void;
}
