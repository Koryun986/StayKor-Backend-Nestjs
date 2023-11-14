import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthModule } from "src/auth/auth.module";
import { AppModule } from "src/app.module";
import { correctBody } from "./utils";
import { AuthResponse } from "src/auth/types/auth-response.type";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

describe("/auth/login (POST)", () => {
  let app: INestApplication;
  const url = "/auth/login";
  const jwtService = new JwtService();
  const configService = new ConfigService();
  let testRequest: request.Test | undefined;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const accessToken = await jwtService.signAsync(correctBody, {
      secret: configService.get<string>("jwt.secret"),
    });
    testRequest = request(app.getHttpServer())
      .post(url)
      .set({ Authorization: accessToken })
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

  it("expect bad request error when access token is expired", async () => {
    return await request(app.getHttpServer())
      .post(url)
      .set({ Authorization: "wrong.access.token" })
      .send(correctBody)
      .expect(400);
  });
});
