import { Module } from "@nestjs/common";
import { LodgingsController } from "./controller/lodgings.controller";
import { LodgingsService } from "./service/lodgings.service";

@Module({
  controllers: [LodgingsController],
  providers: [LodgingsService],
})
export class LodgingsModule {}
