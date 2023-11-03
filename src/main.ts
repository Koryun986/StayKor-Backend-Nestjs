import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({
    credentials: true,
    origin: configService.get<string>("frontendUrl"),
  });
  app.use(cookieParser());
  console.log("Server Start: " + configService.get<number>("port"));

  await app.listen(configService.get<number>("port"));
}
bootstrap();
