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

import Networking from "../network/node";
import sock from "../zmq/pullWorker";
import {sendWork} from "../zmq/pushServer";

class Setup {

    private p2pListener: Networking;
    private p2pClient;
    private zmqWorker;
    private dbConn;
    private fileSystemState: boolean = false;
    private zmqState: boolean = false;
    private p2pState: boolean = false;
    private dbState: boolean = false;
    private localWallet;
    private walletState: 'locked' | 'unlocked' = 'locked';

    constructor(opts = {}) {


        this.fileSystemState = false;
        this.zmqState = false;
        this.p2pState = false;
        this.dbState = false;

    }

    setupLocalFileSystem = () => {

        this.fileSystemState = true;

    };


    setupP2PConnection = () => {

        try {
            this.p2pListener = new Networking();
            this.p2pClient = Networking.createNewClient();

        } catch (err) {
            throw err;
        }

        this.p2pState = true;


    };

    setupZMQ = () => {

        try {
            this.zmqWorker = sock;
            sendWork('connect', 0);
        } catch (err) {
            throw err;
        }

        this.zmqState = true;

    };

    setupDatabaseConnection = (dbType: 'redis' | 'mongodb' | 'filesystem') => {


        this.dbState = true;

    };

    loadLocalWallet = () => {

    };


}