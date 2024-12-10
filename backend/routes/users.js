var Application = require('../models/application');
var User = require('../models/user');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// Helper function for formatting API responses
const formatResponse = (message, data) => ({ message, data });

module.exports = function(router) {
    // POST login a user
    router.route('/user/login').post(async(req, res) => {
        try {
            const { username, password } = req.body;

            // Find user by username
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).send(formatResponse("Invalid username or password", null));
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send(formatResponse("Invalid username or password", null));
            }

            // Create JWT token
            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).send(formatResponse("Successfully logged in", { token, user }));
        } catch(error) {
            res.status(500).send(formatResponse("Error logging in", error));
        }
    });

    // POST register a new user
    router.route('/user/register').post(async(req, res) => {
        try {
            const { username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return res.status(400).send(formatResponse("User already exists", null));
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = new User({
                username,
                email,
                password: hashedPassword,
                applications: [],
                goals: [],
                statistics: {
                    totalApplications: 0,
                    totalInterviews: 0,
                    totalRejections: 0,
                    totalAcceptances: 0,
                    lastUpdated: new Date()
                }
            });

            await user.save();

            // Create JWT token
            const token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).send(formatResponse("Successfully registered", { token, user }));
        } catch(error) {
            res.status(500).send(formatResponse("Error registering user", error));
        }
    });

    // GET the profile details of a user
    router.route('/user/profile').get(async(req, res) => {
        try {
            const userId = req.user.id;

            const user = await User.findById(userId)
                .select('-password')  // Exclude password from the response
                .populate('applications');  // Include application details

            if (!user) {
                return res.status(404).send(formatResponse("User not found", null));
            }

            res.status(200).send(formatResponse("Successfully retrieved user profile", user));
        } catch(error) {
            res.status(500).send(formatResponse("Error retrieving user information", error));
        }
    });

    // POST create a new goal
    router.route('/user/goals').post(async(req, res) => {
        try {
            const userId = req.user.id;
            const { targetNumber, timeframe, type, endDate } = req.body;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send(formatResponse("User not found", null));
            }

            // Add new goal
            user.goals.push({
                targetNumber,
                timeframe,
                type,
                startDate: new Date(),
                endDate: new Date(endDate),
                currentProgress: 0
            });

            await user.save();

            res.status(201).send(formatResponse("Successfully created goal", user.goals));
        } catch(error) {
            res.status(500).send(formatResponse("Error creating goal", error));
        }
    });

    // GET all goals
    router.route('/user/goals').get(async(req, res) => {
        try {
            const userId = req.user.id;

            const user = await User.findById(userId).select('goals');
            if (!user) {
                return res.status(404).send(formatResponse("User not found", null));
            }

            res.status(200).send(formatResponse("Successfully retrieved goals", user.goals));
        } catch(error) {
            res.status(500).send(formatResponse("Error retrieving goals", error));
        }
    });

    // PATCH update a specific goal
    router.route('/user/goals/:goalId').patch(async(req, res) => {
        try {
            const userId = req.user.id;
            const { goalId } = req.params;
            const updates = req.body;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send(formatResponse("User not found", null));
            }

            const goal = user.goals.id(goalId);
            if (!goal) {
                return res.status(404).send(formatResponse("Goal not found", null));
            }

            // Update goal fields
            Object.assign(goal, updates);
            await user.save();

            res.status(200).send(formatResponse("Successfully updated goal", goal));
        } catch(error) {
            res.status(500).send(formatResponse("Error updating goal", error));
        }
    });

    // DELETE a specific goal
    router.route('/user/goals/:goalId').delete(async(req, res) => {
        try {
            const userId = req.user.id;
            const { goalId } = req.params;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send(formatResponse("User not found", null));
            }

            user.goals.pull(goalId);
            await user.save();

            res.status(200).send(formatResponse("Successfully deleted goal", null));
        } catch(error) {
            res.status(500).send(formatResponse("Error deleting goal", error));
        }
    });

    // GET user statistics
    router.route('/user/stats').get(async(req, res) => {
        try {
            const userId = req.user.id;

            const user = await User.findById(userId).select('statistics');
            if (!user) {
                return res.status(404).send(formatResponse("User not found", null));
            }

            res.status(200).send(formatResponse("Successfully retrieved statistics", user.statistics));
        } catch(error) {
            res.status(500).send(formatResponse("Error retrieving statistics", error));
        }
    });

    // PATCH update user's password
    router.route('/user/password').patch(async(req, res) => {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            // Find user and verify old password
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send(formatResponse("User not found", null));
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).send(formatResponse("Current password is incorrect", null));
            }

            // Hash and update new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            res.status(200).send(formatResponse("Successfully updated password", null));
        } catch(error) {
            res.status(500).send(formatResponse("Error updating password", error));
        }
    });

    // PATCH user information
    router.route('/user').patch(async(req, res) => {
        try {
            const userId = req.user.id;
            const updates = req.body;

            // Don't allow password updates through this endpoint
            delete updates.password;

            const user = await User.findByIdAndUpdate(
                userId,
                updates,
                { new: true, select: '-password' }
            );

            if (!user) {
                return res.status(404).send(formatResponse("User not found", null));
            }

            res.status(200).send(formatResponse("Successfully updated user", user));
        } catch(error) {
            res.status(500).send(formatResponse("Error updating user information", error));
        }
    });

    // DELETE user
    router.route('/user').delete(async(req, res) => {
        try {
            const userId = req.user.id;

            // Delete all associated applications first
            await Application.deleteMany({ assignedUser: userId });

            // Delete the user
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).send(formatResponse("User not found", null));
            }

            res.status(200).send(formatResponse("Successfully deleted user", null));
        } catch(error) {
            res.status(500).send(formatResponse("Error deleting user", error));
        }
    });

    return router;
}