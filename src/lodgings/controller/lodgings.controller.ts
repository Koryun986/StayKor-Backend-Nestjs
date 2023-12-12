import { Controller, Post, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { LodgingsService } from "../service/lodgings.service";

@Controller("lodgings")
export class LodgingsController {
  constructor(private lodgingsService: LodgingsService) {}

  @Post("/create")
  @UseInterceptors(FilesInterceptor("files"))
  async createLodging() {}
}
