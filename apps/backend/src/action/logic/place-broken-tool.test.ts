import { EventSource } from "~/models/event";
import {
  Event,
  Tool,
  createBrokenToolCommand,
  createBrokenToolHasBeenPlacedEvent,
} from "@packages/domain";
import { placeBrokenTool } from "./place-broken-tool";
import { never } from "~/utils";

describe("place broken tool", () => {
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
      player a dont have broken tool placed in front
    when:
      player b use broken tool card to player a
    then:
      player a have broken tool placed in front
  `, () =>
    Promise.resolve()
      .then(() =>
        placeBrokenTool(
          source,
          createBrokenToolCommand({
            playerId: "player-a",
            tool: Tool.Pickaxe,
          })
        )
      )
      .then((result) =>
        result.match(
          (event) =>
            expect(event).toStrictEqual(
              createBrokenToolHasBeenPlacedEvent({
                playerId: "player-a",
                tool: Tool.Pickaxe,
              })
            ),
          never
        )
      )
      .then(() =>
        source.read().then((events) =>
          expect(events).toStrictEqual([
            createBrokenToolHasBeenPlacedEvent({
              playerId: "player-a",
              tool: Tool.Pickaxe,
            }),
          ])
        )
      ));

  test(`
    given:
      player a have broken tool placed in front
    when:
      player b use broken tool card to player a
    then:
      can not place broken tool to player a
  `, () =>
    Promise.resolve()
      .then(() =>
        source.append(
          createBrokenToolHasBeenPlacedEvent({
            playerId: "player-a",
            tool: Tool.Pickaxe,
          })
        )
      )
      .then(() =>
        placeBrokenTool(
          source,
          createBrokenToolCommand({
            playerId: "player-a",
            tool: Tool.Pickaxe,
          })
        )
      )
      .then((result) =>
        result.match(never, (error) =>
          expect(error).toStrictEqual(
            Error(`player:player-a tool:2 already broken`)
          )
        )
      ));
});
