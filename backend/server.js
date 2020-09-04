const fs = require('fs')
const path = require('path')
global.config = JSON.parse(fs.readFileSync('../config.json'))
global.redis = require('./redis')
  
const fastify = require('fastify')({logger: true})
fastify.register(require('fastify-cors'), {origin: true})
fastify.decorateReply('cache', require('./middleware/cache'))

const fastifyStatic = require('fastify-static')
fastify.register(require('./api'), { prefix: '/api' })

fastify.register(fastifyStatic, {root: path.join(__dirname, 'web/assets'), prefix: '/assets'})
fastify.get('/:w', async (req, res) => {
  const stream = fs.createReadStream('./web/index.html')
  res.type('text/html').send(stream)
})
fastify.get('/:w(^[a-zA-Z0-9]{16}$)/:e(\\d+)', async (req, res) => {
  const stream = fs.createReadStream('./web/index.html')
  res.type('text/html').send(stream)
})


// Run the server!
fastify.listen(config.backend.port, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})