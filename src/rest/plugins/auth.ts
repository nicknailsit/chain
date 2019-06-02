import fp from 'fastify-plugin';

export const authPlugin = (async function(fastify, opts) {

fastify.register(require("fastify-jwt"), {secret: 'secrethere'});

fastify.decorate("authenticate", async function(request, reply) {
    try {
        await request.jwtVerify();
    } catch(err) {
        reply.send(err);
    }
});

});