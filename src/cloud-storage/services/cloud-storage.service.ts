import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { initializeApp } from "firebase/app";
import { FirebaseStorage, getStorage } from "firebase/storage";

@Injectable()
export class CloudStorageService {
  private readonly storage: FirebaseStorage;

  constructor(configService: ConfigService) {
    const config = {
      apiKey: configService.get<string>("firebase.apiKey"),
      authDomain: configService.get<string>("firebase.authDomain"),
      projectId: configService.get<string>("firebase.projectId"),
      storageBucket: configService.get<string>("firebase.storageBucket"),
      messagingSenderId: configService.get<string>(
        "firebase.messagingSenderId",
      ),
      appId: configService.get<string>("firebase.appId"),
      measurementId: configService.get<string>("firebase.measurementId"),
    };

    initializeApp(config);
    this.storage = getStorage();
  }

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
