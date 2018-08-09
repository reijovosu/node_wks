const bookController = require("../controllers/bookController");
const Joi = require("joi");

function register(server) {
    server.route([
        {
            method: "GET",
            path: "/api/book/{id?}",
            config: {
                handler: bookController.getHandler,

                // This describes the route parameters for swagger,
                // and also validates the parameters (although in this
                // case there are no requirements set for id)
                validate: {
                    params: {
                        id: Joi.description("ID of the book")
                    }
                },

                // These lines are for swagger
                description: "Fetch book information",
                notes: "This a note for book GET route",
                tags: ["api"]
            }
        },
        {
            method: "POST",
            path: "/api/book",
            config: {
                handler: bookController.postHandler,

                // These lines are for swagger
                description: "Store book information",
                notes: "This a note for book POST route",
                tags: ["api"]
            }
        }
    ]);
}

module.exports = {
    register: register
};
