'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype)
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.logger = void 0
var tinybench_1 = require('tinybench')
var index_js_1 = require('../index.js')
var fs_1 = require('fs')
var path_1 = require('path')
var winston_1 = require('winston')
exports.logger = winston_1.default.createLogger({
  level: 'info',
  format: winston_1.default.format.combine(
    winston_1.default.format.timestamp({ format: 'HH:mm:ss' }),
    winston_1.default.format.colorize(),
    winston_1.default.format.printf(function (_a) {
      var timestamp = _a.timestamp,
        level = _a.level,
        message = _a.message
      return '['.concat(timestamp, '] ').concat(level, ': ').concat(message)
    }),
  ),
  transports: [new winston_1.default.transports.Console()],
})
var b = new tinybench_1.Bench()
var getFilePath = function (fileName) {
  var tempPath = (0, path_1.join)(process.cwd(), 'temp', fileName)
  var assetsPath = (0, path_1.join)(process.cwd(), 'assets', fileName)
  if ((0, fs_1.existsSync)(tempPath)) {
    exports.logger.info('Using cached asset from /temp: '.concat(fileName))
    return tempPath
  }
  if ((0, fs_1.existsSync)(assetsPath)) {
    exports.logger.info('Using default asset from /assets: '.concat(fileName))
    return assetsPath
  }
  exports.logger.error('Asset NOT FOUND: '.concat(fileName, '. Program might crash if accessed.'))
  return assetsPath
}
var outputDir = (0, path_1.join)(process.cwd(), 'temp-output')
if (!(0, fs_1.existsSync)(outputDir)) {
  ;(0, fs_1.mkdirSync)(outputDir)
  exports.logger.info('Created output directory: '.concat(outputDir))
}
var imgPath = getFilePath('../assets/Frame.png')
var bgPath = getFilePath('../assets/Frame.png')
var fontPath = getFilePath('../assets/Rubik-Regular.ttf')
var outReceiptPath = (0, path_1.join)(outputDir, 'bench-result.png')
var uint8Array
try {
  var imgBuffer = (0, fs_1.readFileSync)(imgPath)
  uint8Array = new Uint8Array(imgBuffer)
  exports.logger.info('Image buffer loaded successfully.')
} catch (e) {
  exports.logger.error('FAILED TO READ IMAGE: '.concat(e.message))
  process.exit(1)
}
b.add('Rust: Image Processing (Resize 800x800)', function () {
  ;(0, index_js_1.compressImage)(uint8Array, 800, 800, true)
})
b.add('Rust: Generate Receipt (Full Struk)', function () {
  try {
    ;(0, index_js_1.generateReceipt)(
      bgPath,
      fontPath,
      outReceiptPath,
      'Rocket Store',
      'Jl. Debian No. 10, Linux City',
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
  } catch (err) {
    exports.logger.error('Receipt Generation Failed: '.concat(err.message))
  }
})
b.add('JS: Pure Buffer Manipulation (XOR Loop)', function () {
  var temp = new Uint8Array(uint8Array.length)
  for (var i = 0; i < 1000; i++) {
    temp[i] = uint8Array[i] ^ 0xff
  }
})
;(function () {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          exports.logger.info('Running Benchmark Native Rust Engine...')
          return [4 /*yield*/, b.run()]
        case 1:
          _a.sent()
          exports.logger.info('Benchmark Done.')
          console.table(b.table())
          exports.logger.info('Preview of the results can be seen at: '.concat(outReceiptPath))
          return [2 /*return*/]
      }
    })
  })
})()
