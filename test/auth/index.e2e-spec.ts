import { loginTest } from "./login.spec";
import { refreshTest } from "./refresh.spec";
import { registrationTest } from "./registration.spec";

describe("Auth test", () => {
  registrationTest();
  loginTest();
  refreshTest();
});
