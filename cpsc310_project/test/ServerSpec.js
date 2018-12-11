"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Server_1 = require("../src/rest/Server");
var chai_1 = require("chai");
var chai = require("chai");
var chaiHttp = require("chai-http");
var fs = require("fs");
var util_1 = require("util");
chai.use(chaiHttp);
describe("ServerSpec", function () {
    var server = null;
    before(function () {
        this.timeout(10000);
        server = new Server_1.default(8000);
        return server.start()
            .then(function (success) { return chai_1.expect(success); })
            .then(function () {
            return chai.request("http://localhost:8000")
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("test/courses.zip"), "courses.zip");
        });
    });
    after(function () {
        return server.stop().then(function (success) { return chai_1.expect(success); });
    });
    it('Should successfully put', function () {
        this.timeout(20000);
        return chai.request("http://localhost:8000")
            .put('/dataset/rooms')
            .attach("body", fs.readFileSync("test/rooms.zip"), "rooms.zip")
            .then(function (res) {
            chai_1.expect(res.status).to.eq(204);
        }, function (err) {
            chai_1.expect.fail(err);
        });
    });
    it('Should fail with an unknown ID', function () {
        this.timeout(20000);
        return chai.request("http://localhost:8000")
            .put('/dataset/fake')
            .attach("body", fs.readFileSync("test/rooms.zip"), "rooms.zip")
            .then(function (res) {
            chai_1.expect.fail(res);
        }, function (err) {
            chai_1.expect(err.status).to.eq(400);
            chai_1.expect(util_1.isObject(err.response.body));
            chai_1.expect(Object.keys(err.response.body)).to.deep.eq(['error']);
            chai_1.expect(typeof err.response.body.error).to.eq('string');
        });
    });
    it('Should successfully delete', function () {
        return chai.request("http://localhost:8000")
            .del('/dataset/rooms')
            .then(function (res) {
            chai_1.expect(res).to.have.status(204);
        })
            .catch(function (err) {
            chai_1.expect.fail(err);
        });
    });
    it('Should report missing datasets', function () {
        return chai.request("http://localhost:8000")
            .post('/query')
            .send({
            WHERE: {},
            OPTIONS: {
                COLUMNS: ['fake_id'],
                FORM: 'TABLE'
            }
        })
            .then(function (res) {
            chai_1.expect.fail(res);
        }, function (err) {
            chai_1.expect(err.status).to.eq(424);
            chai_1.expect(err.response.body).to.deep.eq({
                missing: ['fake']
            });
        });
    });
    it('Should fail to remove unknown datasets', function () {
        return chai.request("http://localhost:8000")
            .del("/dataset/fake")
            .then(function (res) {
            chai_1.expect.fail(res);
        }, function (err) {
            chai_1.expect(err.status).to.eq(404);
            chai_1.expect(util_1.isObject(err.response.body));
            chai_1.expect(Object.keys(err.response.body)).to.deep.eq(['error']);
            chai_1.expect(typeof err.response.body.error).to.eq('string');
        });
    });
    it('Should produce a 400 on an invalid query', function () {
        return chai.request('http://localhost:8000')
            .post('/query')
            .send({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [],
                FORM: 'TABLE'
            }
        })
            .then(function (res) {
            chai_1.expect.fail(res);
        }, function (err) {
            chai_1.expect(err.status).to.eq(400);
            chai_1.expect(util_1.isObject(err.response.body));
            chai_1.expect(Object.keys(err.response.body)).to.deep.eq(['error']);
            chai_1.expect(typeof err.response.body.error).to.eq('string');
        });
    });
    it('Should successfully post', function () {
        return chai.request("http://localhost:8000")
            .post('/query')
            .send({
            "WHERE": {
                "AND": [
                    { "IS": { "courses_id": "317" } },
                    { "IS": { "courses_dept": "biol" } }
                ]
            },
            "OPTIONS": {
                "COLUMNS": ["courses_id", "courses_avg", "courses_dept"],
                "ORDER": { "dir": "DOWN", "keys": ["courses_avg"] },
                "FORM": "TABLE"
            }
        })
            .then(function (res) {
            chai_1.expect(res.status).to.eq(200);
            chai_1.expect(res.body).to.deep.eq({ "render": "TABLE", "result": [{ "courses_id": "317", "courses_avg": 72.73, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 72.73, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 72.5, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 72.5, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 70.83, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 70.83, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 70.78, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 70.78, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 69.57, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 69.57, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 69.35, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 69.35, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 69.1, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 69.1, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 65.24, "courses_dept": "biol" }, { "courses_id": "317", "courses_avg": 65.24, "courses_dept": "biol" }] });
        }, function (err) {
            chai_1.expect.fail(err);
        });
    });
    it('201: the operation was successful and the id already existed (was added in this session or was previously cached).', function () {
        this.timeout(20000);
        return chai.request("http://localhost:8000")
            .put('/dataset/courses')
            .attach("body", fs.readFileSync("test/courses.zip"), "courses.zip")
            .then(function (res) {
            chai_1.expect(res.status).to.eq(201);
        }, function (err) {
            chai_1.expect.fail(err);
        });
    });
});
//# sourceMappingURL=ServerSpec.js.map