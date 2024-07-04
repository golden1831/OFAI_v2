import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImage from "./utils"

interface CropAvatarProps {
  initialImage: string;
  onCroppedImage: (file: File) => void;
}

export default function CropAvatar({ initialImage, onCroppedImage }: CropAvatarProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const onCropComplete = async (_: Area, croppedAreaPixels: Area) => {
    const croppedImage = await getCroppedImage({
      src: initialImage as string,
      crop: croppedAreaPixels,
    })

    if (croppedImage) {
      const response = await fetch(croppedImage)

      const data = await response.blob()

      const metadata = {
        type: "image/jpeg",
      }

      const file = new File(
        [data],
        Math.random().toString(36).substring(7),
        metadata
      )

      onCroppedImage(file)
    }
  }

  return (
    <Cropper
      crop={crop}
      zoom={zoom}
      image={initialImage}
      aspect={1 / 1}
      cropShape="round"
      classes={{
        containerClassName: "rounded-lg"
      }}
      onZoomChange={setZoom}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
    />
  )
}