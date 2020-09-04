const Redis = require('ioredis')
const redis = new Redis(config.redis)
const zlib = require('zlib')
const util = require('util')
const deflate = util.promisify(zlib.deflate)
const inflate = util.promisify(zlib.inflate)

var redisActive = false

redis.on('ready', function () {
  redisActive = true
})
redis.on('end', function () {
  redisActive = false
})
redis.on('error', function (err) {
  redisActive = false
  console.log('Redis Error ' + err);
})

module.exports = {
  set: async (key, val) => {
    if (!redisActive) return
    const zipped = await deflate(JSON.stringify(val))
    redis.set(key, zipped)
  },
  
  get: async (key) => {
    if (!redisActive) return null
    const zipped = await redis.getBuffer(key)
    if (!zipped) return null
    return JSON.parse(await inflate(zipped))
  }
}