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

import { runMiddleware } from '../middleware'
import AWS from 'aws-sdk'
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

const ssm: AWS.SSM = new AWS.SSM({ region: 'eu-west-2' })

// const getParam = async () => {
//   const params = {
//     Names: ['/Dev/RDS'],
//     WithDecryption: true
//   }
//
//   const fetchedParameter = await ssm.getParameters(params).promise()
//   return fetchedParameter.Parameters.map(param => param.Value)
// }

const controller = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: 'Hello from config'
  }
}

exports.controller = runMiddleware(controller, {  })
