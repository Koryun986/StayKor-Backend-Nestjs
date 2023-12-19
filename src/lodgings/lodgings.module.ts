import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudStorageService } from "src/cloud-storage/services/cloud-storage.service";
import { UserInterceptor } from "src/interceptors/auth/user.interceptor";
import { JwtServiceModule } from "src/jwt-service/jwt-service.module";
import { Address } from "src/typeorm/entities/address.entity";
import { LodgingImages } from "src/typeorm/entities/lodging-images.entity";
import { Lodging } from "src/typeorm/entities/lodging.entity";
import { LodgingsController } from "./controller/lodgings.controller";
import { LodgingsService } from "./service/lodgings.service";

@Module({
  imports: [
    JwtServiceModule,
    TypeOrmModule.forFeature([Lodging, Address, LodgingImages]),
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
