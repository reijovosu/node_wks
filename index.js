'use strict';

const Hapi = require('hapi');
const Good = require('good');
const HapiSwagger = require('hapi-swagger');

require('dotenv').config();

const routes = require('./lib/routes');
const mongo = require('./lib/mongo');
const health = require('./lib/health');
const configMap = require('./lib/configmap');

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
async function init() {
    // Start fetching configmap in background (first attempt in 15s from start)
    configMap.startFetchTimer();

    // Connect to database
    await mongo.connect();

    // Force server to run on fixed port 8080

    // Hint: If you end up having internal server errors, but nothing is shown
    // in console, try adding the following option after port parameter:
    // debug: { request: ['error'] }
    
    const server = new Hapi.Server({
        port: 8080,
        load: {
            sampleInterval: 1000
        }
    });

    // Register logging modules
    await server.register([
        {
            plugin: require('inert')
        },{
            plugin: require('vision')
        },{
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Workshop API documentation',
                    version: '0.1.0'
                }
            }
        },{
            plugin: Good,
            options: {
                ops: {
                    interval: 300000
                },
                reporters: {
                    logReporter: [{
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{ 
                            ops: '*',
                            info: '*',
                            response: '*',
                            error: '*'
                        }]
                    },{
                        module: 'good-squeeze',
                        name: 'SafeJson'
                    },{
                        module: 'good-file',
                        args: [ './logs/app.log' ]
                    }]
                }
            }
        }
    ]);

    // Register routes
    routes.register( server );
    health.register( server );

    // Start server
    await server.start();
    return server;
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Program execution starts here
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
init().then((server) => {
    console.log('Server running on '+server.info.host+':'+server.info.port);
});