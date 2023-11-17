import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { JwtTokenService } from "src/jwt-service/service/jwt/jwt.service";
import { User } from "src/typeorm/entities/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const accessToken = this.getAccessTokenFromRequest(request);
      const user: User =
        await this.jwtTokenService.validateAccessToken(accessToken);
      return !!user;
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }

  getAccessTokenFromRequest(request: Request): string {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === "") {
      throw new UnauthorizedException("Please provide token");
    }
    const accessToken = authorization.replace(/bearer/gim, "").trim();
    return accessToken;
  }
}
