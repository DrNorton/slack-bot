const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/api', { target: 'http://192.168.0.102:3000' }));
    app.use(proxy('/image', { target: 'http://192.168.0.102:3000/api' }));
};
