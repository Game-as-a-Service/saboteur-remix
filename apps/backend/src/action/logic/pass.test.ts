import { EventSource } from "~/models/event";
import pass from "./pass";
import { never } from "~/utils";
import {
  Event,
  PathCard,
  createPassCommand,
  createTurnHasBeenPassedEvent,
} from "@packages/domain";

describe("pass", () => {
  let source: EventSource<Event>;

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
    await pass(source, createPassCommand()).match(
      (event) => expect(event).toStrictEqual(createTurnHasBeenPassedEvent()),
      never
    );

    source
      .read()
      .then((result) =>
        expect(result).toStrictEqual([createTurnHasBeenPassedEvent()])
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
    await pass(source, createPassCommand(PathCard.CONNECTED_CROSS)).match(
      (event) =>
        expect(event).toStrictEqual(
          createTurnHasBeenPassedEvent(PathCard.CONNECTED_CROSS)
        ),
      never
    );

    source
      .read()
      .then((result) =>
        expect(result).toStrictEqual([
          createTurnHasBeenPassedEvent(PathCard.CONNECTED_CROSS),
        ])
      );
  });
});
