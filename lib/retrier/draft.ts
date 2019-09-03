import {spawn} from 'child_process'

let executionCount = 0

function runProcess({cmd, options}, failedCmd = []) {
  console.log('HAVE CMD TO RUN:', options)
  return new Promise(function(resolve) {
    console.log('==========================Running process======================')
    let executionStack = ''
    executionCount++
    const job = spawn(cmd, options, {shell: true})
    console.log('RUNNING JOB WITH PID ', job.pid)
    job.stderr.on('data', (err) => {
      console.log('We have an error !!!!')
      console.log(err.toString())
    })

    job.stdout.on('data', (data) => {
      console.log('We have an DATA')
      console.log(data.toString())
      executionStack += data.toString()
    })

    job.on('close', (code) => {
      console.log('PROCESS CLOSED')
      console.log('We have code', code)
      if (code === 0) {
        return resolve([])
      }
      if (executionStack.includes('FAILED_IT')) {
        const failedIt = executionStack.match(/(?<=FAILED_IT:\$\$)(\d|\w|\s)+/ig)
        const reformattedCommands = failedIt.map((itName) => {
          return {
            cmd: './node_modules/.bin/mocha',
            options: ['-r', 'ts-node/register', './specs/**/*.spec.*', '-t', '30000', '-g', `"${itName}"`]
          }
        })
        failedCmd.push(...reformattedCommands)
        resolve(failedCmd)
      }

      job.on('exit', () => {
        console.log('PROCESS EXIT')
      })

      job.on('error', (err) => {
        console.log('We have an COMMAAND error')
      })
    })
  })
}

export {runProcess}
// runProcess('./node_modules/.bin/mocha',  ['--require', 'ts-node/register', './specs/**/*.spec.*'])
