import { createReadStream } from "fs";
import mime from "mime";

function getBlobFromFilePath(filePath: string) {
  const readStream = createReadStream(filePath);
  const bufferChunks = [];
  readStream.on("data", (chunk) => {
    bufferChunks.push(chunk);
  });

  let blob: Blob;
  readStream.on("end", () => {
    const buffer = Buffer.concat(bufferChunks);
    const mimeType = mime.getType(filePath);
    blob = new Blob([buffer], { type: mimeType });
  });
  return blob;
}

export function getFormDataFromFilePathAndObject(filePath: string, obj: any) {
  const formData = getFormDataFromObject(obj);
  const blob = getBlobFromFilePath(filePath);
  formData.append("file[]", blob);
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
