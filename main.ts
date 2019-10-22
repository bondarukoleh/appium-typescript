import * as Mocha from 'mocha'
import * as fs from 'fs'
import * as path from 'path'
import {runProcess} from './lib/retrier/draft'
import {fail} from 'assert'

const mocha = new Mocha({
  timeout: 60000
})

// const testDir = path.resolve(__dirname, './specs/base_specs');
// fs.readdirSync(testDir)
//     .filter((file) => path.basename(file).match(/.*\.spec\..*/))
//     .forEach((file) => mocha.addFile(path.join(testDir, file)));
//
// mocha.run((failures) => process.exitCode = failures ? 1 : 0);

const failed = []
const commands = [
//   {
//   cmd: './node_modules/.bin/mocha',
//   options: ['-r', 'ts-node/register', './specs/base_specs/*.spec.*', '-t', '30000']
// },
  {
    cmd: './node_modules/.bin/mocha',
    options: ['-r', 'ts-node/register', './specs/specificSpec/*.spec.*', '-t', '30000']
  }]

async function run() {
  for (const command of commands) {
    await runProcess(command, failed)
  }

  console.log('We have FAILED tests')
  console.log(failed)
  if (failed.length) {
    for (const command of failed) {
      await runProcess(command)
    }
  }
}
// run()
