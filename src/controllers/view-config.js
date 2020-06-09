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

const middleware = require('../middleware')
const AWS = require('aws-sdk')
const ssm = new AWS.SSM({ region: 'eu-west-2' })

const controller = async (event, context) => {
  return ssm.getParameter({ Name: 'RDSDev', WithDecryption: true }).send((err, data) => {
    console.log(JSON.stringify(data))
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  })
}

exports.controller = middleware.run(controller, {  })
