const fs = require('fs')
const path = require('path')
global.config = JSON.parse(fs.readFileSync('../config.json'))
global.wcl = require('./wcl')
global.gql = require('graphql-request').gql
  
const fastify = require('fastify')()
fastify.register(require('fastify-cors'), {origin: true})
fastify.decorateReply('cache', require('./middleware/cache'))

const fastifyStatic = require('fastify-static')
fastify.register(require('./api'), { prefix: '/api' })

fastify.register((instance, opts, next) => {
  instance.register(require('fastify-static'), {
	root: path.join(__dirname, 'web/assets'),
	prefix: '/assets/'
  })
  next()
})
fastify.register((instance, opts, next) => {
  instance.register(require('fastify-static'), {
	root: path.join(__dirname, 'web/favico'),
	prefix: '/favico/'
  })
  next()
})

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
    console.error(err)
    process.exit(1)
  }
  console.log(`server listening on ${address}`)
})