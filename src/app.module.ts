import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import configuration from "config/configuration";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmConfigService } from "./typeorm/typeorm-config.service";
import { JwtServiceModule } from "./jwt-service/jwt-service.module";
import { LodgingsModule } from './lodgings/lodgings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env", ".database.env", ".jwt.env"],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    JwtServiceModule,
    LodgingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
