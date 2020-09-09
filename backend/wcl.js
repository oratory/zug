const { GraphQLClient } = require('graphql-request')
global.Headers = require('cross-fetch').Headers // work around for headers bug https://github.com/prisma-labs/graphql-request/issues/206
const base64 = require('base-64')
const md5 = require('md5')
const fetch = require('node-fetch')
const redis = require('./redis')

const wcl = {
  expires: 0,
  client: null
}
async function makeGQLClient() {
  const data = await fetch('https://classic.warcraftlogs.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${base64.encode(`${config.wcl.id}:${config.wcl.secret}`)}`
    },
    body: JSON.stringify({grant_type: 'client_credentials'})
  })
  const json = await data.json()
  if (json && json.access_token) {
    wcl.expires = Date.now() + json.expires_in * 1000
    wcl.client = new GraphQLClient('https://classic.warcraftlogs.com/api/v2/client')
    wcl.client.setHeader('Authorization', `Bearer ${json.access_token}`)
    return true
  }
}

module.exports = {
  query: async function (query, opts={}) {
    try {
      const key = 'wcl:' + md5(query + JSON.stringify(opts.vars))
      var data
      if (!opts.skipCache) {
        data = await redis.get(key)
        if (data && (!opts.ttl || Date.now() - opts.ttl > data.fetched)) {
          return data
        }
      }
      if (wcl.expires < Date.now()) {
        if (!await makeGQLClient()) {
          throw 'Could not create GraphQL client'
        }
      }
      data = await wcl.client.request(query, opts.vars)
      data.timestamp = Date.now()

      redis.set(key, data)
      return data
    }
    catch (e) {
      console.log(e)
      return {}
    }
  }

}

/*
damage event hitType
var cMissDamageEventType = 0
var cHitDamageEventType = 1
var cCritDamageEventType = 2
var cAbsorbDamageEventType = 3
var cBlockDamageEventType = 4
var cBlockCritDamageEventType = 5
var cGlancingDamageEventType = 6
var cDodgeDamageEventType = 7
var cParryDamageEventType = 8
var cDeflectDamageEventType = 9
var cImmuneDamageEventType = 10
var cMisfireDamageEventType = 11
var cReflectDamageEventType = 12
var cEvadeDamageEventType = 13
var cResistDamageEventType = 14
var cCrushingDamageEventType = 15
var cPartialResistDamageEventType = 16
var cPartialResistCritDamageEventType = 17
*/