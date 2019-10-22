import {buildSpawnCommand} from './spawnProcess'
import {sleep, getSpecsFilesPath} from './utils'

interface IBuildRetrier {
  maxSessionCount?: number,
  checkStackForSpecificFail?: () => boolean,
  afterAttemptCallback?: () => any,
  reformatCommand: (cmdObject: ICommandObject, executionStack: any) => ICommandObject[],
  longestProcessTime?: number, // thirty minutes
  debugProcess?: boolean,
  pollTime?: number,
  attemptsCount?: number
}

type IBuildRetrierReturns = (commandsArray: ICommandObject[]) => Promise<{
    failedCommandsAfterAllAttempts: ICommandObject[],
    uniqFailedByAssertCommands: ICommandObject[]
  }>

export interface ICommandObject {
  command: string,
  arguments: string[]
}

function buildRetrier(retrierOptions: IBuildRetrier): IBuildRetrierReturns {
  const uniqFailedByAssertCommands = []
  let currentSessionCount = 0
  // should be let not const
  let {attemptsCount = 2} = retrierOptions
  const {
    maxSessionCount = 10,
    checkStackForSpecificFail = () => false,
    afterAttemptCallback,
    reformatCommand,
    longestProcessTime = 30 * 60 * 1000, // thirty minutes
    debugProcess = false,
    pollTime = 5000,
  } = retrierOptions

  const spawnProcess = buildSpawnCommand(uniqFailedByAssertCommands,
    {
      longestProcessTime,
      debugProcess,
      reformatCommand,
      checkStackForSpecificFail
    })

  async function retrier(commandsArray: ICommandObject[]): Promise<{
    failedCommandsAfterAllAttempts: ICommandObject[],
    uniqFailedByAssertCommands: ICommandObject[]
  }> {
    if (debugProcess) {
      console.log(`Attempts count is: ${attemptsCount}`)
    }
    const attemptsArray = new Array(attemptsCount).fill(1) // not magic, just to have index, and no undefined

    async function runCommand(commandsToRun, uniqForAttemptFailedCommandsArray, attemptNumber) {
      if (maxSessionCount > currentSessionCount && commandsToRun.length) {
        currentSessionCount++
        const failed = await spawnProcess(commandsToRun.pop(), attemptNumber)
        if (!!failed) {
          uniqForAttemptFailedCommandsArray.push(...failed)
        }
        currentSessionCount--
      }
    }

    async function runCommandsArray(commandsToRun, uniqForAttemptFailedCommandsArray, attemptNumber) {
      const pushToExecution = setInterval(() => runCommand(commandsToRun, uniqForAttemptFailedCommandsArray,
        attemptNumber), pollTime)

      do {
        if (commandsToRun.length) {
          await runCommand(commandsToRun, uniqForAttemptFailedCommandsArray, attemptNumber)
        }
        if (currentSessionCount) {
          await sleep(2000)
        }
      } while (commandsToRun.length || currentSessionCount)

      if (afterAttemptCallback && typeof afterAttemptCallback === 'function') {
        if (Object.prototype.toString.call(afterAttemptCallback) === '[object AsyncFunction]') {
          try {await afterAttemptCallback()} catch (e) {
            debugProcess && console.log('ERROR IN afterAttemptCallback')
            console.error(e)
          }
        } else {
          afterAttemptCallback()
        }
      }

      clearInterval(pushToExecution)
      return uniqForAttemptFailedCommandsArray
    }

    // main action here
    const failedCommandsAfterAllAttempts = await attemptsArray.reduce(
      (resolver, current, attemptNumber) => {
      return resolver.then((commandsToRun) => {
        return runCommandsArray(commandsToRun, [], attemptNumber)
          .then((uniqForAttemptFailedCommandsArray) => {
            return uniqForAttemptFailedCommandsArray
          })
      })
    }, Promise.resolve(commandsArray))

    return {
      failedCommandsAfterAllAttempts,
      uniqFailedByAssertCommands
    }
  }

  return retrier
}

export {buildRetrier}
