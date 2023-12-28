async function getBlobFromFilePath(filePath: string) {
  try {
    const response = await fetch(filePath);
    const blob = await response.blob();

    return blob;
  } catch (error) {
    console.log(error);
  }
}

export async function getFormDataFromFilePathAndObject(
  filePath: string,
  obj: any,
) {
  const formData = getFormDataFromObject(obj);
  const blob = await getBlobFromFilePath(filePath);
  formData.append("files", blob);
  return formData;
}

export function getFormDataFromObject(obj: any) {
  const formData = new FormData();
  formData.append("price", obj?.price);
  formData.append("address[country]", obj?.address?.country);
  formData.append("address[city]", obj?.address?.city);
  formData.append("address[address]", obj?.address?.address);
  formData.append("description", obj?.description);
  return formData;
}
