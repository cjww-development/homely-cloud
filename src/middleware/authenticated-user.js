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

const jwt = require('jsonwebtoken');
const logger = require('../lib/logger')
const apiResponse = require('./api-response')

const getEventAuth = event => {
  if (!event || !event.headers) {
    logger.warn('[getEventAuth] - Request contains no headers')
    return null;
  }

  const { Authorization: authHeader } = event.headers;
  if (!authHeader) {
    logger.warn('[getEventAuth] - Request contains no Authorisation header')
    return null;
  }

  const token = jwt.decode(authHeader.replace('Bearer ', ''));
  if (token === null) {
    logger.warn('[getEventAuth] - There was a problem decoding the Authorisation token')
    return null;
  }

  return {
    email: token.email,
    cognitoUsername: token.sub,
    token,
    rawToken: authHeader,
  };
};

const authenticatedUser = (requiresAuth) => {
  const errorResponse = { statusCode: 403, body: { message: 'Not authenticated' } }
  return {
    before: (handler, next) => {
      if(requiresAuth) {
        const auth = getEventAuth(handler.event);
        if (!auth) {
          const response = apiResponse.build(errorResponse, handler.event, handler.context)
          handler.callback(null, response)
        }
        handler.event.auth = auth;
      }
      return next();
    }
  }
}

module.exports = { authenticatedUser };

