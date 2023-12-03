import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import * as request from "supertest";
import { correctAccessToken } from "test/auth/registration.spec";

describe("/lodgings/create (POST)", () => {
  let app: INestApplication;
  const url = "/lodgings/create";
  let testRequest: request.Test | undefined;
  const correctLodgingBody = {
    price: "200",
    address: {
      country: "USA",
      city: "LA",
      address: "somewhere house 2",
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testRequest = request(app.getHttpServer()).post(url);
  });

  it("expect 201 status when everything is correct", () => {
    return testRequest
      .set("Authorization", `Bearer ${correctAccessToken}`)
      .attach("lodging photo", "../../../assets/lodging_photo.jpg")
      .send(correctLodgingBody)
      .expect(201);
  });
});
