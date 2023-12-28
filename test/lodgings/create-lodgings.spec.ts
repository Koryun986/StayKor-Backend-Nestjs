import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import * as request from "supertest";
import { correctAccessToken } from "test/auth/registration.spec";
import {
  getFormDataFromFilePathAndObject,
  getFormDataFromObject,
} from "./utils";

export const createLodgingTest = () =>
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

    it("expect 201 status when everything is correct", async () => {
      const formData = await getFormDataFromFilePathAndObject(
        "https://via.placeholder.com/600/92c952",
        correctLodgingBody,
      );

      return testRequest
        .set("Authorization", `Bearer ${correctAccessToken}`)
        .send(formData)
        .expect(201);
    });

    it("expect unauthorized error when access token is invalid", () => {
      const formData = getFormDataFromFilePathAndObject(
        "https://via.placeholder.com/600/92c952",
        correctLodgingBody,
      );
      return testRequest.send(formData).expect(401);
    });

    it("expect badrequest error when images are not passed", () => {
      const formData = getFormDataFromObject(correctLodgingBody);
      return testRequest.send(formData).expect(400);
    });
  });
