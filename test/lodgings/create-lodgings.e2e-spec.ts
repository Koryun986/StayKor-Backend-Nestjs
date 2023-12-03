import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import * as request from "supertest";

describe("/lodgings/create (POST)", () => {
  let app: INestApplication;
  const url = "/lodgings/create";
  let testRequest: request.Test | undefined;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testRequest = request(app.getHttpServer()).post(url);
  });
});
