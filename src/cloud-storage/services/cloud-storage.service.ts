import { Injectable } from "@nestjs/common";
import { FirebaseCloudStorageService } from "src/firebase/firebase.service";

@Injectable()
export class CloudStorageService {
  private readonly app = this.firebaseCloudStorageService.app;

  constructor(
    private readonly firebaseCloudStorageService: FirebaseCloudStorageService,
  ) {}
}
