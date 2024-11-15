// MediaUploader.tsx
'use client';

import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

const shimmer = (w: number, h: number) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="100%" height="100%" fill="#f0f0f0" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const dataUrl = `data:image/svg+xml;base64,${toBase64(shimmer(1000, 1000))}`;

export const aspectRatioOptions = {
  "1:1": { aspectRatio: "1:1", label: "Square (1:1)", width: 1000, height: 1000 },
  "3:4": { aspectRatio: "3:4", label: "Standard Portrait (3:4)", width: 1000, height: 1334 },
  "9:16": { aspectRatio: "9:16", label: "Phone Portrait (9:16)", width: 1000, height: 1778 },
};

type AspectRatioKey = "1:1" | "3:4" | "9:16";

export const getImageSize = (
  type: string,
  image: any,
  dimension: "width" | "height"
): number => {
  if (type === "fill") {
    return aspectRatioOptions[image.aspectRatio as AspectRatioKey]?.[dimension] || 1000;
  }
  return image?.[dimension] || 1000;
};

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
};

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type,
}: MediaUploaderProps) => {
  // Handle the upload success
  const onUploadSuccessHandler = (result: any) => {
    const newPublicId = result?.info?.public_id;
    setImage((prevState: any) => ({
      ...prevState,
      publicId: newPublicId,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url,
    }));
    onValueChange(newPublicId);
    alert('Image uploaded successfully: 1 credit was deducted from your account');
  };

  // Handle the upload error
  const onUploadErrorHandler = () => {
    alert('Something went wrong while uploading. Please try again');
  };

  return (
    <CldUploadWidget
      uploadPreset="car_mt"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          {/* <h3 className="h3-bold text-dark-600">Upload Image</h3> */}
          {publicId ? (
            <div className="cursor-pointer overflow-hidden rounded-[10px]">
              <CldImage
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                src={publicId}
                alt="image"
                sizes="(max-width: 767px) 100vw, 50vw"
                placeholder={dataUrl as PlaceholderValue}
                className="media-uploader_cldImage"
              />
            </div>
          ) : (
            <div className="media-uploader_cta" onClick={() => open()}>
              <div className="media-uploader_cta-image">
                <Image
                  src="/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
              <p className="p-14-medium">Click here to upload image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
