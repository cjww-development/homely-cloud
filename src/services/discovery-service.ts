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

import { registeredServerCollection } from '../database/firestore'
import { RegisteredServer } from '../models/registered-server'
import { logger } from '../lib/logger'
import { v4 as uuidv4 } from 'uuid'

const registerOnPremise = (server: RegisteredServer): Promise<boolean> => {
  const serverId: string = `server-id-${uuidv4()}`
  return registeredServerCollection
    .doc(serverId)
    .create(server)
    .then(wr => {
      logger.info(`[registerOnPremise] - Registered new server against serverId ${serverId}`)
      return !!wr.writeTime
    }).catch(e => {
      logger.warn(`[registerOnPremise] - There was a problem registering the server against serverId ${serverId}`)
      logger.warn(e.message)
      return false
    })
}

const linkOwner = (owner: string, externalIP: string): Promise<boolean> => {
  return registeredServerCollection
    .where("externalIP", "==", externalIP)
    .get()
    .then(querySnapshot => {
      if(querySnapshot.size === 1) {
        const doc = querySnapshot.docs[0]
        return registeredServerCollection
          .doc(doc.id)
          .update({ owner })
          .then(wr => {
            logger.info(`[linkOwner] - Updated owner of server ${doc.id}`)
            return !!wr.writeTime
          }).catch(e => {
            logger.warn(`[linkOwner] - There was a problem updating the owner of serverId ${doc.id}`)
            logger.warn(e.message)
            return false
          })
      } else {
        logger.warn('[linkOwner] - Could not find a matching registered server')
        return false
      }
    })
}

const discoveryService = {
  registerOnPremise,
  linkOwner
}

export default discoveryService
