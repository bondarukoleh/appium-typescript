import {getSpecsFilesPath, buildRetrier, ICommandObject} from './lib/retrier'
import * as path from 'path'

const specsPath = getSpecsFilesPath(path.join(__dirname, './specs/specificSpec'))

function reformatCommand(cmdObject: ICommandObject, executionStack): ICommandObject[] {
  if (executionStack.includes('FAILED_IT')) {
    const failedIt = executionStack.match(/(?<=FAILED_IT:\$\$)(\d|\w|\s)+/ig)
    return failedIt.map((itName) => {
      return {
        command: './node_modules/.bin/mocha',
        arguments: ['-r', 'ts-node/register', './specs/**/*.spec.*', '-t', '30000', '-g', `"${itName}"`]
      }
    })
  }
}

const commands = specsPath.map((pathToSpec) => {
  return {
    command: './node_modules/.bin/mocha',
    arguments: ['-r', 'ts-node/register', pathToSpec, '-t', '30000']
  }
})

const runner = buildRetrier({reformatCommand, debugProcess: true})
runner(commands).then(({failedCommandsAfterAllAttempts, uniqFailedByAssertCommands}) => {
  if (failedCommandsAfterAllAttempts.length || uniqFailedByAssertCommands.length) {
    console.log('RUN FAILED. Commands:')
    console.log([...failedCommandsAfterAllAttempts, ...uniqFailedByAssertCommands])
    process.exit(1)
  }
  console.log('SUCCESSFUL RUN')
})
