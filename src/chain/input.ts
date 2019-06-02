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

const EC = require('elliptic').ec;
const ec = new EC("secp256k1");
import Hashing from '../common/hashing';


class Input {
    public readonly txID:string;
    public readonly txHash:string;
    public readonly txIndex:number;
    public readonly txType:string;
    public readonly amount:number;
    public readonly address:string;
    public readonly payload:string;
    private _signature:string;

    constructor(
        txID:string,
        txHash:string,
        txIndex:number,
        txType: string,
        amount:number,
        address:string,
        payload?:string,
        signature?:string
    ) {

        this.txID = txID;
        this.txHash = txHash;
        this.txIndex = txIndex;
        this.txType = txType;
        this.amount = amount;
        this.address = address;
        if(payload) this.payload = payload;
        if(signature) this._signature = signature;

    }

    get signature() {
        return this._signature;
    }

    get hash():string {
        const hash = new Hashing("sha3-512",Buffer.from(this.txHash + this.txID + this.txIndex + this.amount + this.address), true);
        return hash.toString();
    }

    sign(secretKey) {
        const key = ec.keyFromPrivate(secretKey);
        const signature = key.sign(this.hash);
        this._signature = signature.toDER();
    }

    verifySignature() {
        const inputHash = new Hashing("sha3-512",Buffer.from(this.txHash + this.txID + this.txIndex + this.amount + this.address), true);
        const key = ec.keyFromPublic(this.address, "hex");
        if(!key.verify(inputHash, this.signature)) {
            throw `Input ${this} has wrong signature`;
        }
    }

    equals(input: Input): boolean {
        return (
            this.txID === input.txID &&
            this.txHash === input.txHash &&
            this.txIndex === input.txIndex &&
            this.txType === input.txType &&
            this.amount === input.amount &&
            this.address === input.address
        );
    }

    hashCode(input: Input): number {
        return parseInt(String(parseInt(this.hash, 10)), 32);
    }

    static fromJS(json): Input {
        const {txID, txIndex, txHash, txType, amount, address, payload, _signature} = json;
        const input = new Input(txID, txHash, txIndex, txType, amount, address, payload, _signature);
        return input;
    }
}

export default Input;