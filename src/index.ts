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


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


if (env_variables.error) {
    throw Error('cannot find environment variables files');
}

let _MODE = "";

if (process.env.DEV_VERSION === 'true') {
    _MODE = "DEV";
} else if (process.env.LIVE_VERSION === 'true') {
    _MODE = "LIVE";
} else if (process.env.TEST_VERSION === 'true') {
    _MODE = "TEST"
}

//display mode
let PrivKey = '';

let walletAlias = "";

new Chain();

waterfall([
    function (callback) {
        console.info("The Swaggit Blockchain will start in %s Mode, press CTRL-C or CTRL-Z to abort.", _MODE);
        callback(null, true);
    },
    function (arg1, callback) {
        fs.readFile(process.env.NETWORK_PRIV_KEY, function (err, file) {

            if (err) callback(Error('there is no readable PEM file for network private key. Have you initialized a new keypair?'), null);

            PrivKey = file.toString();


        });

        let PubKey = '';

        fs.readFile(process.env.NETWORK_PRIV_KEY, function (err, file) {

            if (err) callback(Error('there is no readable PEM file for network public key. Have you initialized a new keypair?'), null);

            PubKey = file.toString();


            // all ok keys are loaded
            //console.info('network keys are loaded...');
        });

        callback(null, {pub: PubKey, priv: PrivKey});
    },
    function (arg1, callback) {

        rl.question("\n\nWe couldn't find any wallet files, do you wish to generate a new wallet? (Y/N)", function (answer) {

            if (answer === "Y" || answer === "N") {
                switch (answer) {
                    case "Y": {
                        const userWalletAddress = createWalletAddress();
                        console.info('\n\nHere are the info about your new Swaggit wallet! Make sure to write it down some place safe!');
                        console.info('-----------------------------------------------------------');
                        console.info("Your Wallet Address: %s", userWalletAddress.address);

                        console.info("Your secret key (DO NOT SHARE IT IN ANY CASE!): %s ", userWalletAddress.privKey);

                        fs.writeFileSync(process.env.WALLET_PATH + "swagg_wallet.dat", JSON.stringify(userWalletAddress), "binary");
                        lockFile(process.env.WALLET_PATH + "swagg_wallet.dat", PrivKey);

                        console.info("-----------------------------------------------------------");


                        if (userWalletAddress) {

                            rl.question("\n\nPick a friendly name for your address alias. \nThat is the name you will give people you want to receive SWAGGS from: ", function (answer) {

                                console.info('-----------------------------------------------------------');
                                console.info('Congratulation you can now receive SWAGGS ! Welcome aboard %s !', answer);
                                walletAlias = answer;
                            });

                        }
                        break;
                    }
                    case "N": {
                        process.exit(1);
                        break;
                    }
                    default: {
                        process.exit(1);
                    }
                }
            }

        });
        return callback(null, 'done');
    }
], function (err, result) {

    if (err) throw err;

    console.log(result);

});
