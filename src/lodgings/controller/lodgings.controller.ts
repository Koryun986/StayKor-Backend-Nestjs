import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Res,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { LodgingsService } from "../service/lodgings.service";
import { CreateLodgingDto } from "../dto/create-lodging.dto";
import { AuthGuard } from "src/guards/auth/auth.guard";
import { UserInterceptor } from "src/interceptors/auth/user.interceptor";

@Controller("lodgings")
export class LodgingsController {
  constructor(private lodgingsService: LodgingsService) {}

  @Post("/create")
  @UseInterceptors(FilesInterceptor("files"))
  @UserInterceptor(UserInterceptor)
  @UseGuards(AuthGuard)
  async createLodging(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() lodgingDto: CreateLodgingDto,
    @Res() resposne: Response,
  ) {}
}
