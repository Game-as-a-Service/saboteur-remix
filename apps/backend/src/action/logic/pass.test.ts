import { EventSource } from "~/models/event";
import { TurnHasBeenPassedEvent } from "../event";
import pass from "./pass";
import { PassCommand } from "../command";
import { PathCard } from "~/models/card";
import { never } from "~/utils";

describe("pass", () => {
  let source: EventSource<TurnHasBeenPassedEvent>;

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
      a discord cord with
        - empty  { null }
    when:
      pass the current turn
    then:
      - should return
        - turn has been passed with
          - discard card is null
      - event source should includes
        - turn has been passed event with
          - discard card is null
  `, async () => {
    await pass(source, PassCommand()).match(
      (event) => expect(event).toStrictEqual([TurnHasBeenPassedEvent()]),
      never
    );

    source
      .read()
      .then((result) =>
        expect(result).toStrictEqual([TurnHasBeenPassedEvent()])
      );
  });

  test(`
    given: 
      a discord cord with
        - the card is {PathCard}

    when:
      pass the current turn
    then:
      - should return
        - turn has been passed with
          - discard a card is {PathCard}
  `, async () => {
    await pass(source, PassCommand(PathCard.CONNECTED_CROSS)).match(
      (event) =>
        expect(event).toStrictEqual([
          TurnHasBeenPassedEvent(PathCard.CONNECTED_CROSS),
        ]),
      never
    );

    source
      .read()
      .then((result) =>
        expect(result).toStrictEqual([
          TurnHasBeenPassedEvent(PathCard.CONNECTED_CROSS),
        ])
      );
  });
});
