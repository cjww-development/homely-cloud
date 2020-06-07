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

const AWS = require('aws-sdk')
const ssm = new AWS.SSM({ region: 'eu-west-2' })
const logger = require('../lib/logger')

let config;

module.exports = async parameter => {
  if(config) {
    logger.info('[secrets-loader] - Returning cached config')
    return config
  }
  logger.info('[secrets-loader] - Fetching config from ssm')
  return ssm.getParameter({ Name: parameter, WithDecryption: true }, (err, data) => {
    if(err) {
      console.log(err, err.stack)
      return config
    } else {
      console.log(JSON.stringify(data))
      console.log(data)
      config = data
      return config
    }
  })
}