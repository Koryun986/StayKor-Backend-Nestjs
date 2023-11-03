import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/typeorm/entities/user.entity";
import { JwtTokenService } from "src/jwt-service/service/jwt/jwt.service";
import { JwtService } from "@nestjs/jwt";
import { Token } from "src/typeorm/entities/token.entity";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtTokenService, ConfigService],
})
export class AuthModule {}
