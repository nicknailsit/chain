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
import * as fs from "fs";

/**
 * @description chaincontroller.ts
 *
 * @purpose main file that initialize and control the swaggchain multiverse
 *
 *  WARNING :::: DO NOT EDIT UNLESS AUTHORIZED
 *
 */

//initialize configuration load .env file
require('dotenv').config();

const config = require('./config.default.ts');

let DB, genesisBlockData;

// USE DEFAULT NEDB
if(config.useDefaultDB === true || process.env.DATABASE_TYPE === "nedb" || process.env.DATABASE_TYPE === "") {
    DB = require('./database/memory/adapter');
}

// USE MONGODB
if((config.useDefaultDB === false && config.useMongoDB === true) || (process.env.DATABASE_TYPE === "mongodb")) {
    DB = require('./database/mongodb/adapter');
}


if(fs.existsSync('./genesis.json')) {
    genesisBlockData = fs.readFileSync('./genesis.json');
} else {
    genesisBlockData = null;
}

export const InitSwaggchain = (DB, genesisBlockData, options = {}) => {

    const db = new DB(); //initialize database

    /** @dev create account if none found (wallet) **/


    ////////////////// code goes here ////////////////////




    /** @dev initialize network (p2p, nsq, rest) **/


    ////////////////// code goes here ////////////////////




    /** @dev check if chain data available on the network **/


    ////////////////// code goes here ////////////////////



    /** @dev if yes, start downloading it **/


    ////////////////// code goes here ////////////////////





};