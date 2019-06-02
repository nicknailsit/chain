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

//the coinbase is like a decentralized Bank that carries the coins of the chain with many vital information to avoid abuses, forgery and manipulation

import Coinbase from './coinbase';
import * as fs from "fs";
import Hashing from "../common/hashing";
import crypto from 'crypto';

export interface Coin {


    serialNumber: string;
    readonly mintable: boolean;
    readonly transferable: boolean;
    mintedOn: string;
    mintedBy: string;
    readonly inBlockIndex: number;
    readonly currencyName: string;
    readonly chainID: string;
    readonly divisible: boolean;
    readonly divisor: number;
    nonce: number;
    coinHash: string;
    signature: string;
    readonly value: number;
    readonly maxAvailable: number;
    currentOwners: Array<any>;
    coinbase: Coinbase;


}


class Currency implements Coin {

    serialNumber: string;
    readonly mintable: boolean;
    readonly transferable: boolean;
    mintedOn: string;
    mintedBy: string;
    readonly inBlockIndex: number;
    readonly currencyName: string;
    readonly chainID: string;
    readonly divisible: boolean;
    readonly divisor: number;
    nonce: number;
    coinHash: string;
    signature: string;
    readonly value: number;
    readonly maxAvailable: number;
    currentOwners: Array<any>;
    coinbase: Coinbase;
    createdOn: number;

    constructor(newCoin: boolean = true, chainID, coinbase, blockIndex,
                currencyName, mintable,
                divisible, divisor, maxAvailable,
                transferable: boolean = true,
                value: number = 1
    ) {

        this.chainID = chainID;
        this.inBlockIndex = blockIndex;
        this.currencyName = currencyName;
        this.mintable = mintable;
        this.divisible = divisible;
        this.divisor = divisor;
        this.value = value;
        this.transferable = transferable;
        this.maxAvailable = maxAvailable;
        this.coinbase = coinbase;

        if (newCoin !== false) {
            this.forgeNewCoin();
        }

    }

    static verifyExistingCoin(coin: Coin): boolean {

        return Currency.verifyCoinSignature(coin.serialNumber, coin.signature, coin.coinbase);

    }

    static verifyCoinSignature = (serial, signature, coinbase) => {
        const verify = crypto.createVerify('SHA256');
        verify.write(serial);
        return verify.verify(coinbase.keys["public"], signature);

    };

    static markAsMinted(coin, address, nonce, hash, coinbase) {
        coin.mintedOn = Date.now();
        coin.nonce = nonce;
        coin.coinHash = hash;
        coin.mintedBy = address;
        coin.transferable = true;
        coinbase.coins.push(coin);
        coinbase.coins_minted++;
        coinbase.last_coin_serial = coin.serialNumber;
    }

    protected createSerialNumber = () => {

        const chainID = Buffer.from(this.chainID);
        const coinbaseLicense = Buffer.from(this.coinbase.licenseID);
        const currencyName = Buffer.from(this.currencyName);
        const chainKey = fs.readFileSync(process.env.NETWORK_PRIV_KEY);

        const buf = Buffer.alloc(chainID.length + coinbaseLicense.length + currencyName.length, 0);
        chainID.copy(buf, 0, 0);
        coinbaseLicense.copy(buf, chainID.length - 1, 0);
        currencyName.copy(buf, chainID.length + coinbaseLicense.length - 1, 0);

        const hash = new Hashing("sha3-384", buf, true, true);
        this.serialNumber = hash.toString();
        this.signSerial(this.coinbase.keys["private"], hash);

    };

    protected signSerial = (key, serial) => {

        const sign = crypto.createSign('SHA256');
        sign.write(serial);
        sign.end();
        this.signature = sign.sign(key, 'hex');

    };

    private forgeNewCoin = () => {

        return {
            serialNumber: this.createSerialNumber(),
            signature: this.signature,
            currencyName: this.currencyName,
            coinbase: this.coinbase.licenseID,
            mintedOn: "",
            mintedBy: "",
            createdOn: Date.now(),
            value: this.value,
            status: 1, // 1 = unminted 2 = minted 0 = inactive
            transferable: false, //non transferable until minted
            divisible: this.divisible,
            smallest_unit: (1 / this.divisor)
        };


    };

}

export default Currency;