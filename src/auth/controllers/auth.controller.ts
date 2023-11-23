import {
  Body,
  Controller,
  Post,
  UsePipes,
  Res,
  UseGuards,
  Get,
} from "@nestjs/common";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { AuthService } from "../services/auth.service";
import { createUserSchema, CreateUserDto } from "../dto/create-user.dto";
import { AuthResponse } from "../types/auth-response.type";
import { Response, CookieOptions } from "express";
import { ConfigService } from "@nestjs/config";
import { COOKIE_REFRESH_TOKEN } from "../constants/cookie.constants";
import { UserDto, userSchema } from "../dto/user.dto";
import { AuthGuard } from "src/guards/auth/auth.guard";

@Controller("auth")
export class AuthController {
  private cookieConfig: CookieOptions = {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post("registration")
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async registrateUser(
    @Body() userDto: CreateUserDto,
    @Res() resposne: Response,
  ) {
    const user = await this.authService.registrateUser(userDto);
    resposne.cookie(
      COOKIE_REFRESH_TOKEN,
      user.refreshToken.token,
      this.cookieConfig,
    );

    resposne.json({
      id: user.id,
      email: user.email,
      name: user.name,
      access_token: user.accessToken,
    });
  }

  @Post("login")
  @UsePipes(new ZodValidationPipe(userSchema))
  async loginUser(@Body() userDto: UserDto, @Res() resposne: Response) {
    const user = await this.authService.loginUser(userDto);
    resposne.cookie(
      COOKIE_REFRESH_TOKEN,
      user.refreshToken.token,
      this.cookieConfig,
    );

    resposne.json({
      id: user.id,
      email: user.email,
      name: user.name,
      access_token: user.accessToken,
    });
  }

  @Get("refresh")
  async updateTokens(@Res() response: Response) {}
}
