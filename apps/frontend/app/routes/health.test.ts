import { setupServer } from "msw/node";
import { rest } from "msw";
import { loader } from "./health";

const server = setupServer(
  rest.head("http://dev.com", (_req, res, ctx) => res(ctx.status(200)))
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});
describe("health check", () => {
  test("should return a response", async () => {
    const response = await loader({
      request: new Request("http://dev.com"),
      params: {},
      context: {},
    });
    expect(response).toBeInstanceOf(Response);
  });

  test("should return a 200 status code", async () => {
    const response = await loader({
      request: new Request("http://dev.com"),
      params: {},
      context: {},
    });
    expect(response.status).toBe(200);
  });
});
