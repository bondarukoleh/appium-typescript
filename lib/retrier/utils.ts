import * as path from 'path'
import * as fs from 'fs'

function getSpecsFilesPath(pathToFolder, fileList = []) {
  const files = fs.readdirSync(pathToFolder)
  files.forEach((file) => {
    if (fs.statSync(path.join(pathToFolder, file)).isDirectory()) {
      fileList = getSpecsFilesPath(path.join(pathToFolder, file), fileList)
    } else {
      fileList.push(path.join(pathToFolder, file))
    }
  })
  return fileList
}

const sleep = (time) => new Promise((res) => setTimeout(res, time))

export {getSpecsFilesPath, sleep}
