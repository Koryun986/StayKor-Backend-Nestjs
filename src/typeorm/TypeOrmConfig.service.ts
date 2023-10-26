import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

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
      synchronize: true,
    };
  }
}
