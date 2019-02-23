(async _ =>
{
  const fs = require('fs')
      , lockFile = require('lockfile')

  while ( true ) {
    console.log( 'Hello from worker.js' )

    let jobs = []

    try {
      jobs = fs.readdirSync('./queue-items') || []
    } catch ( e ) { /* pass */ }

    if ( jobs.length ) {
      const job = jobs.shift()

      lockFile.lock(`${job}.lock`, {}, err =>
      {
        if ( err ) {
          return
        }

        console.log( `Acquired lock for ${job}!` )

        try {
          let date = new Date
          fs.appendFileSync(
            `./jobs-${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}.log`,
            `[worker#${process.argv[process.argv.length-1]}] [${new Date()}] Processed ${job}\n`
          )
  
          fs.unlinkSync(`./queue-items/${job}`)
        } catch (e) { console.error(e) /* pass */ }

        // release the lock
        lockFile.unlock(`${job}.lock`)
      })
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

})()