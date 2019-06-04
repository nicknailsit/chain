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

/**
 * SWAGGCHAIN DEFAULT CONFIGURATION FILE FOR v 0.0.1 (very alpha!)
 *
 * WARNING FROM THE CRYPT: IF YOU DO NOT KNOW WHAT IT DOES, DON'T CHANGE IT !
 *
 * COMMON SENSE ADVISORY:
 *
 * DO NOT USE THIS SOFTWARE IN THE CURRENT STAGE. THIS IS INTENDED FOR DEVELOPERS ONLY
 * AND VERY EARLY ADOPTERS.
 *
 * IT IS ABSOLUTELY NOT SAFE TO RUN ON YOUR MACHINE.
 *
 * WAIT UNTIL PUBLIC ANOUNCEMENT IS MADE FOR THE BETA RELEASE, BEFORE USING IT.
 *
 * IF YOU MAKE THE WHOLE BLOCK EXPLOSE... WE WARNED YOU! :)
 *
 */

//main client configuration file (if no .env) for use with non-mining / lite or offline clients

export let hasEnv = false; // set this to true to use the .env file

export let numCpus = ''; // will be autocalculated, if its wrong feel free to change it

export let maxCpu = 0; //if 0 = unlimited if you want to limit the number of cores the application is using, set this.

export let maxMemory = 4096; //change this in mb if you have less ram or if you want to use less or more of it

export let daemonize = false; //not implemented yet

export let useMongoDB = false; // to switch to the more performing mongodb, you need to have it installed on your machine to use it.

export let mongoDBConfigFile = './config.mongo.ts'; // make sure the data in that file is reflecting your mongodb setup!

export let useDefaultDB = true; // on slower machines or lite client you may want to use the default database (neDB) note: NOT COMPATIBLE FOR MINING OR FULL CHAIN CLIENT!

export let P2P_listenerPort = '55155'; // you can safely change this, if left blank it will use a random port

export let P2P_serverPort = '5001';// you can safely change this

export let ZeroMQPort = ''; //will use default port, change is not recommended

export let Anonymize = false; // will be implemented soon



// Chain and wallet let configuration

export const ChainMode = "dev"; // available options are: dev, test, local, live

export const ChainKeysDir = "./keychain/"; //change this if you want the chain to store its keys somewhere else, if you change this and the keys are not generated at runtime or you try to change the keys, you won't be able to connect.

export const ChainStorageDirectory = "./data/"+ChainMode+"/"; // you can also change this if you want to store chain data on an external drive per example (needs to be relative to the root of the drive)

export const enableLiteChain = false; // if enabled, advanced features won't work. However you will still be able to use your wallet let to send and receive Swaggs (SWG)

export const myMachineKeysDirectory = ""; // : !!!advanced users only!!!!

export const useExistingWallet = false; //if set to true it will look for a json file with your wallet let info in this directory (usually named wallet let.json) use this option to restore your existing wallet let

export const saveToAnExternalDevice = false; // : !!!advanced users only!!!! external devices or cold storage



// Developers only !!!

export const useTokens = false; //if you plan on creating your own tokens set this to true

export const useGraphql = false; //in developer mode this needs to be set to true as the main contract interpreter is using it

export const localOnly = false; // for local testing purposes with your own genesis.local.json file (see docs)

export const devServers = []; // to bootstrap the P2P development network







