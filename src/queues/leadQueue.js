const Queue = require('bull')

console.log('📦 Inicializando leadQueue...')

const leadQueue = new Queue('leadQueue', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  }
})

leadQueue.on('error', (err) => {
  console.error('❌ Error en conexión a Redis desde leadQueue.js:', err)
})

module.exports = leadQueue
