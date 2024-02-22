const fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

// const readStream = fs.createReadStream(path.join(__dirname,"unzipped",pathIn))
// .pipe(
//   new PNG({
//     filterType: 4,
//     colorType: 0
//   })
// )
const pixelGrayscale = (red,green,blue) => {
    return (0.21*red+0.72*green+0.07*blue)
}
const sepiaFilter = (red,green,blue) => {
  const newR = parseInt((0.393*red + 0.769*green + 0.189*blue))
  const newG = parseInt((0.349*red + 0.686*green + 0.168*blue))
  const newB = parseInt((0.272*red + 0.534*green + 0.131*blue))
  let r,g,b;
  if(newR > 255) {
    r = 255
  } else {
    r = newR
  }
  if(newG > 255) {
    g = 255
  } else {
    g = newG
  }
  if(newB > 255) {
    b = 255
  } else {
    b = newB
  }
  return [r,g,b]
}
module.exports = {pixelGrayscale, sepiaFilter}