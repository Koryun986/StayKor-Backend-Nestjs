import { UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

export class AuthUtils {
  static getAccessTokenFromRequest(request: Request): string {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === "") {
      throw new UnauthorizedException("Please provide token");
    }
    const accessToken = authorization.replace(/bearer/gim, "").trim();
    return accessToken;
  }
}
