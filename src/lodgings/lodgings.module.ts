import { Module } from "@nestjs/common";
import { LodgingsController } from "./controller/lodgings.controller";
import { LodgingsService } from "./service/lodgings.service";
import { JwtServiceModule } from "src/jwt-service/jwt-service.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Lodging } from "src/typeorm/entities/lodging.entity";

@Module({
  imports: [JwtServiceModule, TypeOrmModule.forFeature([Lodging])],
  controllers: [LodgingsController],
  providers: [LodgingsService],
})
export class LodgingsModule {}
