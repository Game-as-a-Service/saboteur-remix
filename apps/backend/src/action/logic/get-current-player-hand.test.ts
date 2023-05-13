import { Event as ActionEvent } from "~/action/event";
import { EventSource } from "~/models/event";
import getCurrentPlayerHand from "./get-current-player-hand";
import { never } from "~/utils";
import { PlayerHadHandLeftEvent } from "../event/player-had-hand-left";
import { PathCard } from "~/models/card";

describe("get current player hand", () => {
  let source: EventSource<ActionEvent>;

  beforeEach(() => {
    let store: unknown[] = [];
    const append = jest.fn().mockImplementation((...args: unknown[]) => {
      store = store.concat(...args);
      return Promise.resolve(args);
    });
    const read = jest.fn().mockImplementation(() => {
      return Promise.resolve(store);
    });

    source = { append, read, on: jest.fn(), off: jest.fn() };
  });

  test(`
    given: 
      event source with
        - is a empty array
    when:
      get current player hand
    then:
      - should return
        - error
          - failed find player hand events from source
  `, async () => {
    getCurrentPlayerHand(source).match(never, (err) =>
      expect(err).toStrictEqual(
        Error("failed find player hand events from source")
      )
    );
  });

  test(`
    given: 
      event source with
        - Player Had Hand Left Event 
        { card: [] }
    when:
      get current player hand
    then:
      - should return
        - is a empty array 
        []
  `, async () => {
    await source.append(PlayerHadHandLeftEvent([]));

    getCurrentPlayerHand(source).match(
      (ok) => expect(ok).toStrictEqual([]),
      never
    );
  });

  test(`
    given: 
      event source with
        - Player Had Hand Left Event 
        { card: [connected bottom left, connected top bottom ] }
    when:
      get current player hand
    then:
      - should return
        - is a have path card array 
        [connected bottom left, connected top bottom ]
  `, async () => {
    await source.append(
      PlayerHadHandLeftEvent([
        PathCard.CONNECTED_BOTTOM_LEFT,
        PathCard.CONNECTED_TOP_BOTTOM,
      ])
    );

    getCurrentPlayerHand(source).match(
      (ok) =>
        expect(ok).toStrictEqual([
          PathCard.CONNECTED_BOTTOM_LEFT,
          PathCard.CONNECTED_TOP_BOTTOM,
        ]),
      never
    );
  });

  test(`
    given: 
      event source with
        - Player Had Hand Left Event 
        { card: [connected bottom left, connected top bottom ] }
        { card: [connected left right, connected cross] }
    when:
      get current player hand
    then:
      - should return
        - is a have path card array, this is a last data
        [connected left right, connected cross]
  `, async () => {
    await source.append(
      PlayerHadHandLeftEvent([
        PathCard.CONNECTED_BOTTOM_LEFT,
        PathCard.CONNECTED_TOP_BOTTOM,
      ])
    );

    await source.append(
      PlayerHadHandLeftEvent([
        PathCard.CONNECTED_LEFT_RIGHT,
        PathCard.CONNECTED_CROSS,
      ])
    );

    getCurrentPlayerHand(source).match(
      (ok) =>
        expect(ok).toStrictEqual([
          PathCard.CONNECTED_LEFT_RIGHT,
          PathCard.CONNECTED_CROSS,
        ]),
      never
    );
  });
});
