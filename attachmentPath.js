import fs from "fs";
import path from "path";

export const getAttachmentPath = (basePath, passportNumber) => {
  const jpegPathLowerCase = path.join(
    basePath,
    `${passportNumber.toLowerCase()}.jpeg`
  );
  const jpgPathLowerCase = path.join(
    basePath,
    `${passportNumber.toLowerCase()}.jpg`
  );

  const jpegPathUpperCase = path.join(
    basePath,
    `${passportNumber.toUpperCase()}.jpeg`
  );
  const jpgPathUpperCase = path.join(
    basePath,
    `${passportNumber.toUpperCase()}.jpg`
  );

  if (fs.existsSync(jpegPathLowerCase)) return jpegPathLowerCase;
  if (fs.existsSync(jpgPathLowerCase)) return jpgPathLowerCase;

  if (fs.existsSync(jpegPathUpperCase)) return jpegPathUpperCase;
  if (fs.existsSync(jpgPathUpperCase)) return jpgPathUpperCase;

  throw new Error(`Attachment not found for passportNumber ${passportNumber}`);
};
