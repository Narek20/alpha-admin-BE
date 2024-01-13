import os from 'os'
import fs from 'fs'
import cron from 'node-cron'

const myTask = () => {
  console.log('Running the task every 5 minutes!')
  const totalMemory = os.totalmem()
  const freeMemory = os.freemem()
  const usedMemory = totalMemory - freeMemory
  const usedMemoryPercentage = (usedMemory / totalMemory) * 100

  console.log(`Total Memory: ${totalMemory / 1024 / 1024} MB`)
  console.log(`Free Memory: ${freeMemory / 1024 / 1024} MB`)
  console.log(`Used Memory: ${usedMemory / 1024 / 1024} MB`)
  console.log(`Used Memory Percentage: ${usedMemoryPercentage.toFixed(2)}%`)
  const date = new Date()
  const result = `
  Time: ${date}\n
  Total Memory: ${totalMemory / 1024 / 1024} MB\n
  Free Memory: ${freeMemory / 1024 / 1024} MB\n
  Used Memory: ${usedMemory / 1024 / 1024} MB\n
  Used Memory Percentage: ${usedMemoryPercentage.toFixed(2)}%\n
  -------------------------------------------------------------
  `

  fs.appendFile('ram_usage_log.txt', result + '\n', (err) => {
    if (err) {
      console.error('Error writing to file:', err)
    } else {
      console.log('Result written to cpu_usage_log.txt')
    }
  })
}

cron.schedule('*/5 * * * *', myTask)

console.log('Cron job started!')
