import * as minimist from 'minimist';
import * as fs from 'fs';
import * as path from 'path';

const ENV_ARGS = minimist(process.argv.slice(2));
const compiledFolder = path.resolve(__dirname, './build');
const reportFolder = path.resolve(__dirname, './allure-report');
const resultsFolder = path.resolve(__dirname, './allure-results');

if (ENV_ARGS.cleanBuild) {
  removeDirectory(compiledFolder)
}

if (ENV_ARGS.cleanReport) {
  removeDirectory(reportFolder);
  removeDirectory(resultsFolder)
}

function removeDirectory(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((innerValue) => {
      const innerPath = path.join(directoryPath, innerValue);
      if (fs.statSync(innerPath).isFile()) {
        fs.unlinkSync(innerPath)
      } else {
        removeDirectory(innerPath)
      }
    });
    fs.rmdirSync(directoryPath)
  }
}

