import { loginTest } from "./login.spec";
import { registrationTest } from "./registration.spec";

describe("Auth test", () => {
  registrationTest();
  loginTest();
});
