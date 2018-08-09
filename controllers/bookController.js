const mongo = require('../lib/mongo');
const Boom = require('boom');

async function getHandler(request, h) {
    var bookCollection;

    if(request.params.id) {
        if(mongo.isValidObjId(request.params.id)) {
            bookCollection = await mongo.bookModel.find({ _id: request.params.id });
        } else {
            return Boom.badRequest("Invalid book ID");
        }
    } else {
        bookCollection = await mongo.bookModel.find();
    }

    return bookCollection;
}

async function postHandler(request, h) {
    let post = request.payload;

    let bookModel = new mongo.bookModel({
        name: post.name,
        author: post.author,
        isbn: post.isbn,
        description: post.description,
        numberOfPages: post.numberOfPages
    });

    await bookModel.save();

    return { msg: "OK" };
}

module.exports = {
    getHandler: getHandler,
    postHandler: postHandler
}