const bookController = require('../controllers/bookController');
const cronController = require('../controllers/cronController');
const configMap = require('../lib/configmap');
const Joi = require('joi');

function register(server) {
    server.route([{
        method: 'GET',
        path: '/',

        config: {
            handler: (request, h) => {
                return configMap.getCmap().welcometext;
            },

            // This line describes route, but it shouldn't be visible on
            // document page, because we used tag: frontend (and not api)
            description: 'Frontpage route',
            tags: ['frontend']
        }

    },{
        method: 'GET',
        path: '/api/book/{id?}',
        config: {
            handler: bookController.getHandler,

            // This describes the route parameters for swagger,
            // and also validates the parameters (although in this
            // case there are no requirements set for id)
            validate: {
                params: {
                    id: Joi.description('ID of the book')
                }
            },

            // Cors headers for our frontend
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },

            // These lines are for swagger
            description: 'Fetch book information',
            notes: 'This a note for book GET route',
            tags: ['api']
        }
    },{
        method: 'POST',
        path: '/api/book',
        config: {
            handler: bookController.postHandler,                    

            // Cors headers for our frontend
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },

            // These lines are for swagger
            description: 'Store book information',
            notes: 'This a note for book POST route',
            tags: ['api']
        }
    },{
        method: 'GET',
        path: '/api/cron',
        config: {
            handler: cronController.getHandler,                    

            // Cors headers for our frontend
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },

            // These lines are for swagger
            description: 'Get cron run information',
            tags: ['api']
        }
    }]);
}

module.exports = {
    register: register
}