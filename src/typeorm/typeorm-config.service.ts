import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Token } from "./entities/token.entity";
import { Lodging } from "./entities/lodging.entity";
import { Address } from "./entities/address.entity";
import { LodgingImages } from "./entities/lodging-images.entity";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "mysql",
      host: this.configService.get("database.host"),
      port: this.configService.get("database.port"),
      username: this.configService.get("database.user"),
      password: this.configService.get<string>("database.password"),
      database: this.configService.get("database.name"),
      entities: [User, Token, Lodging, Address, LodgingImages],
      synchronize: this.configService.get<string>("env") !== "production",
    };
  }
}
