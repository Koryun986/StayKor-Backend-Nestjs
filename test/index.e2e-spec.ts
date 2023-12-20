import { AuthTest } from "./auth/index.spec";
import { LodgingTests } from "./lodgings/index.spec";

describe("E2E tests", () => {
  AuthTest();
  LodgingTests();
});
