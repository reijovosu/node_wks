const Mongoose = require('mongoose');

// :::::::::::::::::::::::::::::::::::::::::::::

Mongoose.Promise = global.Promise;

// :::::::::::::::::::::::::::::::::::::::::::::

var bookSchema = new Mongoose.Schema({
    name: String,
    author: String,
    isbn: String,
    description: String,
    numberOfPages: Number
});

var bookModel = Mongoose.model("Books", bookSchema);

// :::::::::::::::::::::::::::::::::::::::::::::
function isValidObjId(id) {
    return Mongoose.Types.ObjectId.isValid(id)
}

async function connect() {
    let options = {
        useNewUrlParser: true
    };
    let dburl = process.env.MONGODB_URL;

    if(!dburl) {
        console.log("MONGODB_URL environment variable not set.. exiting ..")
        process.exit(1);
    }

    if(process.env.MONGODB_USERNAME) {
        options.user = process.env.MONGODB_USERNAME;
    }

    if(process.env.MONGODB_PASSWORD) {
        options.pass = process.env.MONGODB_PASSWORD;
    }

    try {
        await Mongoose.connect(dburl,options);
        console.log("Connected to MongoDB..");
    } catch(err) {
        console.log("Unable to connect to database .. exiting ..");
        console.log(err);
        process.exit(1);
    }
}

// :::::::::::::::::::::::::::::::::::::::::::::

module.exports = {
    connect: connect,
    isValidObjId: isValidObjId,
    bookModel: bookModel
}