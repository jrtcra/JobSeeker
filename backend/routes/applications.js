var Application = require('../models/application');
var User = require('../models/user');

// Helper function for formatting API responses
const formatResponse = (message, data) => ({ message, data });

module.exports = function(router) {
    // GET all job applications from a user
    router.route('/applications').get(async(req, res) => {
        try {
            // Assuming auth middleware sets req.user
            // const userId = req.user.id;
            const { username } = req.query;
            const user = await User.findOne({ username });
            if (!user) {
                console.log("Couldn't find user");
                return res.status(401).send(formatResponse("Couldn't find user", null));
            }
            console.log(user._id);
            // Find all applications assigned to this user
            const applications = await Application.find({ assignedUser: user._id });
            // console.log("APPLICATIONS: " + applications);
            res.status(200).send(formatResponse("Successfully retrieved applications", applications));
        } catch(error) {
            res.status(500).send(formatResponse("Error retrieving applications", error));
        }
    });

    // POST a new job application
    router.route('/application').post(async(req, res) => {
        try {
            const { username, name, date, company, status, webpage, notes } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                console.log("Couldn't find user");
                return res.status(401).send(formatResponse("Couldn't find user", null));
            }
            // Assuming auth middleware sets req.user
            

            // Create new application
            const application = new Application({
                name,
                company,
                status,
                webpage,
                notes,
                date,
                assignedUser: user._id
            });

            // Save the application
            await application.save();

            // Update user's applications array and statistics
            await User.findByIdAndUpdate(user._id, {
                $push: { applications: application._id },
                $inc: { 'statistics.totalApplications': 1 },
                $set: { 'statistics.lastUpdated': new Date() }
            });

            res.status(201).send(formatResponse("Successfully created application", application));
        } catch(error) {
            console.log(error);
            res.status(500).send(formatResponse("Error creating application", error));
        }
    });

    // PATCH a specific job application
    router.route('/application').patch(async(req, res) => {
        try {
            const userId = req.user.id;
            const applicationId = req.params.id;
            const updates = req.body;

            // Find application and verify ownership
            const application = await Application.findOne({
                _id: applicationId,
                assignedUser: userId
            });

            if (!application) {
                return res.status(404).send(formatResponse("Application not found or unauthorized", null));
            }

            // If status is being updated, handle statistics update
            if (updates.status && updates.status !== application.status) {
                const statsUpdate = {};
                
                // Remove count from old status if it was a counted status
                if (application.status === 'accepted') {
                    statsUpdate['statistics.totalAcceptances'] = -1;
                } else if (application.status.toLowerCase().includes('interview')) {
                    statsUpdate['statistics.totalInterviews'] = -1;
                } else if (application.status === 'rejected') {
                    statsUpdate['statistics.totalRejections'] = -1;
                }

                // Add count to new status if it's a counted status
                if (updates.status === 'accepted') {
                    statsUpdate['statistics.totalAcceptances'] = 1;
                } else if (updates.status.toLowerCase().includes('interview')) {
                    statsUpdate['statistics.totalInterviews'] = 1;
                } else if (updates.status === 'rejected') {
                    statsUpdate['statistics.totalRejections'] = 1;
                }

                // Update user statistics
                if (Object.keys(statsUpdate).length > 0) {
                    await User.findByIdAndUpdate(userId, {
                        $inc: statsUpdate,
                        $set: { 'statistics.lastUpdated': new Date() }
                    });
                }
            }

            // Update the application
            Object.assign(application, updates);
            await application.save();

            res.status(200).send(formatResponse("Successfully updated application", application));
        } catch(error) {
            res.status(500).send(formatResponse("Error updating application", error));
        }
    });

    // DELETE a specific job application
    router.route('/application/:id').delete(async(req, res) => {
        try {
            const userId = req.user.id;
            const applicationId = req.params.id;

            // Find application and verify ownership
            const application = await Application.findOne({
                _id: applicationId,
                assignedUser: userId
            });

            if (!application) {
                return res.status(404).send(formatResponse("Application not found or unauthorized", null));
            }

            // Update user statistics based on the application's status
            const statsUpdate = {
                'statistics.totalApplications': -1
            };

            if (application.status === 'accepted') {
                statsUpdate['statistics.totalAcceptances'] = -1;
            } else if (application.status.toLowerCase().includes('interview')) {
                statsUpdate['statistics.totalInterviews'] = -1;
            } else if (application.status === 'rejected') {
                statsUpdate['statistics.totalRejections'] = -1;
            }

            // Update user document
            await User.findByIdAndUpdate(userId, {
                $pull: { applications: applicationId },
                $inc: statsUpdate,
                $set: { 'statistics.lastUpdated': new Date() }
            });

            // Delete the application
            await Application.findByIdAndDelete(applicationId);

            res.status(200).send(formatResponse("Successfully deleted application", null));
        } catch(error) {
            res.status(500).send(formatResponse("Error deleting application", error));
        }
    });

    return router;
}