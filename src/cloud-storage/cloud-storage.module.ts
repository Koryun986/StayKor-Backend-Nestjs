import { Module } from "@nestjs/common";
import { CloudStorageService } from "./services/cloud-storage.service";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [CloudStorageService, ConfigService],
})
export class CloudStorageModule {}
