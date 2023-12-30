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
  private readonly LODGING_IMAGES_CORE_FOLDER: string;

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

    this.LODGING_IMAGES_CORE_FOLDER = configService.get<string>(
      "firebase.storageLodgingFolder",
    );

    initializeApp(config);
    this.storage = getStorage();
  }

  async uploadFile(
    files: Array<Express.Multer.File>,
    userId: number,
    lodgingId: number,
  ): Promise<string[]> {
    try {
      const folderName = `${this.LODGING_IMAGES_CORE_FOLDER}/user_${userId}/lodging_${lodgingId}`;
      const downloadUrls = await this.uploadFilesToBucket(files, folderName);
      return downloadUrls;
    } catch (e) {
      throw new Error("Can't upload files to Firebase Cloud Storage");
    }
  }

  private async uploadFilesToBucket(
    files: Array<Express.Multer.File>,
    bucketName: string,
  ) {
    const downloadUrls: string[] = [];

    await Promise.all(
      files.map(async ({ buffer, originalname, mimetype }) => {
        const filePath = `${bucketName}/${Date.now()}_${originalname}`;
        const storageRef = ref(this.storage, filePath);
        const snapshot = await uploadBytesResumable(storageRef, buffer, {
          contentType: mimetype,
        });

        const downloadUrl = await getDownloadURL(snapshot.ref);

        downloadUrls.push(downloadUrl);
      }),
    );

    return downloadUrls;
  }
}
