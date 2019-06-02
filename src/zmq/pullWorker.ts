'use strict';

import zmq from 'zeromq';

const sock = zmq.socket('pull');

sock.connect('tcp://127.0.0.1:5001');
console.log('pull worker connected on port 5001');

sock.on('message', function(msg) {
    console.log('work: %s', msg.toString());
});

export default sock;