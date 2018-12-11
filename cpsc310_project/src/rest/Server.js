"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var restify = require("restify");
var Util_1 = require("../Util");
var InsightFacade_1 = require("../controller/InsightFacade");
var fs = require("fs");
var Server = (function () {
    function Server(port) {
        Util_1.default.info("Server::<init>( " + port + " )");
        this.port = port;
        this.inface = new InsightFacade_1.default();
    }
    Server.prototype.register = function () {
        var _this = this;
        var courses = fs.readFileSync(__dirname + '/../../test/courses.zip').toString('base64');
        var rooms = fs.readFileSync(__dirname + '/../../test/rooms.zip').toString('base64');
        return this.inface.addDataset('courses', courses)
            .then(function () { return _this.inface.addDataset('rooms', rooms); });
    };
    Server.prototype.stop = function () {
        var _this = this;
        Util_1.default.info('Server::close()');
        return new Promise(function (fulfill) {
            _this.rest.close(function () {
                fulfill(true);
            });
        });
    };
    Server.prototype.start = function () {
        var _this = this;
        return new Promise(function (fulfill, reject) {
            _this.rest = restify.createServer({
                name: 'insightUBC'
            });
            _this.rest.use(restify.bodyParser({ mapParams: true, mapFiles: true }));
            _this.rest.put('/dataset/:id', function (req, res, next) {
                var dataStr = new Buffer(req.params.body).toString('base64');
                var id = req.params.id;
                _this.inface.addDataset(id, dataStr).then(function (putStuff) {
                    res.json(putStuff.code, putStuff.body);
                }).catch(function (putWrongStuff) {
                    res.json(putWrongStuff.code, putWrongStuff.body);
                });
                return next();
            });
            _this.rest.del('/dataset/:id', function (req, res, next) {
                var id = req.params.id;
                _this.inface.removeDataset(id).then(function (deleteStuff) {
                    res.json(deleteStuff.code, deleteStuff.body);
                }).catch(function (deleteWrongStuff) {
                    res.json(deleteWrongStuff.code, deleteWrongStuff.body);
                });
                return next();
            });
            _this.rest.post('/query', function (req, res, next) {
                _this.inface.performQuery(req.body).then(function (postStuff) {
                    res.json(postStuff.code, postStuff.body);
                }).catch(function (postWrongStuff) {
                    res.json(postWrongStuff.code, postWrongStuff.body);
                });
                return next();
            });
            _this.rest.get(/^[^.]+$/, restify.serveStatic({
                directory: __dirname + '/public',
                file: 'index.html'
            }));
            _this.rest.get(/\/.*/, restify.serveStatic({
                directory: __dirname + '/public',
                'default': 'index.html'
            }));
            _this.rest.listen(_this.port, function () {
                Util_1.default.info('Restify listening: ' + _this.rest.url);
                fulfill(true);
            });
            _this.rest.on('error', function (err) {
                reject(err);
            });
        });
    };
    return Server;
}());
exports.default = Server;
//# sourceMappingURL=Server.js.map