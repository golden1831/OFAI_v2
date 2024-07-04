import type { Area } from "react-easy-crop"

type RotateSize = Pick<Area, "width" | "height"> & {
  rotation: number
}

type GetCroppedImage = {
  src: string
  crop: Area
  rotation?: number
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous") // needed to avoid cross-origin issues on CodeSandbox

    image.src = url
  })
}

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

function rotateSize({ width, height, rotation }: RotateSize) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

export default async function ({
  src,
  crop,
  rotation = 0,
}: GetCroppedImage): Promise<string | null> {
  const image = await createImage(src)

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) return null

  const rotRad = getRadianAngle(rotation)

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize({
    width: image.width,
    height: image.height,
    rotation,
  })

  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(1, 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  ctx.drawImage(image, 0, 0)

  const croppedCanvas = document.createElement("canvas")

  const croppedCtx = croppedCanvas.getContext("2d")

  if (!croppedCtx) return null

  croppedCanvas.width = crop.width
  croppedCanvas.height = crop.height

  croppedCtx.drawImage(
    canvas,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise((resolve) => {
    croppedCanvas.toBlob((file) => {
      resolve(URL.createObjectURL(file as Blob))
    }, "image/jpeg")
  })
}
