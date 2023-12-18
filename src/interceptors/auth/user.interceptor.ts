import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtTokenService } from "src/jwt-service/service/jwt/jwt.service";
import { AuthUtils } from "src/utils/auth/auth.utils";

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly jwtTokenService: JwtTokenService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const accessToken = AuthUtils.getAccessTokenFromRequest(request);

    if (accessToken) {
      const user = this.jwtTokenService.validateAccessToken(accessToken);
      request.user = user;
    }

    return next.handle();
  }
}
