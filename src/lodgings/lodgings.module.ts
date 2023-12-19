import { APP_INTERCEPTOR } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtServiceModule } from "src/jwt-service/jwt-service.module";
import { Lodging } from "src/typeorm/entities/lodging.entity";
import { Address } from "src/typeorm/entities/address.entity";
import { LodgingsController } from "./controller/lodgings.controller";
import { LodgingsService } from "./service/lodgings.service";
import { UserInterceptor } from "src/interceptors/auth/user.interceptor";
import { CloudStorageModule } from "src/cloud-storage/cloud-storage.module";
import { CloudStorageService } from "src/cloud-storage/services/cloud-storage.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    JwtServiceModule,
    TypeOrmModule.forFeature([Lodging, Address]),
    CloudStorageModule,
  ],
  controllers: [LodgingsController],
  providers: [
    LodgingsService,
    CloudStorageService,
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
  ],
})
export class LodgingsModule {}
