import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { AuthService } from "../services/auth.service";
import { createUserSchema, CreateUserDto } from "../dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("registration")
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async registrateUser(@Body() userDto: CreateUserDto) {}

  @Post("login")
  async loginUser(@Body() userDto: CreateUserDto) {}
}
