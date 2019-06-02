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


import Input from './input';
import Output from './output';
import { List } from 'immutable';
import Hashing from '../common/hashing';

const COINBASE_ADDRESS = process.env.COINBASE_ADDRESS;

class Transaction {

    public readonly type: "coinbase" | "currency" | "regular_ledger" | "reward" | "post_data" | "ai_data_address" | "wallet_creation" | "fee";
    public static readonly timestamp:number = Date.now();
    public readonly inputs: List<Input>;
    public readonly outputs: List<Output>;
    public static readonly reward: number = 100;



    constructor(
        type: "coinbase" | "currency" | "regular_ledger" | "reward" | "post_data" | "ai_data_address" | "wallet_creation" | "fee",
        inputs: List<Input>,
        outputs: List<Output>

    ) {


        this.type = type;
        this.inputs = inputs;
        this.outputs = outputs;

    }

    get hash() {
        const inputs = JSON.stringify(this.inputs.toJS());
        const outputs = JSON.stringify(this.outputs.toJS());
        return new Hashing("sha3-512", Buffer.from(this.type+this.inputs+this.outputs), true);
    }

    get inputTotal(): number {
        return this.inputs.reduce((total, input) => total + input.amount, 0);
    }

    get outputTotal(): number {
        return this.outputs.reduce((total, output) => total + output.amount, 0);
    }

    get fee(): number {
        if(this.type === "currency") {
            return this.inputTotal - this.outputTotal;
        } else {
            throw `Transaction type ${this.type} does not have fees`
        }
    }

    isInputsMoreThanOutputs() {
        const inputTotal = this.inputTotal;
        const outputTotal = this.outputTotal;
        if(inputTotal < outputTotal) {
            throw `Insufficient balance to complete this transaction`;
        }
    }

    hasSameInput(tx): boolean {
        return tx.inputs.some(input => this.inputs.some(i => i.equals(input)));
    }

    verifyInputSignatures() {
        try {
            this.inputs.forEach(input => input.verifySignature());
        } catch (err) {
            throw err;
        }
    }

    isValidTransaction(): boolean {
        try {
            this.isInputsMoreThanOutputs();
            this.verifyInputSignatures();
            return true;
        } catch(err) {
            throw err;
        }
    }

    equals(tx): boolean {
        return (
            this.type === tx.type &&
            this.inputs.equals(tx.inputs) &&
            this.outputs.equals(tx.outputs) &&
            this.hash === tx.hash
        );
    }

    feeTransaction(address: string) {
        const inputTotal = this.inputTotal;
        const outputTotal = this.outputTotal;
        if(inputTotal > outputTotal) {
            const fee = inputTotal - outputTotal;
            const outputs: List<Output> = List([{address, amount: fee, data:null}])
            return new Transaction("fee", List(), outputs);
        } else {
            throw `No fees for transaction`;
        }
    }

    static rewardTransaction(address: string) {
        const outputs: List<Output> = List([
            {address, amount: Transaction.reward, data:null}
        ]);
        return new Transaction("reward", List(), outputs);
    }


    static createCoinbaseTransaction(address: string, amount: number, data: string) {


        const outputs: List<Output> = List([
            {address, amount: amount, data:data}
        ]);
        return new Transaction("coinbase", List(), outputs);


    };


    regularLedgerOperations = () => {

    };

    newPostData = () => {

    };

    newAIDataAddress = () => {

    };

    newWalletCreated = () => {

    };

    static fromJS(json) {
        const inputs: List<Input> = List(json.inputs.map(input => Input.fromJS(input)))
        const outputs: List<Output> = List(json.outputs);
        return new Transaction(json.type, inputs, outputs);
    }



}

export default Transaction;