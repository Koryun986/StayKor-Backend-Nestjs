import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthModule } from "src/auth/auth.module";
import { AppModule } from "src/app.module";
import { AuthResponse } from "src/auth/types/auth-response.type";
import { COOKIE_REFRESH_TOKEN } from "src/auth/constants/cookie.constants";
import { SimpleTypes } from "../constants/types.enum";
import { correctBody, wrongBodiesArr } from "./utils";

let correctAccessToken: string | undefined;
export const registrationTest = () =>
  describe("/auth/registration (POST)", () => {
    let app: INestApplication;
    const url = "/auth/registration";
    let testRequest: request.Test | undefined;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule, AuthModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      testRequest = request(app.getHttpServer()).post(url).send(correctBody);
    });

    it("expect 201 when body is correct ", () => {
      return testRequest.expect(201);
    });

    it("should return correct response", () => {
      return testRequest.then(
        ({ body }: { body: AuthResponse & { password: string } }) => {
          expect(body.id.toString().length).toBeGreaterThan(0);
          expect(body.email).toBe(correctBody.email);
          expect(body.name).toBe(correctBody.name);
          expect(body.access_token.length).toBeGreaterThan(0);
          expect(body.password).not.toBeDefined();
          correctAccessToken = body.access_token;
        },
      );
    });

    it("check cookies", () => {
      return testRequest.then((response) => {
        const cookiesString: string = response.headers["set-cookie"][0];
        const cookiesObj = {};
        cookiesString.split(";").forEach((item) => {
          const cookiePairs = item.split("=");
          cookiesObj[cookiePairs[0]] = cookiePairs[1];
        });
        const refreshToken = cookiesObj[COOKIE_REFRESH_TOKEN];
        expect(refreshToken).toBeDefined();
        expect(typeof refreshToken).toBe(SimpleTypes.string);
        expect(refreshToken.toString().length).toBeGreaterThan(0);
      });
    });

    it("expect 400 status when user exists", () => {
      return request(app.getHttpServer())
        .post(url)
        .send(correctBody)
        .expect(400);
    });

    test.each(wrongBodiesArr)(
      "expect 400 on { name: $name , email: $email , password: $password } ",
      (...userDto) => {
        return request(app.getHttpServer()).post(url).send(userDto).expect(400);
      },
    );
  });

export { correctAccessToken };
