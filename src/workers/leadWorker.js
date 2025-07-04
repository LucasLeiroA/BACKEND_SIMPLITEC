const leadQueue = require('../queues/leadQueue')
const { sendLeadEmail } = require('../utils/mailer')

console.log('🚀 Worker de leads iniciado...')


leadQueue.getWaiting().then(jobs => {
  console.log('🕓 Jobs en espera:', jobs.length)
})



leadQueue.process(async (job, done) => {
    const { to, subject, html } = job.data
    try {
        console.log(`📨 Enviando mail a ${to}...`)
        await sendLeadEmail(to, subject, html)
        console.log(`✅ Mail enviado a ${to}`)
        done()
    } catch (error) {
        console.error(`❌ Error enviando mail a ${to}:`, error)
        done(new Error('Error al enviar el correo'))
    }
})