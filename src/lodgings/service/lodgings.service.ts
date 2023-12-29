import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CloudStorageService } from "src/cloud-storage/services/cloud-storage.service";
import { LodgingImagesRepository } from "src/repositories/lodging/lodging-images.repository";
import { Address } from "src/typeorm/entities/address.entity";
import { Lodging } from "src/typeorm/entities/lodging.entity";
import { Repository } from "typeorm";
import { AddressDto } from "../dto/address.dto";
import { CreateLodgingDto } from "../dto/create-lodging.dto";
import { LodgingImages } from "src/typeorm/entities/lodging-images.entity";

@Injectable()
export class LodgingsService {
  constructor(
    @InjectRepository(Lodging) private lodgingRepository: Repository<Lodging>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(LodgingImages)
    private lodgingImagesRepository: LodgingImagesRepository,
    private readonly cloudStorageService: CloudStorageService,
  ) {}

  async createLodging(
    images: Array<Express.Multer.File>,
    lodgingDto: CreateLodgingDto,
    userId: number,
  ) {
    try {
      const lodging: Lodging = await this.saveLodging(lodgingDto, userId);
      const downloadUrls = await this.cloudStorageService.uploadFile(
        images,
        userId,
        lodging.id,
      );
      await this.storeDownloadUrls(downloadUrls, lodging.id);
      return {
        ...lodging,
        downloadUrls: downloadUrls,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async saveLodging(
    lodgingDto: CreateLodgingDto,
    userId: number,
  ): Promise<Lodging> {
    const addressId = await this.createAddressAndGetId(lodgingDto.address);
    const lodging = this.lodgingRepository.create({
      description: lodgingDto.description,
      price: lodgingDto.price,
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

  async storeDownloadUrls(urls: string[], lodgingId: number) {
    const lodgingImages = this.lodgingImagesRepository.createLodgingImages({
      lodgingId,
      downloadUrls: urls,
    });

    await this.lodgingImagesRepository.save(lodgingImages);
    return lodgingImages;
  }
}
