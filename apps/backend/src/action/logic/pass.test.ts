import { EventSource } from "~/models/event";
import { TurnHasBeenPassedEvent } from "../event";

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

  test.todo(`
      given: 
        a player with
          - hands is empty array
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
  `);

  test.todo(`
      given: 
        a player with
          - hands is empty array
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
  `);

  test.todo(`
      given: 
        a player with
          - hands with cards remaining
        a discord cord with
          - empty  { null }
      when:
        pass the current turn
      then:
        - should return 
          - turn has been passed error with
            - player has cards remaining, so cannot choose to not discard a card
  `);

  test.todo(`
      given: 
        a player with
          - hands with cards remaining
        a discord cord with
          - the card not from this player hands
      when:
        pass the current turn
      then:
        - should return 
          - turn has been passed error with
            - player chooses to discard a card that was not drawn from self hand
  `);

  test.todo(`
      given: 
        a player with
          - hands is empty array
        a discord cord with
          - any {PathCard}
      when:
        pass the current turn
      then:
        - should return 
          - turn has been passed error with
            - player chooses to discard a card that was not drawn from self hand
  `);

  test.todo(`
      given: 
        a player with
          - hands with cards remaining
        a discord cord with
          - the card from this player hands
        event source with
          - deck with cards remaining
      when:
        pass the current turn
      then:
        - should return
          - turn has been passed with
            - discard a card is {PathCard}
        - event source should includes
          - turn has been passed event with
            - discard a card is {PathCard}
  `);
});
