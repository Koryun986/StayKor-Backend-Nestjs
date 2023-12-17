import { Module } from "@nestjs/common";
import { CloudStorageService } from "./services/cloud-storage.service";

@Module({
  providers: [CloudStorageService],
})
export class CloudStorageModule {}
