"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Server_1 = require("./rest/Server");
var Util_1 = require("./Util");
var App = (function () {
    function App() {
    }
    App.prototype.initServer = function (port) {
        Util_1.default.info('App::initServer( ' + port + ' ) - start');
        var s = new Server_1.default(port);
        s.register().then(function () { return s.start(); })
            .then(function (val) {
            Util_1.default.info("App::initServer() - started: " + val);
        }, function (err) {
            Util_1.default.error("App::initServer() - ERROR: " + err.message);
        });
    };
    return App;
}());
exports.App = App;
Util_1.default.info('App - starting');
var app = new App();
app.initServer(4321);
//# sourceMappingURL=App.js.map