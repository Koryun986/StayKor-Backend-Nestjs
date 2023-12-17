import { Injectable } from "@nestjs/common";
import { FirebaseCloudStorageService } from "src/firebase/firebase.service";

@Injectable()
export class CloudStorageService {
  private readonly app = this.firebaseCloudStorageService.app;
  private readonly storage = this.app.storage().bucket();

  constructor(
    private readonly firebaseCloudStorageService: FirebaseCloudStorageService,
  ) {}

  async uploadFile(
    files: Array<Express.Multer.File>,
    userId: number,
    lodgingId: number,
  ) {
    try {
      const folderName = `user_${userId}/lodging_${lodgingId}`;
      files.forEach(async ({ buffer, originalname, mimetype }) => {
        const filePath = `${folderName}/${Date.now()}_${originalname}`;
        await this.storage.file(filePath).save(buffer, {
          metadata: {
            contentType: mimetype,
          },
        });
      });
    } catch (e) {
      throw new Error("Can't upload files to Firebase Cloud Storage");
    }
  }
}
