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

import { formatISO } from 'date-fns'
import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda'

export interface ApiResponse {
  uri: string,
  method: string,
  status: number,
  body: any,
  stats: {
    requestCompletedAt: string,
    requestId: string
  }
}

export const buildResponse = (event: APIGatewayEvent, ctx: Context, result: APIGatewayProxyResult): ApiResponse => {
   return {
     uri: event.resource,
     method: event.httpMethod,
     status: result.statusCode,
     body: result.body,
     stats: {
       requestCompletedAt: formatISO(Date.now()),
       requestId: ctx.awsRequestId
     }
   }
}