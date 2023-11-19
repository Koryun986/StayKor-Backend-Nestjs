import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import { AuthModule } from "src/auth/auth.module";
import { AuthResponse } from "src/auth/types/auth-response.type";
import * as request from "supertest";
import { correctBody } from "./utils";

export const loginTest = () =>
  describe("/auth/login (POST)", () => {
    let app: INestApplication;
    const url = "/auth/login";
    let requestWithoutBody: request.Test | undefined;
    let testRequest: request.Test | undefined;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule, AuthModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      requestWithoutBody = request(app.getHttpServer()).post(url);

      testRequest = requestWithoutBody.send({
        email: correctBody.email,
        password: correctBody.password,
      });
    });

    it("expect 201 on correct body", () => {
      return testRequest.expect(201);
    });

    it("expect correct response on correct body", () => {
      return testRequest.then(
        ({ body }: { body: AuthResponse & { password: string } }) => {
          expect(body.email).toBe(correctBody.email);
          expect(body.name).toBe(correctBody.name);
          expect(body.access_token.length).toBeGreaterThan(0);
          expect(body.password).not.toBeDefined();
        },
      );
    });

    it("expect unauthorized error on unauthorized user", async () => {
      return requestWithoutBody
        .send({
          email: "unauthorized@user.com",
          password: "wrongpassword",
        })
        .expect(401);
    });
  });
