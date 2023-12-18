import { Injectable } from "@nestjs/common";
import { CreateLodgingDto } from "../dto/create-lodging.dto";
import { Repository } from "typeorm";
import { Lodging } from "src/typeorm/entities/lodging.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class LodgingsService {
  constructor(
    @InjectRepository(Lodging) private lodgingRepository: Repository<Lodging>,
  ) {}

  async createLodging(
    images: Array<Express.Multer.File>,
    lodgingDto: CreateLodgingDto,
  ) {}
}
