/*
 * Copyright 2020 CJWW Development
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const mysql = require('../database/mysql')
const logger = require('../lib/logger')

const registerOnPremiseServer = async (server) => {
  const { externalIP, internalIP } = server
  const found = await isServerRegistered(externalIP)
  if(found) {
    await updateServiceRecordWith(externalIP, 'internal_ip', internalIP)
  } else {
    await createServiceRecord(externalIP, internalIP, '')
  }

  await getServiceRecord(externalIP)
  return {
    statusCode: found ? 200 : 201,
    body: found ? 'Updated service record' : 'Created service record'
  }
}

const pairHome = async (server, userName) => {
  const { externalIP } = server
  const found = await isServerRegistered(externalIP)
  if(found) {
    await updateServiceRecordWith(externalIP, 'owner', userName)
    return {
      statusCode: 200,
      body: 'Updated service record'
    }
  } else {
    return {
      statusCode: 400,
      body: 'No registered servers on this external IP'
    }
  }
}

const isServerRegistered = async (ip) => {
  logger.info('[isServerRegistered] - Finding servers existence')
  const query = mysql.format(`select * from registered_services where external_ip = ?`, [ip])
  const result = await mysql.query(query)
  logger.info(`[isServerRegistered] - Found ${result.length} matching servers`)
  return result.length > 0
}

const updateServiceRecordWith = async (externalIP, key, value) => {
  logger.info(`[updateServiceRecordWith] - Update service record with ${key}`)
  const query = mysql.format(
    `update registered_services set ${key} = ? where external_ip = ?`,
    [value, externalIP]
  )
  await mysql.query(query)
}

const createServiceRecord = async (externalIP, internalIP, owner) => {
  logger.info('[createServiceRecord] - Creating new service record')
  const query = mysql.format(
    'insert into registered_services (external_ip, internal_ip, owner) values (?, ?, ?)',
    [externalIP, internalIP, owner]
  )
  await mysql.query(query)
}

const getServiceRecord = async (externalIP) => {
  logger.info(`[getServiceRecord] - Fetching service record`)
  const query = mysql.format(
    'select * from registered_services where external_ip = ?',
    [externalIP]
  )
  return mysql.query(query)
}

module.exports = {
  registerOnPremiseServer,
  pairHome
}
