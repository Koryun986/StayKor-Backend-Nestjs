import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { initializeApp } from "firebase/app";
import {
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

@Injectable()
export class CloudStorageService {
  private readonly storage: FirebaseStorage;

  constructor(private configService: ConfigService) {
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
  ): Promise<string[]> {
    try {
      const coreFolderName = this.configService.get<string>(
        "firebase.storageLodgingFolder",
      );
      const folderName = `${coreFolderName}/user_${userId}/lodging_${lodgingId}`;
      const downloadUrls: string[] = [];
      files.forEach(async ({ buffer, originalname, mimetype }) => {
        const filePath = `${folderName}/${Date.now()}_${originalname}`;
        const storageRef = ref(this.storage, filePath);
        const snapshot = await uploadBytesResumable(storageRef, buffer, {
          contentType: mimetype,
        });
        const downloadUrl = await getDownloadURL(snapshot.ref);
        downloadUrls.push(downloadUrl);
      });
      return downloadUrls;
    } catch (e) {
      throw new Error("Can't upload files to Firebase Cloud Storage");
    }
  }
}
