import {buildSpawnCommand} from './spawnProcess'
import {sleep, getSpecsFilesPath} from './utils'

function buildRetrier(retrierOptions) {
  const failedByAssertCommands = []
  let currentSessionCount = 0
  // should be let not const
  let {attemptsCount = 2, maxSessionCount = 10} = retrierOptions
  const {
    checkStackForSpecificFail,
    afterAttemptCallback,
    reformatCommand,
    longestProcessTime = 30 * 60 * 1000, // thirty minutes
    debugProcess = false,
    pollTime = 5000,
  } = retrierOptions

  const spawnProcess = buildSpawnCommand(failedByAssertCommands,
    {
      longestProcessTime,
      debugProcess,
      reformatCommand,
      checkStackForSpecificFail
    })

  async function retrier(commandsArray) {
    if (debugProcess) {
      console.log(`Attempts count is: ${attemptsCount}`)
    }
    const attemptsArray = new Array(attemptsCount).fill(1) // not magic, just to have index, and no undefined

    async function runCommand(commandsToRun, failedCommands, attemptNumber) {
      if (maxSessionCount > currentSessionCount && commandsToRun.length) {
        currentSessionCount++
        const failed = await spawnProcess(commandsArray.pop(), attemptNumber)
        if (failed) {
          failedCommands.push(failed)
        }
        currentSessionCount--
      }
    }

    async function runCommandsArray(commandsToRun, failedCommands, attemptNumber) {
      const pushToExecution = setInterval(() => runCommand(commandsToRun, failedCommands, attemptNumber), pollTime)

      do {
        if (commandsToRun.length) {
          await runCommand(commandsToRun, failedCommands, attemptNumber)
        }
        if (currentSessionCount) {
          await sleep(2000)
        }
      } while (commandsToRun.length || currentSessionCount)

      if (afterAttemptCallback && typeof afterAttemptCallback === 'function') {
        if (Object.prototype.toString.call(afterAttemptCallback) === '[object AsyncFunction]') {
          await afterAttemptCallback()
        } else {
          afterAttemptCallback()
        }
      }

      clearInterval(pushToExecution)
      return failedCommands
    }

    // main action here
    const failedCommandsAfterAllAttempts = await attemptsArray.reduce((resolver, current, attemptNumber) => {
      return resolver.then((commandsToRun) => {
        return runCommandsArray(commandsToRun, [], attemptNumber)
          .then((attemptFailedCommands) => attemptFailedCommands)
      }, Promise.resolve(commandsArray))
    })

    const combinedFails = [...failedCommandsAfterAllAttempts, ...failedByAssertCommands]
    if (combinedFails.length) {
      console.log(`We got failed commands: ${combinedFails}`)
    }

    return {
      failedCommandsAfterAllAttempts,
      failedByAssertCommands
    }
  }
  return retrier
}

export {buildRetrier}
