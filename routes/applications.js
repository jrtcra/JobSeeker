var Application = require('../models/application');
var User = require('../models/user');

// Helper function for formatting API responses
const formatResponse = (message, data) => ({ message, data });

module.exports = function(router) {
    // GET all job applications from a user
    router.route('/applications').get(async(req, res) => {
        try {

        } catch(error) {
            res.status(500).send(formatResponse("Error retrieving applications", error));
        }
    });

    // POST a new job application
    router.route('/application').post(async(req, res) => {
        try {

        } catch(error) {
            res.status(500).send(formatResponse("Error creating application", error));
        }
    });

    // PATCH a specific job application
    router.route('/application').patch(async(req, res) => {
        try {

        } catch(error) {
            res.status(500).send(formatResponse("Error updating application", error));
        }
    });

    // DELETE a specific job application
    router.route('/application/:id').delete(async(req, res) => {
        try {

        } catch(error) {
            res.status(500).send(formatResponse("Error deleting application", error));
        }
    });

    return router;
}