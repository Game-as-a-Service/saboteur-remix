import { randomUUID } from "crypto";
import { jest } from "@jest/globals";

describe("event-source", () => {
  const client = {
    xAdd: jest.fn(),
    xRange: jest.fn(),
    xRead: () => Promise.resolve([]),
  };

  beforeEach(() => {
    jest.resetModules();

    jest.doMock("~/io/redis", () => ({
      __esModule: true,
      default: () => Promise.resolve(client),
    }));
  });

  test(`
    given:
      an empty event source
    when:
      append event to event source
    then:
      should return event
  `, () =>
    import("./event-source")
      .then((module) => module.default("test"))
      .then((eventSource) =>
        eventSource.append({
          type: "path card has been placed",
          data: [
            {
              card: "start",
              position: [0, 0],
            },
          ],
        })
      )
      .then((event) =>
        expect(event).toStrictEqual([
          {
            type: "path card has been placed",
            data: [
              {
                card: "start",
                position: [0, 0],
              },
            ],
          },
        ])
      )
      .then(() =>
        expect(client.xAdd)
          //
          .toHaveBeenCalledWith("test", "*", {
            event: JSON.stringify({
              type: "path card has been placed",
              data: [
                {
                  card: "start",
                  position: [0, 0],
                },
              ],
            }),
          })
      ));

  test(`
    given:
      an empty event source
    when:
      read from event source
    then:
      should return empty array
  `, async () => {
    client.xRange.mockReturnValue(Promise.resolve([]));
    return import("./event-source")
      .then((module) => module.default("test"))
      .then((eventSource) => eventSource.read())
      .then((events) => expect(events).toStrictEqual([]));
  });

  test(`
    given:
      an event source with one event
    when:
      read from event source
    then:
      should return array with one event
  `, async () => {
    client.xRange.mockReturnValue(
      Promise.resolve([
        {
          id: randomUUID(),
          message: {
            event: JSON.stringify({
              type: "path card has been placed",
              data: [
                {
                  card: "start",
                  position: [0, 0],
                },
              ],
            }),
          },
        },
      ])
    );

    return import("./event-source")
      .then((module) => module.default("test"))
      .then((eventSource) => eventSource.read())
      .then((events) =>
        expect(events).toStrictEqual([
          {
            type: "path card has been placed",
            data: [
              {
                card: "start",
                position: [0, 0],
              },
            ],
          },
        ])
      );
  });
});
