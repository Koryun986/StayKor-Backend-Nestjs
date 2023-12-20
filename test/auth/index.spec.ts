import { loginTest } from "./login.spec";
import { registrationTest } from "./registration.spec";

export const AuthTest = () =>
  describe("Auth test", () => {
    registrationTest();
    loginTest();
  });
