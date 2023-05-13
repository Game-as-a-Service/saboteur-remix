import { PathCard } from "~/models/card";
import checkDeckHasCard from "./check-deck-has-card";
import { never } from "~/utils";

describe("check deck has card", () => {
  test(`
    given: 
      a deck
        - is a empty array
      a card
        - nullish
    when:
      check deck has card
    then:
      - should return
        - error
          - Unable to check, because this is not a PathCard
  `, async () => {
    const hasCard = checkDeckHasCard([]);

    hasCard(null).match(never, (err) =>
      expect(err).toStrictEqual(
        Error("Unable to check, because this is not a PathCard")
      )
    );
  });

  test(`
    given: 
      a deck
        - is a empty array
      a card
        - CONNECTED_BOTTOM_LEFT
    when:
      check deck has card
    then:
      - should return
        - error
          - Unable to check, because this is not a PathCard
  `, async () => {
    const hasCard = checkDeckHasCard([]);

    hasCard(PathCard.CONNECTED_BOTTOM_LEFT).match(
      (ok) => expect(ok).toBe(false),
      never
    );
  });

  test(`
    given: 
      a deck
        - [CONNECTED_BOTTOM_LEFT]
      a card
        - CONNECTED_BOTTOM_LEFT
    when:
      check deck has card
    then:
      - should return
        - error
          - Unable to check, because this is not a PathCard
  `, async () => {
    const hasCard = checkDeckHasCard([PathCard.CONNECTED_BOTTOM_LEFT]);

    hasCard(PathCard.CONNECTED_BOTTOM_LEFT).match(
      (ok) => expect(ok).toBe(true),
      never
    );
  });
});
