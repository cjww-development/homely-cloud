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

const middy = require('@middy/core')
const jsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const validator = require('@middy/validator')
const eventLoop = require('@middy/do-not-wait-for-empty-event-loop')
const { apiResponse } = require('./api-response')
const { authenticatedUser } = require('./authenticated-user')

const runMiddleware = (controller, inputSchema, requiresAuth = false) => {
  return middy(controller)
    .use(eventLoop())
    .use(jsonBodyParser())
    .use(validator({ inputSchema }))
    .use(apiResponse())
    .use(httpErrorHandler())
    .use(authenticatedUser(requiresAuth))
}

exports.run = runMiddleware
