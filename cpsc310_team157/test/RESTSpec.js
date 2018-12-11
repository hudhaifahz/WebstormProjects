"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Server_1 = require("../src/rest/Server");
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var chai = require("chai");
var chaiHttp = require("chai-http");
var fs = require('fs');
describe("RESTSpec", function () {
    chai.use(chaiHttp);
    var server = new Server_1.default(4321);
    var URL = "http://127.0.0.1:4321";
    before(function () {
        Util_1.default.test('Before: ' + this.test.parent.title);
        function sanityCheck(response) {
            chai_1.expect(response).to.have.property('code');
            chai_1.expect(response).to.have.property('body');
            chai_1.expect(response.code).to.be.a('number');
        }
        server.start();
    });
    beforeEach(function () {
        Util_1.default.test('BeforeTest: ' + this.currentTest.title);
    });
    after(function () {
        Util_1.default.test('After: ' + this.test.parent.title);
        server.stop();
        if (fs.existsSync('./src/controller/database.json')) {
            fs.unlinkSync('./src/controller/database.json');
        }
    });
    afterEach(function () {
        Util_1.default.test('AfterTest: ' + this.currentTest.title);
    });
    it("POST 424, unhandled promis rejection?", function () {
        var query = {
            "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] },
            "OPTIONS": {
                "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"],
                "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }, { "minSeats": { "MIN": "rooms_seats" } }, { "countRoom": { "COUNT": "rooms_shortname" } }, { "sumSeats": { "SUM": "rooms_seats" } }]
            }
        };
        return chai.request(URL)
            .post('/query')
            .send(query)
            .then(function (res) {
            Util_1.default.trace('then:');
        })
            .catch(function (err) {
            Util_1.default.trace('catch:' + err);
            chai_1.expect(err.status).to.equal(424);
        });
    });
    it("PUT description ?", function () {
        this.timeout(5000);
        return chai.request(URL)
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("./rooms.zip"), "rooms.zip")
            .then(function (res) {
            Util_1.default.trace('then:');
            chai_1.expect(res.status).to.equal(204);
            chai_1.expect(res.body).to.deep.equal({ "Message": "Data Added!" });
        })
            .catch(function (err) {
            Util_1.default.trace('catch:' + err);
            console.log('------');
            chai_1.expect.fail();
        });
    });
    it("PUT description", function () {
        this.timeout(5000);
        return chai.request(URL)
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("./rooms.zip"), "rooms.zip")
            .then(function (res) {
            Util_1.default.trace('then:');
            chai_1.expect(res.status).to.equal(201);
        })
            .catch(function (err) {
            Util_1.default.trace('catch:' + err);
            console.log('------');
            chai_1.expect.fail();
        });
    });
    it("PUT description", function () {
        this.timeout(5000);
        return chai.request(URL)
            .put('/dataset/courses')
            .attach("body", fs.readFileSync("./courses.zip"), "courses.zip")
            .then(function (res) {
            Util_1.default.trace('then:');
            chai_1.expect(res.status).to.equal(204);
        })
            .catch(function (err) {
            Util_1.default.trace('catch:' + err);
            console.log('------');
            chai_1.expect.fail();
        });
    });
    it("PUT description", function () {
        this.timeout(5000);
        return chai.request(URL)
            .put('/dataset/courses')
            .attach("body", fs.readFileSync("./courses.zip"), "courses.zip")
            .then(function (res) {
            Util_1.default.trace('then:');
            chai_1.expect(res.status).to.equal(201);
        })
            .catch(function (err) {
            Util_1.default.trace('catch:' + err);
            console.log('------');
            chai_1.expect.fail();
        });
    });
    it("POST 200", function () {
        var query = {
            "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] },
            "OPTIONS": {
                "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"],
                "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_shortname"],
                "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }, { "minSeats": { "MIN": "rooms_seats" } }, { "countRoom": { "COUNT": "rooms_shortname" } }, { "sumSeats": { "SUM": "rooms_seats" } }]
            }
        };
        return chai.request(URL)
            .post('/query')
            .send(query)
            .then(function (res) {
            Util_1.default.trace('then:');
            chai_1.expect(res.status).to.equal(200);
        })
            .catch(function (err) {
            Util_1.default.trace('catch:' + err);
            chai_1.expect.fail();
        });
    });
    it("POST 200", function () {
        var query = { "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }, { "countSeats": { "COUNT": "rooms_seats" } }, { "maxSeats": { "MAX": "rooms_seats" } }, { "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } };
        return chai.request(URL)
            .post('/query')
            .send(query)
            .then(function (res) {
            Util_1.default.trace('then:');
            chai_1.expect(res.status).to.equal(200);
        })
            .catch(function (err) {
            Util_1.default.trace('catch:' + err);
            chai_1.expect.fail();
        });
    });
    it("PUT description", function () {
        this.timeout(5000);
        return chai.request(URL)
            .put('/dataset/courses')
            .attach("body", fs.readFileSync("./courses.zip"), "courses.zip")
            .then(function (res) {
            Util_1.default.trace('then:');
            chai_1.expect(res.status).to.equal(201);
        })
            .catch(function (err) {
            Util_1.default.trace('catch:' + err);
            console.log('------');
            chai_1.expect.fail();
        });
    });
});
//# sourceMappingURL=RESTSpec.js.map