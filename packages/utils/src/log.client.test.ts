import { vi, test, expect, describe } from "vitest";
import type * as log from "./log.client";

describe("log", () => {
  let logger: typeof log;

  beforeAll(async () => {
    console.debug = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();

    logger = await vi.importActual<typeof log>("./log.client");
  });

  test("info", async () => {
    logger.info`hello world`;
    expect(console.info).toHaveBeenCalledWith("hello world");

    logger.info(["hello", "world"]);
    expect(console.info).toHaveBeenCalledWith("hello", "world");
  });

  test("debug", () => {
    logger.debug`hello world`;
    expect(console.debug).toHaveBeenCalledWith("hello world");

    logger.debug(["hello", "world"]);
    expect(console.debug).toHaveBeenCalledWith("hello", "world");
  });

  test("warn", () => {
    logger.warn`hello world`;
    expect(console.warn).toHaveBeenCalledWith("hello world");

    logger.warn(["hello", "world"]);
    expect(console.warn).toHaveBeenCalledWith("hello", "world");
  });

  test("error", () => {
    logger.error`hello world`;
    expect(console.error).toHaveBeenCalledWith("hello world");

    logger.error(["hello", "world"]);
    expect(console.error).toHaveBeenCalledWith("hello", "world");
  });
});
