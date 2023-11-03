import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { add } from "date-fns";
import { JwtTokens } from "src/jwt-service/types/jwt-token.type";
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

    const accessToken = await this.jwtService.signAsync(
      { payload },
      {
        secret: this.configService.get("jwt.secret"),
      },
    );
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

  private async generateRefreshToken(payload: User) {
    const token = await this.tokenRepository.create({
      token: v4(),
      expiration: add(new Date(), { months: 1 }),
      user: payload,
    });
    await this.tokenRepository.save(token);
    return token;
  }
}
