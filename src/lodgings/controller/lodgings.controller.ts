import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/guards/auth/auth.guard";
import { UserInterceptor } from "src/interceptors/auth/user.interceptor";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { User } from "src/typeorm/entities/user.entity";
import {
  CreateLodgingDto,
  createLodgingSchema,
} from "../dto/create-lodging.dto";
import { LodgingsService } from "../service/lodgings.service";

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
    @Req() request: Request,
  ) {
    const user: User = (request as any).user;
    const data = await this.lodgingsService.createLodging(
      files,
      lodgingDto,
      user.id,
    );
    return data;
  }
}
