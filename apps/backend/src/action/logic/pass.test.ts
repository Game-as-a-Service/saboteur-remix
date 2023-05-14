import { EventSource } from "~/models/event";
import { TurnHasBeenPassedEvent } from "../event";
import pass from "./pass";
import { PassCommand } from "../command";
import { Event as ActionEvent } from "~/action/event";
import { PathCard } from "~/models/card";
import { never } from "~/utils";
import { PlayerHadHandLeftEvent } from "../event/player-had-hand-left";

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
  `, async () => {
    (source as EventSource<ActionEvent>).append(PlayerHadHandLeftEvent([]));

    await pass(source, PassCommand()).match(
      (event) => expect(event).toStrictEqual([TurnHasBeenPassedEvent()]),
      never
    );

    source
      .read()
      .then((result) =>
        expect(result).toStrictEqual([
          PlayerHadHandLeftEvent([]),
          TurnHasBeenPassedEvent(),
        ])
      );
  });

  test(`
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
  `, async () => {
    (source as EventSource<ActionEvent>).append(PlayerHadHandLeftEvent([]));

    await pass(source, PassCommand(PathCard.CONNECTED_CROSS)).match(
      never,
      (err) =>
        expect(err).toStrictEqual(Error("Player does not have this card"))
    );

    source
      .read()
      .then((result) =>
        expect(result).toStrictEqual([PlayerHadHandLeftEvent([])])
      );
  });

  test(`
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
  `, async () => {
    (source as EventSource<ActionEvent>).append(
      PlayerHadHandLeftEvent([PathCard.CONNECTED_BOTTOM_LEFT])
    );

    await pass(source, PassCommand()).match(never, (err) =>
      expect(err).toStrictEqual(
        Error(
          "Player has remaining card, so nullish discard card cannot be sent"
        )
      )
    );

    source
      .read()
      .then((result) =>
        expect(result).toStrictEqual([
          PlayerHadHandLeftEvent([PathCard.CONNECTED_BOTTOM_LEFT]),
        ])
      );
  });

  test(`
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
  `, async () => {
    (source as EventSource<ActionEvent>).append(
      PlayerHadHandLeftEvent([PathCard.CONNECTED_BOTTOM_LEFT])
    );

    await pass(source, PassCommand(PathCard.CONNECTED_CROSS)).match(
      never,
      (err) =>
        expect(err).toStrictEqual(Error("Player does not have this card"))
    );

    source
      .read()
      .then((result) =>
        expect(result).toStrictEqual([
          PlayerHadHandLeftEvent([PathCard.CONNECTED_BOTTOM_LEFT]),
        ])
      );
  });

  test(`
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
  `, async () => {
    (source as EventSource<ActionEvent>).append(
      PlayerHadHandLeftEvent([PathCard.CONNECTED_CROSS])
    );

    await pass(source, PassCommand()).match(
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
          PlayerHadHandLeftEvent([PathCard.CONNECTED_CROSS]),
          TurnHasBeenPassedEvent(PathCard.CONNECTED_CROSS),
        ])
      );
  });
});
