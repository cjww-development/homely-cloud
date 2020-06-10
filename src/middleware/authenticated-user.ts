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

import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import jwt from 'jsonwebtoken'
import { logger } from '../lib/logger'
import { buildResponse } from '../models/ApiResponse'

const getEventAuth = (event: APIGatewayEvent) => {
  if (!event || !event.headers) {
    logger.warn('[getEventAuth] - Request contains no headers')
    return null;
  }

  const { Authorization: authHeader } = event.headers;
  if (!authHeader) {
    logger.warn('[getEventAuth] - Request contains no Authorisation header')
    return null;
  }

  const token: any = jwt.decode(authHeader.replace('Bearer ', ''));
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

export const authenticatedUser = (requiresAuth: boolean) => {
  const errorResponse: APIGatewayProxyResult = { statusCode: 403, body: JSON.stringify({ message: 'Not authenticated' }) }
  return {
    before: (handler: any, next: any) => {
      if(requiresAuth) {
        const auth = getEventAuth(handler.event);
        if (!auth) {
          const response = buildResponse(handler.event, handler.context, errorResponse)
          handler.callback(null, response)
        }
        handler.event.auth = auth;
      }
      return next();
    }
  }
}
