"use strict";

import  fastify from 'fastify';
import {Server, IncomingMessage, ServerResponse} from 'http';
import { Http2Server, Http2ServerRequest, Http2ServerResponse } from 'http2';
import {authPlugin} from './plugins/auth';
import swagger from 'fastify-swagger';

const opts: fastify.RouteShorthandOptions = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            pong: {
              type: 'string'
            }
          }
        }
      }
    }
  };


class RestServer  {


    private server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({});
    private host: string;
    private port: number;
    private useSSL: boolean;
    private sslCert: string;
    private sslKey: string;
    private useHttp2: boolean;
    private opts: object;
  

    constructor(host="", port=3000) {

        this.opts = opts;
        this.host = host;
        this.port = port;
        this.server = fastify({ logger:true});
        this.registerDefaultPlugins();
        this.initAuthenticationDecorator();
        this.initHeartBeatRoute();
      
    }

    registerDefaultPlugins() {

        this.server.register(swagger, {
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
        
        this.server.register(require('fastify-jwt'), {secret: 'secret hidden here'});

    }

    initAuthenticationDecorator() {
       this.server.register(authPlugin);
    }

    initHeartBeatRoute() {
        const fs = require('fs');
        const json = fs.readFileSync('./src/rest/default_routes.json');
        const parsed = JSON.parse(json);
        this.server.get('/',  (req, reply) => {

            reply.code(200).send({status: 'server is online'})

        });
    }


    start() {
        this.server.listen(this.port, err => {
            if(err) throw err;
            console.log(`api listening on ${this.port}`);
        });
    }


}

export default RestServer;