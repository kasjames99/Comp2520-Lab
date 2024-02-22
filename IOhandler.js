/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const yauzl = require("yauzl-promise");
const { pipeline } = require("stream/promises");
const fs = require("fs");
const { createReadStream, createWriteStream} = require("fs");
const PNG = require("pngjs").PNG;
const path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */

async function unzip (pathIn, pathOut) {
  const zip = await yauzl.open(pathIn);
  try {
  for await (const entry of zip) {
    if (entry.filename.endsWith('/')) {
      await fs.promises.mkdir(`${pathOut}/${entry.filename}`);
    } else {
      const readStream = await entry.openReadStream();
      const writeStream = fs.createWriteStream(`${pathOut}/${entry.filename}`);
      await pipeline(readStream, writeStream);
    }
  }
} finally {
  await zip.close();
  console.log("Extraction operation complete")
}
  
};

async function readDir(dir) {
  return new Promise((res, rej) => {
    fs.readdir(dir, (err, data) => {
      if (err) {
        rej(err);
      } else {
        const pngFiles = data.filter(file => path.extname(file).toLowerCase() === '.png');
        const filePaths = pngFiles.map(file => path.join(dir, file));
        res(filePaths);
      }
    });
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

async function filter(pathIn, pathOut, filterType) {
  fs.createReadStream(pathIn)
    .pipe(
      new PNG({
        filterType: 4,
        colorType: 6
      })
    )
    .on("parsed", function () {
      const fileName = path.basename(pathIn);
      const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
      const outputFileName = `${fileNameWithoutExtension}_filtered.png`;
      let modifier;

      if (filterType === 'grayscale') {
        modifier = (idx, data) => {
          const gray = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
          data[idx] = data[idx + 1] = data[idx + 2] = gray;
        };
      } else if (filterType === 'sepia') {
        modifier = (idx, data) => {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          data[idx] = Math.min(255, (r * 0.393 + g * 0.769 + b * 0.189));
          data[idx + 1] = Math.min(255, (r * 0.349 + g * 0.686 + b * 0.168));
          data[idx + 2] = Math.min(255, (r * 0.272 + g * 0.534 + b * 0.131));
        }
      }

      const outputPath = path.join(pathOut, outputFileName);
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const idx = (this.width * y + x) << 2;
          modifier(idx, this.data);
        }
      }
      this.pack().pipe(fs.createWriteStream(outputPath));
    });
}

  //takes in png img from promise, in directory called grayscale will be output
module.exports = {
  unzip,
  readDir,
  filter,
};