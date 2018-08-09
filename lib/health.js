function register(server) {

    // Server is ready to receive traffic
    server.route({
        method: 'GET',
        path: '/api/health/readiness',
        handler: function (request, h) {
            return 'OK';
        }
    });

    // Server is running without problems
    server.route({
        method: 'GET',
        path: '/api/health/liveness',
        handler: function (request, h) {
            let eld = request.server.load.eventLoopDelay;

            // Return error, if eventLoopDelay >= 50ms .. this is only for openshift
            // and doesn't directly affect client traffic
            if(eld>50) {
                return h.
                    response('OVERLOAD').
                    code(503);
            }

            return h.
                response('OK').
                code(200);
        }
    });

}

module.exports = {
    register: register
}