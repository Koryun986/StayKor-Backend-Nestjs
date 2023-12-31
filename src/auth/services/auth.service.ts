import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../../typeorm/entities/user.entity";
import { DataSource, EntityManager, Repository } from "typeorm";
import { CreateUserDto } from "src/auth/dto/create-user.dto";
import { JwtTokenService } from "src/jwt-service/service/jwt/jwt.service";
import { JwtTokens } from "src/jwt-service/types/jwt-token.type";
import { UserDto } from "../dto/user.dto";
import { Token } from "src/typeorm/entities/token.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly dataSource: DataSource,
    private readonly jwtTokenServcie: JwtTokenService,
  ) {}

  async registrateUser(userDto: CreateUserDto): Promise<User & JwtTokens> {
    await this.validateUserIfExist(userDto);

    const user = await this.createUser(userDto);
    const { accessToken, refreshToken } =
      await this.jwtTokenServcie.generateTokens(user);
    await this.saveUserAndRefreshToken(user, refreshToken);
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
      throw new UnauthorizedException("User not found");
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
    console.log("userId", user.id);

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

  async saveUserAndRefreshToken(user: User, refreshToken: Token) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedUser = await queryRunner.manager.save(user);
      refreshToken.userId = savedUser.id;
      await queryRunner.manager.save(refreshToken);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
