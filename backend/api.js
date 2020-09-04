const fetch = require('node-fetch')
const regex = {
  wcl: /^[a-zA-Z0-9]{16}$/,
}

module.exports = function (fastify, opts, next) {
  fastify.get('/report', async function (req, res) {
    if (!req.query.id.match(regex.wcl)) {
      return res.code(404).send({error: 'Invalid ID'})
    }
    try {
      var report = await redis.get(req.query.id)
      if (!report) {
        report = await fetch(`https://classic.warcraftlogs.com/v1/report/fights/${req.query.id}?api_key=${config.wclKey}`)
        report = await report.json()
  
        report.raid = {}
        for (let i = 0; i < report.friendlies.length; i++) {
          delete report.friendlies[i].fights
          delete report.friendlies[i].server
          report.raid[report.friendlies[i].id] = report.friendlies[i]
          delete report.raid[report.friendlies[i].id].id
        }
        delete report.friendlies
        delete report.exportedCharacters
      }
      redis.set(req.query.id, report)
      res.send(report)
    }
    catch (e) {
      console.log(e)
      res.code(500)
      res.send({error: e.message})
    }
  })

  fastify.get('/events', async function (req, res) {
    if (!req.query.id.match(regex.wcl) || !(parseInt(req.query.fight) > -1) || !req.query.type.match(regex.events)) {
      return res.code(404).send({error: 'Invalid request'})
    }
    try {
      var eventType
      var addQuery = ''
      var usePaging = true
      switch (req.query.type) {
        case 'summary':
          eventType = 'summary'
          usePaging = false
          break
        case 'damage':
          eventType = 'damage-done'
        break
        case 'casts':
          eventType = 'casts'
          break
        case 'enemyDeaths':
          eventType = 'deaths'
          addQuery = '&hostility=1'
          break
        case 'summons':
          eventType = 'summons'
          addQuery = '&hostility=1'
          break
        case 'debuffs':
          eventType = 'debuffs'
          addQuery = '&hostility=1'
          break
        default:
          return res.code(404).send({error: 'Invalid request'})
      }
      var fightKey = parseInt(req.query.fight)
      const redisKey = `${req.query.id}:${fightKey}:${req.query.type}`
      var events = await redis.get(redisKey)
      if (events) {
        return res.send(events)
      }
      var report = await redis.get(req.query.id)
      if (!report) {
        return res.code(400).send({error: 'Invalid request'})
      }
      if (!report.fights[fightKey]) {
        return res.code(400).send({error: 'Invalid request'})
      }
      events = await fetch(`https://classic.warcraftlogs.com/v1/report/events/${eventType}/${req.query.id}?start=${report.fights[fightKey].start_time}&end=${usePaging && report.fights[fightKey].end_time || report.fights[fightKey].start_time}${addQuery}&api_key=${config.wclKey}`)
      events = await events.json()
      delete events.auraAbilities

      while (events.nextPageTimestamp) {
        let next = await fetch(`https://classic.warcraftlogs.com/v1/report/events/${eventType}/${req.query.id}?start=${events.nextPageTimestamp}&end=${report.fights[fightKey].end_time}${addQuery}&api_key=${config.wclKey}`)
        next = await next.json()
        events.events = events.events.concat(next.events)
        events.nextPageTimestamp = next.nextPageTimestamp
      }
      events = events.events

      redis.set(redisKey, events)
      res.send(events)
    }
    catch (e) {
      console.log(e)
      res.code(500).send({error: e.message})
    }
  })

  next()
}