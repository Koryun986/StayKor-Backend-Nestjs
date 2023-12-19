import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CloudStorageService } from "src/cloud-storage/services/cloud-storage.service";
import { Address } from "src/typeorm/entities/address.entity";
import { Lodging } from "src/typeorm/entities/lodging.entity";
import { Repository } from "typeorm";
import { AddressDto } from "../dto/address.dto";
import { CreateLodgingDto } from "../dto/create-lodging.dto";

@Injectable()
export class LodgingsService {
  constructor(
    @InjectRepository(Lodging) private lodgingRepository: Repository<Lodging>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    private readonly cloudStorageService: CloudStorageService,
  ) {}

  async createLodging(
    images: Array<Express.Multer.File>,
    lodgingDto: CreateLodgingDto,
    userId: number,
  ) {
    const lodging: Lodging = await this.saveLodging(lodgingDto, userId);
  }

  async saveLodging(
    lodgingDto: CreateLodgingDto,
    userId: number,
  ): Promise<Lodging> {
    const addressId = await this.createAddressAndGetId(lodgingDto.address);
    const lodging = this.lodgingRepository.create({
      description: lodgingDto.description,
      addressId,
      userId,
    });

    await this.lodgingRepository.save(lodging);
    return lodging;
  }

  async createAddressAndGetId(addressDto: AddressDto): Promise<number> {
    const address: Address = this.addressRepository.create({
      city: addressDto.city,
      country: addressDto.country,
      address: addressDto.address,
    });
    await this.addressRepository.save(address);
    return address.id;
  }
}
