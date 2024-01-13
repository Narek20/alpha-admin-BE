const os = require('os');

const totalMemory = os.totalmem();
const freeMemory = os.freemem();
const usedMemory = totalMemory - freeMemory;
const usedMemoryPercentage = (usedMemory / totalMemory) * 100;

console.log(`Total Memory: ${totalMemory / 1024 / 1024} MB`);
console.log(`Free Memory: ${freeMemory / 1024 / 1024} MB`);
console.log(`Used Memory: ${usedMemory / 1024 / 1024} MB`);
console.log(`Used Memory Percentage: ${usedMemoryPercentage.toFixed(2)}%`);