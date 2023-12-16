import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { initializeApp } from "firebase-admin";

@Injectable()
export class CloudStorageService {
  private readonly _config = {
    apiKey: this.configService.get<string>("firebase.apiKey"),
    authDomain: this.configService.get<string>("firebase.authDomain"),
    projectId: this.configService.get<string>("firebase.projectId"),
    storageBucket: this.configService.get<string>("firebase.storageBucket"),
    messagingSenderId: this.configService.get<string>(
      "firebase.messagingSenderId",
    ),
    appId: this.configService.get<string>("firebase.appId"),
    measurementId: this.configService.get<string>("firebase.measurementId"),
  };
  readonly app = initializeApp(this._config);

  constructor(private readonly configService: ConfigService) {}
}
