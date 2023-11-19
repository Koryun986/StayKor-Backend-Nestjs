import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { add, isFuture, isPast } from "date-fns";
import { JwtTokens } from "src/jwt-service/types/jwt-token.type";
import { JwtVerificationResult } from "src/jwt-service/types/jwt-verication.type";
import { Token } from "src/typeorm/entities/token.entity";
import { User } from "src/typeorm/entities/user.entity";
import { Repository } from "typeorm";
import { v4 } from "uuid";

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: User): Promise<JwtTokens> {
    console.log(payload);

    const accessToken = await this.gnenerateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    console.log({
      accessToken,
      refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async gnenerateAccessToken(payload: User) {
    return await this.jwtService.signAsync(
      { payload },
      {
        secret: this.configService.get("jwt.secret"),
      },
    );
  }

  async validateRefreshToken(payload: User) {
    const token = await this.getRefreshTokenFromUser(payload);
    if (isPast(Date.parse(token.expiration.toString()))) {
      token.expiration = this.createExpiration();
    }
    await this.tokenRepository.save(token);
    return token;
  }

  async getRefreshTokenFromUser(user: User): Promise<Token> {
    return await this.tokenRepository.findOneBy({
      user: user,
    });
  }

  async isValideRefreshToken(token: Token): Promise<boolean> {
    return isFuture(token.expiration);
  }

  async validateAccessToken(token: string): Promise<User> {
    const data: JwtVerificationResult = await this.jwtService.verifyAsync(
      token,
      {
        secret: this.configService.get("jwt.secret"),
      },
    );
    return data.payload;
  }

  private async generateRefreshToken(payload: User) {
    const token = this.tokenRepository.create({
      token: v4(),
      expiration: this.createExpiration(),
      user: payload,
    });
    await this.tokenRepository.save(token);
    return token;
  }

  private createExpiration() {
    return add(new Date(), { months: 1 });
  }
}
