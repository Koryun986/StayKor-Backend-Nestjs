import { User } from "src/typeorm/entities/user.entity";

export type JwtVerificationResult = {
  payload: User;
};
