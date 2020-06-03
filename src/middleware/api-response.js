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

const { formatISO } = require('date-fns')

const build = (response, event, context) => {
  return {
    statusCode: response.statusCode,
    body: JSON.stringify({
      uri: event.resource,
      method: event.httpMethod,
      status: response.statusCode,
      body: response.body,
      stats: {
        requestCompletedAt: formatISO(Date.now()),
        requestId: context.awsRequestId
      }
    })
  }
}

const apiResponse = () => {
  return {
    after: (handler, next) => {
      handler.response = build(handler.response, handler.event, handler.context)
      next()
    }
  }
}

module.exports = {
  apiResponse,
  build
}
