import "react-advanced-cropper/dist/themes/corners.css";
import "react-advanced-cropper/dist/style.css";
import React, { useState, useRef } from "react";
import { Cropper, CropperRef } from "react-advanced-cropper";

const ImageCropper = ({ file, onCropComplete, aspectRatio }) => {
  const cropperRef = useRef<CropperRef>(null);
  const [croppingDone, setCroppingDone] = useState<boolean>(false);

  const addBackgroundToBase64Image = (
    base64Image: string,
    backgroundColor: string,
    callback: (newBase64Image: string) => void
  ) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);

        const newBase64Image = canvas.toDataURL("image/png");
        callback(newBase64Image);
      }
    };
    img.src = base64Image;
  };

  const onCrop = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (cropperRef.current) {
      const croppedImageData = cropperRef.current.getCanvas()?.toDataURL();
      if (croppedImageData) {
        addBackgroundToBase64Image(
          croppedImageData,
          "#000000",
          (newBase64Image) => {
            onCropComplete({ src: newBase64Image });
            setCroppingDone(true);
          }
        );
      }
    }
  };

  return (
    <div
      className={`${
        croppingDone ? "hidden" : ""
      } w-full h-full fixed top-0 left-0 flex justify-center items-center bg-[#00000070]`}
    >
      <div className="w-[90%] md:w-full shadow-2xl shadow-black max-w-screen-lg h-auto md:h-[95%] bg-[#161616] rounded-xl shadow-md">
        <div className="h-full p-4 lg:p-6 flex flex-col justify-center items-center gap-4 relative">
          <div className="w-full h-full aspect-[16/9] bg-cover bg-center bg-no-repeat">
            <Cropper
              ref={cropperRef}
              src={croppingDone ? null : file}
              canvas={true}
              stencilProps={{ aspectRatio: aspectRatio, grid: true }}
            />
          </div>
          <button
            onClick={onCrop}
            className="p-3 hover:bg-[#282828] absolute bottom-5 right-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-floppy"
              viewBox="0 0 16 16"
            >
              <path d="M11 2H9v3h2z" />
              <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
