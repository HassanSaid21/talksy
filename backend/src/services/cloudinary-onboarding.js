#!/usr/bin/env node

import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Missing required Cloudinary environment variables: CLOUDINARY_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be set"
  );
}

const sampleImageUrl =
  "https://res.cloudinary.com/demo/image/upload/sample.jpg";

// async function main() {
//   const uploadedImage = await cloudinary.uploader.upload(sampleImageUrl, {
//     folder: "talksy-onboarding",
//     resource_type: "image",
//   });

//   console.log("Uploaded secure URL:", uploadedImage.secure_url);
//   console.log("Uploaded public ID:", uploadedImage.public_id);

//   const imageDetails = await cloudinary.api.resource(uploadedImage.public_id, {
//     resource_type: "image",
//   });

//   console.log("Width:", imageDetails.width);
//   console.log("Height:", imageDetails.height);
//   console.log("Format:", imageDetails.format);
//   console.log("File size (bytes):", imageDetails.bytes);

//   // f_auto lets Cloudinary choose the best output format for the browser.
//   // q_auto lets Cloudinary choose an efficient quality level to reduce file size.
//   const transformedUrl = cloudinary.url(uploadedImage.public_id, {
//     secure: true,
//     resource_type: "image",
//     transformation: [{ fetch_format: "auto", quality: "auto" }],
//   });

//   console.log(
//     "Done! Click link below to see optimized version of the image. Check the size and the format.",
//   );
//   console.log("Transformed URL:", transformedUrl);
// }

// main().catch((error) => {
//   console.error("Cloudinary onboarding script failed:");
//   console.error(error);
//   process.exitCode = 1;
// });


export const uploadImageToCloudinary = async (imageUrl, folder) => {
  try {
    const uploadedImage = await cloudinary.uploader.upload(imageUrl, {  
      folder: folder,
      resource_type: "image",
    }); 
    return {
      secureUrl: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  } 
};
