import {
  createBrokenToolCommand,
  createBrokenToolHasBeenPlacedEvent,
  createBrokenToolHasBeenRemovedEvent,
  Event,
  Tool,
} from "@packages/domain";
import type { EventSource } from "~/models/event";
import checkToolHasBroken from "./check-tool-has-broken";
import { never } from "~/utils";

describe("check tool has broken", () => {
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

  test.each([Tool.Cart, Tool.Lamp, Tool.Pickaxe])(
    `
      given:
        a player1 with:
          - [%s] tool has been broken
      when:
        check tool has been broken
      then:
        - should return error
          - the player player1 tool has been broken
    `,
    async (tool) => {
      await source.append(
        createBrokenToolHasBeenPlacedEvent({ tool, playerId: "player1" })
      );

      const result = await checkToolHasBroken(
        source,
        createBrokenToolCommand({ tool, playerId: "player1" })
      );

      result.match(never, (error) =>
        expect(error).toStrictEqual(
          Error("the player player1 tool has been broken")
        )
      );
    }
  );

  test.each([Tool.Cart, Tool.Lamp, Tool.Pickaxe])(
    `
      given:
        a player1 with:
          - [%s] tool has not been broken
      when:
        check tool has been broken
      then:
        - should return BrokenToolCommand
    `,
    async (tool) => {
      const brokenToolCommand = createBrokenToolCommand({
        tool,
        playerId: "player1",
      });

      const result = await checkToolHasBroken(source, brokenToolCommand);

      result.match((command) => expect(command).toBe(brokenToolCommand), never);
    }
  );

  test(`
    given:
      an event source with:
        - broken [${Tool.Cart}] tool has been placed
        - broken [${Tool.Cart}] tool has been removed
        - broken [${Tool.Cart}] tool has been placed
      when:
        check tool has been broken
      then:
        - should return error
          - the player player1 tool has been broken
  `, async () => {
    await source.append(
      createBrokenToolHasBeenPlacedEvent({
        tool: Tool.Cart,
        playerId: "player1",
      }),
      createBrokenToolHasBeenRemovedEvent({
        tool: Tool.Cart,
        playerId: "player1",
      }),
      createBrokenToolHasBeenPlacedEvent({
        tool: Tool.Cart,
        playerId: "player1",
      })
    );

    const result = await checkToolHasBroken(
      source,
      createBrokenToolCommand({ tool: Tool.Cart, playerId: "player1" })
    );

    result.match(never, (error) =>
      expect(error).toStrictEqual(
        Error("the player player1 tool has been broken")
      )
    );
  });

  test(`
    given:
      an event source with:
        - broken [${Tool.Cart}] tool has been placed
        - broken [${Tool.Lamp}] tool has been placed
        - broken [${Tool.Pickaxe}] tool has been placed
        - broken [${Tool.Cart}] tool has been removed
        - broken [${Tool.Lamp}] tool has been removed
        - broken [${Tool.Pickaxe}] tool has been removed
      when:
        check tool has been broken
      then:
        - should return BrokenToolCommand
  `, async () => {
    await source.append(
      createBrokenToolHasBeenPlacedEvent({
        tool: Tool.Cart,
        playerId: "player1",
      }),
      createBrokenToolHasBeenPlacedEvent({
        tool: Tool.Lamp,
        playerId: "player1",
      }),
      createBrokenToolHasBeenPlacedEvent({
        tool: Tool.Pickaxe,
        playerId: "player1",
      }),
      createBrokenToolHasBeenRemovedEvent({
        tool: Tool.Cart,
        playerId: "player1",
      }),
      createBrokenToolHasBeenRemovedEvent({
        tool: Tool.Lamp,
        playerId: "player1",
      }),
      createBrokenToolHasBeenRemovedEvent({
        tool: Tool.Pickaxe,
        playerId: "player1",
      })
    );

    const brokenToolCommand = createBrokenToolCommand({
      tool: Tool.Cart,
      playerId: "player1",
    });

    const result = await checkToolHasBroken(source, brokenToolCommand);

    result.match((command) => expect(command).toBe(brokenToolCommand), never);
  });
});
