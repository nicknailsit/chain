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

import Block from './block';
import Networking from '../network/node';
import fs from 'fs';
import sock from '../zmq/pullWorker';
import {sendWork} from '../zmq/pushServer';


class Chain {

    private readonly chainID;
    private blocks;
    private readonly keys;
    private readonly genesisData;
    private  chainLength;
    private remoteChain;
    private p2pListener;
    private p2pClient;
    private zmqWorker;

    constructor(keys, opts={}, Blocks = [], devMode=true) {


        if(devMode === true) {
            this.chainID = process.env.DEV_CHAIN_ID;
        }

        if(Blocks.length <= 0) {
            const gFile = process.env.CHAIN_BLOCK_GENESIS_JSON;
            let genesisData = this.genesisData;
            fs.readFile('./src' + gFile, function (err, file) {

                if (err) throw err;
                genesisData = file;

            });
            this.genesisData = genesisData;

            this.blocks = this.getBlocks()
        } else {

            this.blocks = Blocks;

        }

        this.numBlocks = this.blocks.length;

    }






    getBlocks = () => {


        //request new blockchain from peers



    };

    set numBlocks(length) {
        this.chainLength = length;
    }

    get numBlocks() {
        return this.chainLength;
    }


}

export default Chain;