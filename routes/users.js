var Application = require('../models/application');
var User = require('../models/user');

// Helper function for formatting API responses
const formatResponse = (message, data) => ({ message, data });

module.exports = function(router) {
    // POST login a user
    router.route('/user/login').post(async(req, res) => {
        try {

        } catch(error) {
            res.status(500).send(formatResponse("Error logging in", error));
        }
    });

    // GET the profile details of a user
    router.route('/user/profile').get(async(req, res) => {
        try {

        } catch(error) {
            res.status(500).send(formatResponse("Error retrieving user information", error));
        }
    });

    // PATCH a user's information
    router.route('/user').patch(async(req, res) => {
        try {

        } catch(error) {
            res.status(500).send(formatResponse("Error updating user information", error));
        }
    });

    // DELETE a user
    router.route('/user').delete(async(req, res) => {
        try {

        } catch(error) {
            res.status(500).send(formatResponse("Error deleting user", error));
        }
    });

    return router;
}