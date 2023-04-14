import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "~/health/health.controller";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("should be defined", () => expect(controller).toBeDefined());

  it("should return a health check", () =>
    expect(controller.check()).toBe("ok"));
});
