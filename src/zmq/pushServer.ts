'use strict';

import zmq from 'zeromq';

const sock = zmq.socket('push');

sock.bindSync('tcp://127.0.0.1:5001');
console.log('producer is bound to port 5001');

export const sendWork = (work, intervalTime) => {

    setInterval(function() {
        console.log('sending work... %s', work);
        sock.send(work);
    }, intervalTime)

};