import sharp from 'sharp'
import { mkdir } from 'fs/promises'

const sizes = [192, 512]
const inputPath = './app/icon.svg'
const outputDir = './public/icons'

await mkdir(outputDir, { recursive: true })

for (const size of sizes) {
  await sharp(inputPath)
    .resize(size, size)
    .png()
    .toFile(`${outputDir}/icon-${size}.png`)
  console.log(`Generated icon-${size}.png`)
}
