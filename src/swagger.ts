'use strict';
import  fastify from 'fastify';
import {Server, IncomingMessage, ServerResponse} from 'http';
import swagger from 'fastify-swagger';
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2';

const server:fastify.FastifyInstance<Http2Server, Http2ServerRequest, Http2ServerResponse> = fastify({});

server.register(swagger, {
    swagger: {
        info: {
            title: "swaggit api",
            description: "swaggit api",
            version: "0.0.1"
        },
        host: "localhost",
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json']
    },
    exposeRoute: true
});

