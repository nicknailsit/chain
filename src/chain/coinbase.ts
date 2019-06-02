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

    constructor(chainID) {

    }

}

export default Coinbase;