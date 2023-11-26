import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { COOKIE_REFRESH_TOKEN } from "src/auth/constants/cookie.constants";

export class AuthUtils {
  static getAccessTokenFromRequest(request: Request): string {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === "") {
      throw new UnauthorizedException("Please provide token");
    }
    const accessToken = authorization.replace(/bearer/gim, "").trim();
    return accessToken;
  }

  static getRefreshTokenFromRequest(request: Request): string {
    const cookies = request.cookies;

    const refreshToken = cookies[COOKIE_REFRESH_TOKEN];
    if (!refreshToken)
      throw new BadRequestException("Please login to your account");

    return refreshToken;
  }
}
