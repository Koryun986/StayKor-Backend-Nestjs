import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthModule } from "src/auth/auth.module";
import { AppModule } from "src/app.module";
import { correctBody } from "./utils";
import { AuthResponse } from "src/auth/types/auth-response.type";

describe("/auth/login (POST)", () => {
  let app: INestApplication;
  const url = "/auth/login";
  let testRequest: request.Test | undefined;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    testRequest = request(app.getHttpServer())
      .post(url)
      .send({ email: correctBody.email, password: correctBody.password });
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
});
