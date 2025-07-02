const fs = require('fs')
const path = require('path')
const mime = require('mime')

module.exports = (url) => {
  let files = fs.readdirSync(path.resolve(__dirname, "../../../images"))
  if(files.length > 0) {
    let randFile = files[Math.floor(Math.random() * files.length)]
    const filePath = path.resolve(__dirname, "../../../images/"+randFile)
    const fileBlob = fs.readFileSync(filePath, { encoding: 'base64' })
    const mimeType = mime.getType(filePath)
    const fileHeader = `data:${mimeType};base64,`
    const file = fileHeader + fileBlob
    const urlObj = new URL(url)
    const urlFormatted = `${urlObj.protocol}//${urlObj.host}`
    return `${urlFormatted}/image/${randFile}`
  }
}
