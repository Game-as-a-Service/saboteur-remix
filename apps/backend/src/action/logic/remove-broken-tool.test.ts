import { EventSource } from "~/models/event";
import {
  Event,
  Tool,
  createBrokenToolHasBeenPlacedEvent,
  createBrokenToolHasBeenRemovedEvent,
  createFixToolCommand,
} from "@packages/domain";
import { never } from "~/utils";
import removeBrokenTool from "./remove-broken-tool";

describe("remove broken tool", () => {
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
      player a have broken tool placed in front
    when:
      player b use fix tool card to player a
    then:
      the broken tool will be removed from player a
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
        removeBrokenTool(
          source,
          createFixToolCommand({
            playerId: "player-a",
            tool: Tool.Pickaxe,
          })
        )
      )
      .then((result) =>
        result.match(
          (event) =>
            expect(event).toStrictEqual(
              createBrokenToolHasBeenRemovedEvent({
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
            createBrokenToolHasBeenRemovedEvent({
              playerId: "player-a",
              tool: Tool.Pickaxe,
            }),
          ])
        )
      ));

  test(`
    given:
      player a don't have broken tool placed in front
    when:
      player b use fix tool card to player a
    then:
      can't use fix tool card to player a
  `, () =>
    Promise.resolve()
      .then(() =>
        removeBrokenTool(
          source,
          createFixToolCommand({
            playerId: "player-a",
            tool: Tool.Pickaxe,
          })
        )
      )
      .then((result) =>
        result.match(never, (error) =>
          expect(error).toStrictEqual(
            Error(`player:player-a tool:2 not broken`)
          )
        )
      ));
});
