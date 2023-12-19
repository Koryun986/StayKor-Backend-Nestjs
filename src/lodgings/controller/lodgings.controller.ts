import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Res,
  UsePipes,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { LodgingsService } from "../service/lodgings.service";
import {
  CreateLodgingDto,
  createLodgingSchema,
} from "../dto/create-lodging.dto";
import { AuthGuard } from "src/guards/auth/auth.guard";
import { UserInterceptor } from "src/interceptors/auth/user.interceptor";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";

@Controller("lodgings")
export class LodgingsController {
  constructor(private lodgingsService: LodgingsService) {}

  @Post("/create")
  @UseInterceptors(FilesInterceptor("files"))
  @UseInterceptors(UserInterceptor)
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createLodgingSchema))
  async createLodging(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() lodgingDto: CreateLodgingDto,
    @Res() resposne: Response,
  ) {}
}
