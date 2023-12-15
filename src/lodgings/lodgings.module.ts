import { Module } from "@nestjs/common";
import { LodgingsController } from "./controller/lodgings.controller";
import { LodgingsService } from "./service/lodgings.service";
import { JwtServiceModule } from "src/jwt-service/jwt-service.module";

@Module({
  imports: [JwtServiceModule],
  controllers: [LodgingsController],
  providers: [LodgingsService],
})
export class LodgingsModule {}
