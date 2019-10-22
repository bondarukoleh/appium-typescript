import {spawn} from 'child_process'
import {ICommandObject} from './retrier'

type ISpawnProcess = (cmdObject: ICommandObject, attemptNumber: number) => Promise<ICommandObject[]> | Promise<null>

interface ISpawnOptions {
  checkStackForSpecificFail?: () => boolean,
  reformatCommand: (cmdObject: ICommandObject, executionStack: any) => ICommandObject[],
  longestProcessTime?: number,
  debugProcess?: boolean,
}

function buildSpawnCommand(uniqFailedByAssertCommands: ICommandObject[], spawnOptions): ISpawnProcess {
  const {
    longestProcessTime,
    debugProcess,
    reformatCommand,
    checkStackForSpecificFail
  } = spawnOptions

  return (cmdObject: ICommandObject, attemptNumber) => new Promise(function(resolve) {
    console.log('YOoooooooo')
    console.log('command %j', cmdObject)
    let executionStack = ''
    const start = Date.now()

    if (debugProcess) {
      console.log(`Command to run: %j`, cmdObject.command)
      console.log(`With arguments: %j`, cmdObject.arguments)
      console.log(`Attempt to run it: ${attemptNumber}`)
    }

    const process = spawn(cmdObject.command, cmdObject.arguments, {shell: true})

    const executionTimeWatcher = setInterval(() => {
      // Fill process that running too long
      if (Date.now() - start > longestProcessTime) {
        process.kill()
      }
    }, 5000)

    process.on('exit', () => {
      clearInterval(executionTimeWatcher)
    })

    process.stdout.on('data', (data) => {
      console.log(data.toString())
      executionStack += data.toString()
    })

    process.stderr.on('data', (data) => console.log(data.toString()))

    process.on('error', (e) => {
      console.error(e)
    })

    process.on('close', (exitCode) => {
      let failedNotByAssertCommand = null

      if (exitCode === 0) {
        // process was succeeded, exit
        return resolve(null)
      }

      if (exitCode !== 0 && executionStack && checkStackForSpecificFail(executionStack)) {
        failedNotByAssertCommand = cmdObject
        debugProcess && console.log(`We have error not connected to test in: ${cmdObject}`)
        // maybe we should return here, to discuss
      }
      if (exitCode !== 0 && executionStack && reformatCommand) {
        failedNotByAssertCommand = reformatCommand(cmdObject, executionStack)
      } else {
        uniqFailedByAssertCommands.push(cmdObject)
      }

      return resolve(Array.isArray(failedNotByAssertCommand) ? failedNotByAssertCommand : [failedNotByAssertCommand])
    })
  })
}

export {buildSpawnCommand}
