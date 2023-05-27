import { Tool, createBrokenToolCommand } from "@packages/domain";
import checkToolHasBroken from "./check-tool-has-broken";
import { never } from "~/utils";

describe("check tool has broken", () => {
  test.each([Tool.Cart, Tool.Lamp, Tool.Pickaxe])(
    `
      given:
        a player with:
          - [%s] tool has been broken
      when:
        check tool has been broken
      then:
        - should return error
          - the player player1 tool has been broken
    `,
    (tool) => {
      const check = checkToolHasBroken(
        createBrokenToolCommand({ tool, playerId: "player1" })
      );

      check([tool]).match(never, (error) =>
        expect(error).toStrictEqual(
          Error("the player player1 tool has been broken")
        )
      );
    }
  );
});
