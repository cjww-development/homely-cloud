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

var dbm
var type
var seed

exports.setup = (options, seedLink) => {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
}

exports.up = db => {
  return db.createTable('registered_services', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    external_ip: { type: 'string', notNull: true, unique: true },
    internal_ip: { type: 'string', notNull: true },
    owner: { type: 'string', notNull: true },
    created_at: { type: 'timestamp', notNull: true, defaultValue: String('CURRENT_TIMESTAMP') },
  });
};

exports.down = db => {
  return db.dropTable('registered-services');
};

exports._meta = {
  version: 1,
};