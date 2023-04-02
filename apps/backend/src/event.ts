export type JSONType = Record<string | number, unknown> | unknown[] | string;

/**
 * An event is a message that describes a change in the state of the system.
 */
export type Event<
  Type extends string | symbol = string | symbol,
  Data extends JSONType = JSONType,
  Metadata extends JSONType | unknown = unknown
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
 * An event source is a place where events can be stored and read.
 */
export interface EventSource {
  /**
   * Append events to the event source.
   * @param events The events to append.
   */
  append: <E extends Event>(...events: E[]) => Promise<E[]>;
  /**
   * Read events from the event source.
   * @param option The options for reading events.
   */
  read: (option?: ReadOption) => Promise<Event[]>;
}
