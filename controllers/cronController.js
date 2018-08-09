const mongo = require('../lib/mongo');
const Boom = require('boom');

async function getHandler(request, h) {
    var cronCollection = await mongo.cronModel.find();
    return cronCollection;
}

module.exports = {
    getHandler: getHandler
}