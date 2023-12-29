import { LodgingImages } from "src/typeorm/entities/lodging-images.entity";
import { Repository } from "typeorm";

type CreateLodgingImagesDto = {
  lodgingId: number;
  downloadUrls: string[];
};

export interface LodgingImagesRepository extends Repository<LodgingImages> {
  this: Repository<LodgingImages>;
  createLodgingImages(
    createLodgingImagesDto: CreateLodgingImagesDto,
  ): LodgingImages;
}

export const lodgingImagesRepository: Pick<LodgingImagesRepository, any> = {
  stringSeparator: " ",
  createLodgingImages({ lodgingId, downloadUrls }: CreateLodgingImagesDto) {
    const downloadUrlsString = downloadUrls.join(this.stringSeparator);

    const lodgingImages = this.create({
      lodgingId,
      downloadUrls: downloadUrlsString,
    });
    return lodgingImages;
  },
};
