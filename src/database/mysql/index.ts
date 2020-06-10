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

const dbConfig = require('../../../database.json')
import { logger } from '../../lib/logger'
import mysql from 'mysql'
import { getParameter } from '../../lib/secrets-loader'

const serverlessMysql = require('serverless-mysql')({
  backoff: 'decorrelated',
  base: 5,
  cap: 200
})

const superQueryFunction = serverlessMysql.query.bind(serverlessMysql)
const superConfigFunction = serverlessMysql.config.bind(serverlessMysql)

let configLoaded = false

const setConfiguration = async () => {
  const env = process.env.NODE_ENV || 'local'
  let config = dbConfig[env]
  if(config.sm) {
    config = await getParameter(`RDS${env}`)
  }
  superConfigFunction(config)
  configLoaded = true
};

serverlessMysql.checkConnection = async () => {
  try {
    await serverlessMysql.query('select now()');
    logger.info('[checkConnection] - Successfully connected to database')
    return true
  } catch (e) {
    logger.error('[checkConnection] - There was a problem connecting to the database')
    await serverlessMysql.quit()
    await serverlessMysql.connect()
    return false
  }
}

serverlessMysql.query = async (...args: any[]) => {
  if (!configLoaded) {
    logger.debug('[query] - Configuration not found')
    await setConfiguration()
    logger.debug('[query] - Configuration set')
  }
  logger.debug('[query] - Running a query', ...args)
  return superQueryFunction(...args)
};

serverlessMysql.format = (stmt: string, values: any[]) => {
  return mysql.format(stmt, values);
};

export default serverlessMysql
