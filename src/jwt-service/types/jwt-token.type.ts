import { Token } from "src/typeorm/entities/token.entity";

export type JwtTokens = {
  accessToken: string;
  refreshToken: Token;
};
