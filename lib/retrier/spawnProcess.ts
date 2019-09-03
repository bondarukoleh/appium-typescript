import {spawn} from 'child_process'

function buildSpawnCommand(failedByAssertCommands, spawnOptions) {
  const {
    longestProcessTime,
    debugProcess,
    reformatCommand,
    checkStackForSpecificFail
  } = spawnOptions

  return (cmdObject, attemptNumber) => new Promise(function(resolve) {
    let executionStack = ''
    const originalCmd = cmdObject.cmd

    const start = Date.now()

    if (debugProcess) {
      console.log(`Command to run: %j`, cmdObject.command)
      console.log(`With arguments: %j`, cmdObject.args)
      console.log(`Attempt to run it: ${attemptNumber}`)
    }

    const process = spawn(cmdObject.command, cmdObject.args, {shell: true})

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
        resolve(true)
        return
      }

      if (exitCode !== 0 && executionStack && checkStackForSpecificFail(executionStack)) {
        failedNotByAssertCommand = cmdObject
      } else if (exitCode !== 0 && executionStack && reformatCommand(executionStack)) {
        failedNotByAssertCommand = reformatCommand(cmdObject, executionStack)
      } else {
        failedByAssertCommands.push(cmdObject)
      }

      resolve(failedNotByAssertCommand)
    })
  })
}

export {buildSpawnCommand}
