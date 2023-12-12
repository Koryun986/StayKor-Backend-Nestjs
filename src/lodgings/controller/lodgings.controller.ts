import { Controller } from "@nestjs/common";
import { LodgingsService } from "../service/lodgings.service";

@Controller("lodgings")
export class LodgingsController {
  constructor(private lodgingsService: LodgingsService) {}
}
