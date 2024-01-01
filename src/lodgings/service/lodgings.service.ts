import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CloudStorageService } from "src/cloud-storage/services/cloud-storage.service";
import { LodgingImagesRepository } from "src/repositories/lodging/lodging-images.repository";
import { Address } from "src/typeorm/entities/address.entity";
import { LodgingImages } from "src/typeorm/entities/lodging-images.entity";
import { Lodging } from "src/typeorm/entities/lodging.entity";
import { DataSource, Repository } from "typeorm";
import { AddressDto } from "../dto/address.dto";
import { CreateLodgingDto } from "../dto/create-lodging.dto";

@Injectable()
export class LodgingsService {
  constructor(
    @InjectRepository(Lodging) private lodgingRepository: Repository<Lodging>,
    @InjectRepository(Address) private addressRepository: Repository<Address>,
    @InjectRepository(LodgingImages)
    private lodgingImagesRepository: LodgingImagesRepository,
    private readonly dataSource: DataSource,
    private readonly cloudStorageService: CloudStorageService,
  ) {}

  async createLodging(
    images: Array<Express.Multer.File>,
    lodgingDto: CreateLodgingDto,
    userId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const address = this.createAddress(lodgingDto.address);
      const savedAddress = await queryRunner.manager.save(address);

      const lodging: Lodging = this.createLodgingEntity(
        lodgingDto,
        userId,
        savedAddress.id,
      );
      const savedLodging = await queryRunner.manager.save(lodging);
      const downloadUrls = await this.cloudStorageService.uploadFile(
        images,
        userId,
        savedLodging.id,
      );
      const lodgingImages = this.createLodgingImages(downloadUrls, lodging.id);
      await queryRunner.manager.save(lodgingImages);

      await queryRunner.commitTransaction();

      return {
        ...lodging,
        downloadUrls: downloadUrls,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  createLodgingEntity(
    lodgingDto: CreateLodgingDto,
    userId: number,
    addressId: number,
  ): Lodging {
    const lodging = this.lodgingRepository.create({
      description: lodgingDto.description,
      price: lodgingDto.price,
      addressId,
      userId,
    });

    return lodging;
  }

  createAddress(addressDto: AddressDto) {
    const address: Address = this.addressRepository.create({
      city: addressDto.city,
      country: addressDto.country,
      address: addressDto.address,
    });

    return address;
  }

  createLodgingImages(urls: string[], lodgingId: number) {
    const lodgingImages = this.lodgingImagesRepository.createLodgingImages({
      lodgingId,
      downloadUrls: urls,
    });

    return lodgingImages;
  }
}
