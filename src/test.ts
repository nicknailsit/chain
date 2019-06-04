/*
 * Copyright (c) 2019. The Swaggit Network (www.swaggit.net)
 * Copyright (c) 2019. Nicolas Cloutier (nicknailers69@gmail.com)
 *
 *  This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

'use strict';

import {config} from 'dotenv';
import * as fs from 'fs';
import readline from 'readline';
import {createWalletAddress, getPublicKeyFromAddress, validateWalletAddress} from './network/addresses';
import {series, waterfall} from 'async';
import {lockFile} from "./common/fs";
import Chain from "./chain/chain";
const env_variables = config();

import MemoryDB from './database/memory/adapter';

const DB = new MemoryDB();
const collection = DB.getCollection('snapshots');
DB.insertData(collection, 'testing', function(err, res){

    if(err) throw err;
    console.log(res);

}); // test ok for database insert

