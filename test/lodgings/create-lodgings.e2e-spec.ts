import { createReadStream } from "fs";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import * as request from "supertest";
import * as streamToBlob from "stream-to-blob";
import { correctAccessToken } from "test/auth/registration.spec";
import { getFormDataFromFilePathAndObject } from "./utils";

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
    description:
      "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim",
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
    const formData = getFormDataFromFilePathAndObject(
      "./../../../assets/lodging_photo.jpg",
      correctLodgingBody,
    );
    return testRequest
      .set("Authorization", `Bearer ${correctAccessToken}`)
      .send(formData)
      .expect(201);
  });
});
