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

import {EventEmitter} from 'events';
import {DEFAULT_NODE_SERVER_OPTS} from "./constants";
import dgram from 'dgram';
import msgpack from 'msgpack';


class Node extends EventEmitter {


    private authChannel: boolean;
    private server;
    private client;
    private socket;
    private peers = [];
    private numPeers = 0;

    constructor(serverOpts=DEFAULT_NODE_SERVER_OPTS, Port: number = 5002) {
        super();

        let sock = this.socket;
        this.authChannel = false;

        this.server = dgram.createSocket('udp4');


      this.listen();

      this.server.on('message',  (message, remote)=> {
          const msg = this.unpackMessage(message);

          console.log(remote.address + ':' + remote.port +' - ' + JSON.stringify(msg));

      });


      this.server.bind(5002, '127.0.0.1');


    }

    listen = () => {

        this.server.on('listening', () => {

            console.info("node listening on host: "+this.server.address().address+" port "+this.server.address().port);
        });

        this.server.on('connection', (peer) => {


            const host = peer.remoteAddress;
            const port = peer.remotePort;
            this.peers.push({host: host, port: port});
            this.numPeers = this.peers.length;
            console.log(this.peers);

            this.sendHandshakeToNode(peer);

        });




    };

    sendHandshakeToNode = (peer) => {

        //will send mock info for now
        peer.emit('{"network_id":"1","swagg_address":"0x0fffff", services_available:[{"test":"true"}]}');

    };

    get numConnections() {
        return new Promise((resolve, reject) => {
            this.server.getConnections(function(err, count) {
                if(err) {
                    reject(err);
                } else {
                    resolve(count);
                }
            })
        })
    }


    packMessage = (message) => {

        return msgpack.pack(message);

    };

    unpackMessage = (message) => {
        return msgpack.unpack(message);
    };

    static createNewClient()  {
        return dgram.createSocket('udp4');
    };

    sendMessage = (client, message) => {

        const msg = this.packMessage(message);
        client.send(msg, 0, msg.length, 5002, '127.0.0.1', function(err, bytes) {
            if(err) throw err;
            console.log('UDP message sent to 127.0.0.1:5002');
            client.close();
        }  )

    };



}

export default Node;