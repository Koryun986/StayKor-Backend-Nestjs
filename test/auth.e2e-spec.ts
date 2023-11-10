import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmConfigService } from "src/typeorm/typeorm-config.service";
import { AppModule } from "src/app.module";
TypeOrmConfigService;

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

    it("expect 201 when body is correct ", async () => {
      return request(app.getHttpServer())
        .post(url)
        .send({
          name: "testUser",
          email: "testUser@example.com",
          password: "testPassword123",
        })
        .expect(201);
    });
  });
});
