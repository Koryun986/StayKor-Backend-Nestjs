import { createReadStream } from "fs";
import * as streamToBlob from "stream-to-blob";

export function getFormDataFromFilePathAndObject(filePath: string, obj: any) {
  const formData = getFormDataFromObject(obj);
  const readStream = createReadStream("./../../../assets/lodging_photo.jpg");
  streamToBlob(readStream, (err: Error, blob: Blob) => {
    if (err)
      return new Error("Something went wrong while converting stream to blob");

    formData.append("file[]", blob);
  });
  return formData;
}

export function getFormDataFromObject(obj: any) {
  const formData = new FormData();
  formData.append("price", obj?.price);
  formData.append("address.country", obj?.address?.country);
  formData.append("address.city", obj?.address?.city);
  formData.append("address.address", obj?.address?.address);
  formData.append("description", obj?.description);
  return formData;
}
