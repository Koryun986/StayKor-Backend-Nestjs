import { createReadStream } from "fs";
import * as streamToBlob from "stream-to-blob";

export function getFormDataFromFilePathAndObject(filePath: string, obj: any) {
  const formData = new FormData();
  const readStream = createReadStream("./../../../assets/lodging_photo.jpg");
  streamToBlob(readStream, (err: Error, blob: Blob) => {
    if (err)
      return new Error("Something went wrong while converting stream to blob");

    formData.append("file[]", blob);
  });
  formData.append("price", obj?.price);
  formData.append("address.country", obj?.address?.country);
  formData.append("address.city", obj?.address?.city);
  formData.append("address.address", obj?.address?.address);
  formData.append("description", obj?.description);
  return formData;
}
