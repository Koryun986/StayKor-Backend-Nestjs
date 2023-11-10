import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthModule } from "src/auth/auth.module";
import { AppModule } from "src/app.module";

describe("AuthController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("/auth/registration (POST)", () => {
    const url = "/auth/registration";
    const correctBody = {
      name: "testUser",
      email: "testUser@example.com",
      password: "testPassword123",
    };
    let testRequest: request.Test | undefined;

    beforeAll(async () => {
      testRequest = request(app.getHttpServer()).post(url).send(correctBody);
    });

    it("expect 201 when body is correct ", () => {
      return testRequest.expect(201);
    });

    it("return correct response", () => {
      return testRequest.then(({ body }) => {
        expect(body.id.length).toBeGreaterThan(0);
        expect(body.email).toBe(correctBody.email);
        expect(body.name).toBe(correctBody.name);
        expect(body.access_token.length).toBeGreaterThan(0);
      });
    });
  });
});
