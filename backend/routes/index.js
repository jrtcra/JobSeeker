// Connect all endpoints
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use('/api/applications', require('./applications.js')(router));
    app.use('/api/users', require('./users.js')(router));
};
