import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { LodgingsService } from "../service/lodgings.service";
import { CreateLodgingDto } from "../dto/create-lodging.dto";

@Controller("lodgings")
export class LodgingsController {
  constructor(private lodgingsService: LodgingsService) {}

  @Post("/create")
  @UseInterceptors(FilesInterceptor("files"))
  async createLodging(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() lodgingDto: CreateLodgingDto,
  ) {}
}
