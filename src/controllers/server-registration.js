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
const registrationService = require('../services/servers')

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

const controller = async (event, context) => {
  return registrationService.registerOnPremiseServer(event.body)
}

exports.controller = middleware.run(controller, inputSchema)
