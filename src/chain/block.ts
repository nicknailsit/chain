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

import Transaction from './transactions';
import {List, Map} from 'immutable';
import {ADDRESS_TYPE_BLOCK, DEV_NETWORK, DEV_VERSION} from "../network/addresses";
import Hashing from '../common/hashing';
import crypto from 'crypto';


interface BlockInterface {

    chainID: string;
    height: number;
    index: number;

    signature: string;
    difficulty: number;
    reward: number;
    previousHash: string;
    hash: string;
    merkleRoot: any;
    transactions: List<Transaction>
    payload: any;

}

class Block implements BlockInterface {


    chainID: string;
    height: number;
    index: number;
    signature: string;
    difficulty: number;
    reward: number;
    previousHash: any;
    hash: string;
    merkleRoot: any;
    transactions: any;
    payload: any;
    private readonly bType: any;
    private readonly bVersion: any;
    private readonly bNet: any;
    private readonly blockHeader;


    constructor(chainID, blockIndex, difficulty, reward, prevHash = null, content, _MODE = "DEV") {


        this.chainID = chainID;
        this.height = 0;
        this.index = blockIndex;
        this.signature = "";
        this.difficulty = difficulty;
        this.reward = reward;
        this.previousHash = prevHash;
        this.hash = "";
        this.merkleRoot = null;
        this.transactions = [];

        this.bType = ADDRESS_TYPE_BLOCK;

        if (_MODE === "DEV") {

            this.bVersion = DEV_VERSION;
            this.bNet = DEV_NETWORK;

        }

        console.log(content);

        this.blockHeader = this.writeBlockHeader();

        this.payload = this.writeBlockPayload(this.blockHeader, Buffer.from(prevHash), Buffer.from(content));

        this.getRawBlock();


    };




    static parseBlock(block) {

        const blockHeader = block.blockBuffer.slice(0, 1024);
        const bType = blockHeader[0] + blockHeader[1];
        const bNet = blockHeader[2];
        const bVersion = blockHeader[3];
        const bTime = blockHeader.slice(4);


    }

    static writeBytes(buf, buffered, i) {


        for (const values of buffered.values()) {
            buf.writeInt16LE(values, i);
            i++;
        }

        return [i, buf];

    }


    //block buffer max size = 1024 byte

    getRawBlock = () => {

        return this.payload;

    };

    writeBlockPayload = (header: Buffer, prevHash: Buffer, content: Buffer) => {

        const hash = crypto.createHash('sha3-512').update(header.toString()).digest('hex');

        const buf = Buffer.alloc(header.length + prevHash.length + content.length, 0);



        let offset = 0;
        let buffer;

        header.copy(buf, 0, 0);
        prevHash.copy(buf, header.length+1, 0);
        content.copy(buf, header.length+prevHash.length+1, 0);

        return {
            blockBuffer: buf,
            blockSize: buf.length,
            blockhash: hash.toString(),
            blockalg: "sha3-512"
        }


    };

    //header max size 1024 byte
    writeBlockHeader = () => {

        const buf = Buffer.alloc(1024, 0);

        buf.writeInt16BE(this.bType, 0);
        buf.writeInt8(this.bNet, 2);
        buf.writeInt8(this.bVersion, 3);

        const timestamp = Date.now() / 1000;
        const time = Buffer.from(timestamp.toString(16));

        let i = 4;
        for (const values of time.values()) {
            buf.writeInt16LE(values, i);
            i++;
        }

        console.log('end index for time: %s', i);

        buf.writeInt16BE(0xff, i);
        i++;
        //block index
        const indexBuf = Buffer.from(`i+${this.index}`);
        for (const values of indexBuf.values()) {
            buf.writeInt16LE(values, i);
            i++;
        }

        console.log('end index for blockIndex: %s', i);

        if (this.previousHash !== null) {
            const preHash = Buffer.from(this.previousHash);
            for (const values of preHash.values()) {

                buf.writeInt16LE(values, i);
                i++;

            }
        }

        console.log('end index for prevHash: %s', i);

        buf.writeInt16BE(0xff, i);


        return buf;
    }


}

export default Block;