import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { AuthModule } from "src/auth/auth.module";
import * as request from "supertest";
import { correctRefreshToken } from "./registration.spec";
import { COOKIE_REFRESH_TOKEN } from "src/auth/constants/cookie.constants";

export const refreshTest = () =>
  describe("/auth/refresh (GET)", () => {
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

    it("expect new refresh token when all is correct", () => {
      return testRequest
        .set(COOKIE, correctRefreshToken)
        .send()
        .then((response) => {
          const cookiesString: string = response.headers["set-cookie"][0];
          const cookiesObj = {};
          cookiesString.split(";").forEach((item) => {
            const cookiePairs = item.split("=");
            cookiesObj[cookiePairs[0]] = cookiePairs[1];
          });
          const newRefreshToken = cookiesObj[COOKIE_REFRESH_TOKEN];
          expect(newRefreshToken).not.toBe(correctRefreshToken);
        });
    });

    it("should return 400 when cookie is not defined", () => {
      return testRequest.send().expect(400);
    });
  });
