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

import { runMiddleware } from '../../middleware'
import {APIGatewayProxyResult} from 'aws-lambda'
import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy'
import config from '../../config'
import discoveryService from '../../services/discovery-service'
import {RegisteredServer} from '../../models/registered-server'

const inputSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      required: ['externalIP', 'internalIP'],
      properties: {
        externalIP: {
          type: 'string'
        },
        internalIP: {
          type: 'string'
        }
      }
    }
  }
}

const controller = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // const { externalIP, internalIP }: any = event.body
  //
  // const registeredServer: RegisteredServer = {
  //   externalIP,
  //   internalIP,
  //   createdAt: new Date()
  // }
  //
  // return discoveryService.registerOnPremise(registeredServer).then(registered => {
  //   if(registered) {
  //     return {
  //       statusCode: 200,
  //       body: JSON.stringify({
  //         msg: 'Server has been registered'
  //       })
  //     }
  //   } else {
  //     return {
  //       statusCode: 500,
  //       body: JSON.stringify({
  //         msg: 'There was a problem registering the server'
  //       })
  //     }
  //   }
  // })

  return {
    statusCode: 200,
    body: config.registeredServersCollection
  }
}

exports.controller = runMiddleware(controller, inputSchema)
