import os from 'os'
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
}

cron.schedule('*/5 * * * *', myTask)

console.log('Cron job started!')
