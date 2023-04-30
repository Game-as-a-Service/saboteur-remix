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

  /**
   * 由於目前抽牌事件是否要綁在這個流程還不確定
   * 因此到時候可能移除
   */

  test.todo(`
      given: 
        a player with
          - hands is empty array
        a discord cord with
          - empty  { null }
        event source with
          - deck is empty array
      when:
        pass the current turn
      then:
        - should return
          - turn has been passed with
            - discard card is null, give card is null
        - event source should includes
          - turn has been passed event with
            - discard card is null, give card is null
  `);

  test.todo(`
      given: 
        a player with
          - hands is empty array
        a discord cord with
          - empty  { null }
        event source with
          - deck with cards remaining
      when:
        pass the current turn
      then:
        - should return
          - turn has been passed with
            - discard card is null, give a card is {PathCard} (from any PathCard in the deck)
        - event source should includes
          - turn has been passed event with
            // 從 deck 取出一張 PathCard ( 抽牌事件還沒實作 )
            - discard card is null, give a card is {PathCard} (from the previously drawn card in the last event)
  `);

  test.todo(`
      given: 
        a player with
          - hands with cards remaining
        a discord cord with
          - empty  { null }
        event source with
          - deck with cards remaining
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
        event source with
          - deck with cards remaining
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
        event source with
          - deck with cards remaining
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
            - discard a card is {PathCard}, give a card is {PathCard} (from any PathCard in the deck)
        - event source should includes
          - turn has been passed event with
            // 從 deck 取出一張 PathCard ( 抽牌事件還沒實作 )
            - discard a card is {PathCard}, give a card is {PathCard} (from the previously drawn card in the last event)
  `);
});
