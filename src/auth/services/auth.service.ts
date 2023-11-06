import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { User } from "src/typeorm/entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { JwtTokenService } from "src/jwt-service/service/jwt/jwt.service";
import { JwtTokens } from "src/jwt-service/types/jwt-token.type";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtTokenServcie: JwtTokenService,
  ) {}

  async registrateUser(userDto: CreateUserDto): Promise<User & JwtTokens> {
    await this.validateUserIfExist(userDto);
    const user = await this.createUser(userDto);
    const { accessToken, refreshToken } =
      await this.jwtTokenServcie.generateToken(user);
    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  private async validateUserIfExist(userDto: CreateUserDto) {
    const userExist = await this.userRepository.findOneBy({
      email: userDto.email,
    });
    if (userExist) {
      throw new BadRequestException("User already exists");
    }
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 3);
    const user = await this.userRepository.create({
      name: userDto.name,
      email: userDto.email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return user;
  }
}
