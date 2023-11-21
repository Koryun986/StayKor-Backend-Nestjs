import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { AuthModule } from "src/auth/auth.module";
import * as request from "supertest";
import { correctRefreshToken } from "./registration.spec";

export const refreshTest = describe("/auth/refresh (GET)", () => {
  const COOKIE = "Cookie";
  let app: INestApplication;
  const url = "/auth/registration";
  let testRequest: request.Test | undefined;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    testRequest = request(app.getHttpServer()).get(url);
  });

  it("should return 200 when all is correct", () => {
    return testRequest.set(COOKIE, correctRefreshToken).send().expect(200);
  });
});
