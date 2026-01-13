import { Bench } from 'tinybench'
import { compressImage, generateReceipt } from '../index.js'
import { readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`
    }),
  ),
  transports: [new winston.transports.Console()],
})

const b = new Bench()

const getFilePath = (fileName: string): string => {
  const tempPath = join(process.cwd(), 'temp', fileName)
  const assetsPath = join(process.cwd(), 'assets', fileName)

  if (existsSync(tempPath)) {
    logger.info(`Using cached asset from /temp: ${fileName}`)
    return tempPath
  }

  if (existsSync(assetsPath)) {
    logger.info(`Using default asset from /assets: ${fileName}`)
    return assetsPath
  }

  logger.error(`Asset NOT FOUND: ${fileName}. Program might crash if accessed.`)
  return assetsPath
}

const outputDir = join(process.cwd(), 'temp-output')
if (!existsSync(outputDir)) {
  mkdirSync(outputDir)
  logger.info(`Created output directory: ${outputDir}`)
}

const imgPath = getFilePath('../assets/Frame.png')
const bgPath = getFilePath('../assets/Frame.png')
const fontPath = getFilePath('../assets/SpaceMono-Regular.ttf')
const outReceiptPath = join(outputDir, 'bench-result.png')

let uint8Array: Uint8Array

try {
  const imgBuffer = readFileSync(imgPath)
  uint8Array = new Uint8Array(imgBuffer)
  logger.info('Image buffer loaded successfully.')
} catch (e: any) {
  logger.error(`FAILED TO READ IMAGE: ${e.message}`)
  process.exit(1)
}

b.add('Rust: Image Processing (Resize 800x800)', () => {
  compressImage(uint8Array, 800, 800, true)
})

b.add('Rust: Generate Receipt (Full Struk)', () => {
  try {
    generateReceipt(
      bgPath,
      fontPath,
      outReceiptPath,
      'HOMESHOP',
      'Jl.Sukamaju No. 10, Jakarta Kota',
      [
        'NEW BALANCE 509 Unisex Sneakers : 1.359.200',
        'ADIDAS handball spezial shoes : 1.710.000',
        'PUMA Speedcat OG Sneakers Unisex : 1.899.000',
        'Onitsuka Tiger MEXICO 66 : 2.600.000',
        'NEW BALANCE 509 Unisex Sneakers : 1.359.200',
        'ADIDAS handball spezial shoes : 1.710.000',
        'PUMA Speedcat OG Sneakers Unisex : 1.899.000',
        'Onitsuka Tiger MEXICO 66 : 2.600.000',
        'NEW BALANCE 509 Unisex Sneakers : 1.359.200',
        'ADIDAS handball spezial shoes : 1.710.000',
        'PUMA Speedcat OG Sneakers Unisex : 1.899.000',
        'Onitsuka Tiger MEXICO 66 : 2.600.000',
        'NEW BALANCE 509 Unisex Sneakers : 1.359.200',
        'ADIDAS handball spezial shoes : 1.710.000',
        'PUMA Speedcat OG Sneakers Unisex : 1.899.000',
        'Onitsuka Tiger MEXICO 66 : 2.600.000',
      ],
      'IDR. 1.630.000',
    )
  } catch (err: any) {
    logger.error(`Receipt Generation Failed: ${err.message}`)
  }
})

b.add('JS: Pure Buffer Manipulation (XOR Loop)', () => {
  const temp = new Uint8Array(uint8Array.length)
  for (let i = 0; i < 1000; i++) {
    temp[i] = uint8Array[i] ^ 0xff
  }
})
;(async () => {
  logger.info('Running Benchmark Native Rust Engine...')

  await b.run()

  logger.info('Benchmark Done.')
  console.table(b.table())

  logger.info(`Preview of the results can be seen at: ${outReceiptPath}`)
})()
