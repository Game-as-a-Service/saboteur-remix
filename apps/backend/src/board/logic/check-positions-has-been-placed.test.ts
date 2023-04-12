import type { EventSource } from "~/models/event";

describe("check positions has been placed", () => {
  let source: EventSource;

  beforeEach(() => {
    let store: unknown[] = [];
    const append = jest.fn().mockImplementation((...args: unknown[]) => {
      store = store.concat(...args);
      return Promise.resolve(args);
    });
    const read = jest.fn().mockImplementation(() => {
      return Promise.resolve(store);
    });
    source = { append, read };
  });

  test.todo(`
      given:
      when:
      expect:
    `);
});
