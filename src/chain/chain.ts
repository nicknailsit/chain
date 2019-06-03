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
import {Serialize} from '../common/serializer';

const merkle = require('merklie');
const treeOptions = {
    hashType: 'sha3-512'
};


class Chain {

    private readonly chainID;
    private blocks = [];
    private readonly keys;
    private readonly genesisData;
    private chainLength;
    private remoteChain;
    private p2pListener;
    private p2pClient;
    private zmqWorker;
    private merkleTree;
    private merkleRoot;

    constructor(keys = [], opts = {}, Blocks = [], devMode = true) {


        if (devMode === true) {
            this.chainID = process.env.DEV_CHAIN_ID;
        }


        if (Blocks.length <= 0) {

            this.merkleTree = new merkle(treeOptions);

            const gFile = 'genesis.json';
            const genesisData = fs.readFileSync('./' + gFile).toString();
            this.genesisData = JSON.parse(genesisData);


            this.createGenesisBlock();


        } else {

            this.blocks = Blocks;

        }

        this.numBlocks = this.blocks.length;

    }

    get numBlocks() {
        return this.chainLength;
    }

    set numBlocks(length) {
        this.chainLength = length;
    }

    createGenesisBlock = () => {

        const block = new Block(this.genesisData.chainID, this.genesisData.index, this.genesisData.difficulty, this.genesisData.reward, this.genesisData.hash, this.genesisData.payload);


        const firstHash = block.payload["blockhash"];

        this.merkleTree.addLeaf(this.genesisData.hash);
        this.merkleTree.addLeaf(firstHash);

        this.merkleTree.makeTree();

        this.merkleRoot = this.merkleTree.getMerkleRoot();

        block.merkleRoot = this.merkleRoot;

        this.blocks.push(block);

        console.log('created genesis block');


    };

    getBlocks = () => {


        //request new blockchain from peers


    };


}

export default Chain;