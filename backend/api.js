const fetch = require('node-fetch')
const wcl = require('./wcl')
const regex = {
  wcl: /^[a-zA-Z0-9]{16}$/,
}

async function getReport(code, skipCache) {
  return await wcl.query(gql`query ($code: String!) {
    reportData {
      report(code: $code) {
        title
        startTime
        endTime
        guild {
          id
          name
          faction {
            id
          }
        }
        fights {
          id
          encounterID
          startTime
          endTime
          name
          kill
          bossPercentage
        }
        masterData {
          actors {
            id
            gameID
            name
            type
            subType
            petOwner
          }
          abilities {
            gameID
            type
          }
        }
      }
    }
  }`, {skipCache, vars: {code}})
}

module.exports = function (fastify, opts, next) {
  fastify.get('/report', async function (req, res) {
    if (!req.query.id.match(regex.wcl)) {
      return res.code(404).send({error: 'Invalid ID'})
    }
    try {
      const report = await getReport(req.query.id, req.query.refresh)
      // if the report is recent it may be a live report and still updating so use a short browser cache time
      if (Date.now() - report.reportData.report.endTime < 1800 * 1000) {
        return res.cache(60).send(report)
      }
      return res.cache(3600*24*30).send(report)
    }
    catch (e) {
      console.log(e)
      return res.code(500).send({error: e.message})
    }
  })

  fastify.get('/events', async function (req, res) {
    if (!req.query.id.match(regex.wcl) || !(parseInt(req.query.fight) > -1)) {
      return res.code(404).send({error: 'Invalid request'})
    }
    try {
      const report = await getReport(req.query.id)
      if (!report || report.error) {
        return res.code(500).send(report)
      }
      var fightKey = parseInt(req.query.fight)
      if (!report.reportData.report.fights[fightKey]) {
        return res.code(404).send({error: 'Invalid request'})
      }


      var eventType
      var addQuery = ''
      var usePaging = true
      var query
      var queryVars = {
        code: req.query.id,
        start: report.reportData.report.fights[fightKey].startTime,
        end: report.reportData.report.fights[fightKey].endTime
      }
      switch (req.query.type) {
        case 'summary':
          query = gql`query ($code: String!, $start: Float!, $end: Float!) {
            reportData {
              report(code: $code) {
                events(dataType: CombatantInfo, startTime: $start, endTime: $end) {
                  data
                }
              }
            }
          }`
          break
        case 'damage':
          query = gql`query ($code: String!, $start: Float!, $end: Float!) {
            reportData {
              report(code: $code) {
                events(dataType: DamageDone, startTime: $start, endTime: $end) {
                  data
                  nextPageTimestamp
                }
              }
            }
          }`
          break
        case 'casts':
          query = gql`query ($code: String!, $start: Float!, $end: Float!) {
            reportData {
              report(code: $code) {
                events(dataType: Casts, startTime: $start, endTime: $end) {
                  data
                  nextPageTimestamp
                }
              }
            }
          }`
          break
        case 'enemyDeaths':
          query = gql`query ($code: String!, $start: Float!, $end: Float!) {
            reportData {
              report(code: $code) {
                events(dataType: Deaths, hostilityType: Enemies, startTime: $start, endTime: $end) {
                  data
                  nextPageTimestamp
                }
              }
            }
          }`
          break
        case 'enemySummons':
          query = gql`query ($code: String!, $start: Float!, $end: Float!) {
            reportData {
              report(code: $code) {
                events(dataType: Summons, hostilityType: Enemies, startTime: $start, endTime: $end) {
                  data
                  nextPageTimestamp
                }
              }
            }
          }`
          break
        case 'enemyDebuffs':
          query = gql`query ($code: String!, $start: Float!, $end: Float!) {
            reportData {
              report(code: $code) {
                events(dataType: Debuffs, hostilityType: Enemies, startTime: $start, endTime: $end) {
                  data
                  nextPageTimestamp
                }
              }
            }
          }`
          break
        default:
          return res.code(404).send({error: 'Invalid request'})
      }
      var events = await wcl.query(query, {vars: queryVars})
      
      while (events.reportData.report.events.nextPageTimestamp && events.reportData.report.events.nextPageTimestamp > queryVars.start) {
        queryVars.start = events.reportData.report.events.nextPageTimestamp
        let next = await wcl.query(query, {vars: queryVars})
        events.reportData.report.events.data = events.reportData.report.events.data.concat(next.reportData.report.events.data)
        events.reportData.report.events.nextPageTimestamp = next.reportData.report.events.nextPageTimestamp
      }
      events = events.reportData.report.events.data

      res.cache(3600*24).send(events)
    }
    catch (e) {
      console.log(e)
      res.code(500).send({error: e.message})
    }
  })

  next()
}