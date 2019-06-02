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
import Transaction from "./transactions";
import Coin from "./coin";
import {v4 as uuid} from 'uuid';
import crypto from 'crypto';
import {machineId, machineIdSync} from 'node-machine-id';
import Hashing from '../common/hashing';
import {lockFile, unlockFile} from '../common/fs';
import fs from 'fs';

interface coinbase {

    chainID:string;
    address:string;
    licenseID:string; //acts like a bank license for the chain
    coins:Array<Coin>;
    completed_transactions:Array<Transaction>;
    pending_transactions:Array<Transaction>;
    rejected_transactions:Array<Transaction>;
    suspected_transactions:Array<Transaction>;
    coins_spent:number;
    coins_transfered:number;
    coins_minted:number;
    last_issuance_date:string;
    last_coin_hash:string;
    last_coin_serial:string;
    total_transactions_in:number;
    total_transactions_out:number;
    last_validators:Array<string>; // validators will be selected based on the trust level of the node.
    last_elected_comitee:Array<string>; //comitee will be 'elected' in a raft style based on age of account, proof of stake and other criterias.
    readonly keys:object;
    coin_merkle: any;


}

class Coinbase implements coinbase {

    chainID:string;
    address:string;
    licenseID:string; //acts like a bank license for the chain
    signature: string;
    coins:Array<Coin>;
    completed_transactions:Array<Transaction>;
    pending_transactions:Array<Transaction>;
    rejected_transactions:Array<Transaction>;
    suspected_transactions:Array<Transaction>;
    coins_spent:number;
    coins_transfered:number;
    coins_minted:number;
    last_issuance_date:string;
    last_coin_hash:string;
    last_coin_serial:string;
    total_transactions_in:number;
    total_transactions_out:number;
    last_validators:Array<string>;
    last_elected_comitee:Array<string>;
    readonly keys:object;
    coin_merkle:any;
    protected keyPair;

    constructor(chainID, passPhrase) {

        this.keyPair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        fs.writeFileSync('./.keychain/coinbase.key', this.keyPair["privateKey"]);
        fs.writeFileSync('./.keychain/coinbase.pem', this.keyPair["publicKey"]);
        fs.writeFileSync('./.keychain/coinbase.signature', this.signature);

        lockFile('./.keychain/coinbase.key', passPhrase);
        lockFile('./.keychain/coinbase.pem', passPhrase);


    }

    createLicenseID = () => {

        const created_on = Buffer.from(Date.now().toString(16));
        const uniqueID = Buffer.from(uuid());
        const originMachineID = Buffer.from(machineIdSync());

        const buf = Buffer.alloc(created_on.length+uniqueID.length+originMachineID.length);

        created_on.copy(buf, 0, 0);
        uniqueID.copy(buf, created_on.length, 0);
        originMachineID.copy(buf, created_on.length+uniqueID.length, 0);



        const license = new Hashing('sha3-256', buf.toString('hex'), true);
        this.signature = this.signCoinbase(license);

        this.licenseID = license.toString();


    };

    static validateLicenseID(passPhrase, licenseID) {

        const signature = fs.readFileSync('./.keychain/coinbase.signature').toString('hex');
        const pubKey = unlockFile('./.keychain/coinbase.pem', passPhrase).toString();
        const verify = crypto.createVerify('SHA256');
        verify.write(licenseID);
        return verify.verify(pubKey, signature);

    }

    signCoinbase = (data) => {

        const privateKey = this.keyPair["privateKey"];
        const sign = crypto.createSign('SHA256');
        sign.write(data);
        return sign.sign(privateKey, 'hex');
    }


}

export default Coinbase;