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

const getParam = async () => {
  const params = {
    Name: 'RDSDev',
    WithDecryption: true
  }

  const fetchedParameter = await ssm.getParameter(params).promise()
  return fetchedParameter.Parameter.Value
}

const controller = async (event, context) => {
  const value = await getParam()
  return {
    statusCode: 200,
    body: JSON.stringify(value)
  }
}

exports.controller = middleware.run(controller, {  })
