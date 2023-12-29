import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  TypeOrmModule,
  getDataSourceToken,
  getRepositoryToken,
} from "@nestjs/typeorm";
import { CloudStorageService } from "src/cloud-storage/services/cloud-storage.service";
import { JwtServiceModule } from "src/jwt-service/jwt-service.module";
import { Address } from "src/typeorm/entities/address.entity";
import { LodgingImages } from "src/typeorm/entities/lodging-images.entity";
import { Lodging } from "src/typeorm/entities/lodging.entity";
import { LodgingsController } from "./controller/lodgings.controller";
import { LodgingsService } from "./service/lodgings.service";
import { lodgingImagesRepository } from "src/repositories/lodging/lodging-images.repository";
import { DataSource } from "typeorm";

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
      provide: getRepositoryToken(LodgingImages),
      inject: [getDataSourceToken()],
      useFactory(datasource: DataSource) {
        return datasource
          .getRepository(LodgingImages)
          .extend(lodgingImagesRepository);
      },
    },
  ],
})
export class LodgingsModule {}
