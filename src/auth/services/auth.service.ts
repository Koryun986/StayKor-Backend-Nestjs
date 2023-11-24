import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../../typeorm/entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "src/auth/dto/create-user.dto";
import { JwtTokenService } from "src/jwt-service/service/jwt/jwt.service";
import { JwtTokens } from "src/jwt-service/types/jwt-token.type";
import { UserDto } from "../dto/user.dto";

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

  async loginUser(userDto: UserDto): Promise<User & JwtTokens> {
    const user = await this.userRepository.findOneBy({
      email: userDto.email,
    });
    if (!user) {
      throw new UnauthorizedException("User not fount");
    }
    await this.comparePasswordWithHashedPassword(
      userDto.password,
      user.password,
    );
    const refreshToken = await this.jwtTokenServcie.validateRefreshToken(user);
    const accessToken = await this.jwtTokenServcie.gnenerateAccessToken(user);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async updateTokens(accessToken: string, refreshToken: string) {
    const user = await this.jwtTokenServcie.isTokensBelongsToOneUser(
      accessToken,
      refreshToken,
    );
    if (await this.isUsersRefreshTokenExpires(user))
      throw new BadRequestException("Please login to your account");

    const newAccessToken =
      await this.jwtTokenServcie.gnenerateAccessToken(user);
    return newAccessToken;
  }

  async isUsersRefreshTokenExpires(user: User) {
    const token = await this.jwtTokenServcie.getRefreshTokenFromUser(user);
    const isValid = await this.jwtTokenServcie.isValideRefreshToken(token);
    return !isValid;
  }

  async validateUserIfExist(userDto: CreateUserDto) {
    const userExist = await this.userRepository.findOneBy({
      email: userDto.email,
    });
    if (userExist) {
      throw new BadRequestException("User already exists");
    }
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(userDto.password);
    const user = this.userRepository.create({
      name: userDto.name,
      email: userDto.email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 3);
  }

  async comparePasswordWithHashedPassword(
    comparedPassword: string,
    hashedPassword: string,
  ) {
    const hashedComparedPassword = await this.hashPassword(comparedPassword);
    bcrypt.compare(hashedComparedPassword, hashedPassword, (err) => {
      if (err) throw new BadRequestException("Email or Password is incorrect");
    });
  }
}
