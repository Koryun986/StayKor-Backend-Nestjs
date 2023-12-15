import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { JwtTokenService } from "src/jwt-service/service/jwt/jwt.service";
import { User } from "src/typeorm/entities/user.entity";
import { AuthUtils } from "src/utils/auth/auth.utils";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const accessToken = AuthUtils.getAccessTokenFromRequest(request);
      const user: User =
        await this.jwtTokenService.validateAccessToken(accessToken);
      return !!user;
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
