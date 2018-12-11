"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var Unpack_1 = require("../src/controller/Unpack");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var QuerySyntaxChecker_1 = require("../src/controller/QuerySyntaxChecker");
var fs = require('fs');
describe("D3Tests", function () {
    var insF;
    var unP;
    before("load full", function () {
    });
    beforeEach(function () {
        Util_1.default.test('BeforeTest: ' + this.currentTest.title);
        insF = new InsightFacade_1.default();
        unP = new Unpack_1.Unpack();
    });
    after(function () {
        Util_1.default.test('After: ' + this.test.parent.title);
        if (fs.existsSync('./src/controller/database.json')) {
            fs.unlinkSync('./src/controller/database.json');
        }
    });
    afterEach(function () {
        Util_1.default.test('AfterTest: ' + this.currentTest.title);
    });
    it("courses.zip should return 204", function (done) {
        this.timeout(20000);
        insF.addDataset("courses", unP.getFromZip("courses.zip").toString("base64")).then(function (value) {
            chai_1.expect(value.code).to.equal(204);
            chai_1.expect(value.body).to.deep.equal({ "Message": "Data Added!" });
        }).then(done, done).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("rooms.zip should return 204", function (done) {
        this.timeout(20000);
        insF.addDataset("rooms", unP.getFromZip("rooms.zip").toString("base64")).then(function (value) {
            chai_1.expect(value.code).to.equal(204);
            chai_1.expect(value.body).to.deep.equal({ "Message": "Data Added!" });
        }).then(done, done).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("Attempt Query GROUP and APPLY validation should be 200 maxLat", function () {
        return insF.performQuery({
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_lat",
                    "rooms_lon",
                    "rooms_seats",
                    "maxLat"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": ["maxLat", "rooms_lat", "rooms_lon"]
                }
            },
            "TRANSFORMATIONS": {
                "GROUP": ["rooms_lat", "rooms_lon", "rooms_seats"],
                "APPLY": [{
                        "maxLat": {
                            "MAX": "rooms_lat"
                        }
                    }]
            }
        }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("basic D3 test: valid transform empty apply COMMENTED", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"] }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [] } }).then(function (result) {
            var resultFinal = JSON.stringify(result.body);
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("SubQuery Test", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.transfTraverse({ "GROUP": ["rooms_shortname"], "APPLY": [] }, arr);
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal([true, true]);
    });
    it("SubQuery OPTIONS Test", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.optTraverse({ "COLUMNS": ["rooms_shortname"] }, arr);
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal([true]);
    });
    it("valid SubQuery goThroughData Test", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.goThroughData({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"] }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [] } });
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal(true);
    });
    it("valid SubQuery goThroughData Test, APPLY error", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.goThroughData({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"] }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "": { "COUNT": "rooms_shortname" } }] } });
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal(true);
    });
    it("valid no order transform COMMENTED", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"] }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "": { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("basic D2 test: column only for rooms_shortname COMMENTED", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("basic D2 test: column and order for rooms_shortname", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.deep.equal('{"result":[{"rooms_shortname":"AERL"},{"rooms_shortname":"ALRD"},{"rooms_shortname":"ALRD"},{"rooms_shortname":"ALRD"},{"rooms_shortname":"ALRD"},{"rooms_shortname":"ALRD"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANSO"},{"rooms_shortname":"ANSO"},{"rooms_shortname":"ANSO"},{"rooms_shortname":"ANSO"},{"rooms_shortname":"AUDX"},{"rooms_shortname":"AUDX"},{"rooms_shortname":"BIOL"},{"rooms_shortname":"BIOL"},{"rooms_shortname":"BIOL"},{"rooms_shortname":"BIOL"},{"rooms_shortname":"BRKX"},{"rooms_shortname":"BRKX"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"CEME"},{"rooms_shortname":"CEME"},{"rooms_shortname":"CEME"},{"rooms_shortname":"CEME"},{"rooms_shortname":"CEME"},{"rooms_shortname":"CEME"},{"rooms_shortname":"CHBE"},{"rooms_shortname":"CHBE"},{"rooms_shortname":"CHBE"},{"rooms_shortname":"CHEM"},{"rooms_shortname":"CHEM"},{"rooms_shortname":"CHEM"},{"rooms_shortname":"CHEM"},{"rooms_shortname":"CHEM"},{"rooms_shortname":"CHEM"},{"rooms_shortname":"CIRS"},{"rooms_shortname":"DMP"},{"rooms_shortname":"DMP"},{"rooms_shortname":"DMP"},{"rooms_shortname":"DMP"},{"rooms_shortname":"DMP"},{"rooms_shortname":"EOSM"},{"rooms_shortname":"ESB"},{"rooms_shortname":"ESB"},{"rooms_shortname":"ESB"},{"rooms_shortname":"FNH"},{"rooms_shortname":"FNH"},{"rooms_shortname":"FNH"},{"rooms_shortname":"FNH"},{"rooms_shortname":"FNH"},{"rooms_shortname":"FNH"},{"rooms_shortname":"FORW"},{"rooms_shortname":"FORW"},{"rooms_shortname":"FORW"},{"rooms_shortname":"FRDM"},{"rooms_shortname":"FSC"},{"rooms_shortname":"FSC"},{"rooms_shortname":"FSC"},{"rooms_shortname":"FSC"},{"rooms_shortname":"FSC"},{"rooms_shortname":"FSC"},{"rooms_shortname":"FSC"},{"rooms_shortname":"FSC"},{"rooms_shortname":"FSC"},{"rooms_shortname":"FSC"},{"rooms_shortname":"GEOG"},{"rooms_shortname":"GEOG"},{"rooms_shortname":"GEOG"},{"rooms_shortname":"GEOG"},{"rooms_shortname":"GEOG"},{"rooms_shortname":"GEOG"},{"rooms_shortname":"GEOG"},{"rooms_shortname":"GEOG"},{"rooms_shortname":"HEBB"},{"rooms_shortname":"HEBB"},{"rooms_shortname":"HEBB"},{"rooms_shortname":"HEBB"},{"rooms_shortname":"HENN"},{"rooms_shortname":"HENN"},{"rooms_shortname":"HENN"},{"rooms_shortname":"HENN"},{"rooms_shortname":"HENN"},{"rooms_shortname":"HENN"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IONA"},{"rooms_shortname":"IONA"},{"rooms_shortname":"LASR"},{"rooms_shortname":"LASR"},{"rooms_shortname":"LASR"},{"rooms_shortname":"LASR"},{"rooms_shortname":"LASR"},{"rooms_shortname":"LASR"},{"rooms_shortname":"LSC"},{"rooms_shortname":"LSC"},{"rooms_shortname":"LSC"},{"rooms_shortname":"LSK"},{"rooms_shortname":"LSK"},{"rooms_shortname":"LSK"},{"rooms_shortname":"LSK"},{"rooms_shortname":"MATH"},{"rooms_shortname":"MATH"},{"rooms_shortname":"MATH"},{"rooms_shortname":"MATH"},{"rooms_shortname":"MATH"},{"rooms_shortname":"MATH"},{"rooms_shortname":"MATH"},{"rooms_shortname":"MATH"},{"rooms_shortname":"MATX"},{"rooms_shortname":"MCLD"},{"rooms_shortname":"MCLD"},{"rooms_shortname":"MCLD"},{"rooms_shortname":"MCLD"},{"rooms_shortname":"MCLD"},{"rooms_shortname":"MCLD"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MGYM"},{"rooms_shortname":"MGYM"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"OSBO"},{"rooms_shortname":"OSBO"},{"rooms_shortname":"OSBO"},{"rooms_shortname":"PCOH"},{"rooms_shortname":"PCOH"},{"rooms_shortname":"PCOH"},{"rooms_shortname":"PCOH"},{"rooms_shortname":"PCOH"},{"rooms_shortname":"PCOH"},{"rooms_shortname":"PCOH"},{"rooms_shortname":"PCOH"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SOWK"},{"rooms_shortname":"SOWK"},{"rooms_shortname":"SOWK"},{"rooms_shortname":"SOWK"},{"rooms_shortname":"SOWK"},{"rooms_shortname":"SOWK"},{"rooms_shortname":"SOWK"},{"rooms_shortname":"SPPH"},{"rooms_shortname":"SPPH"},{"rooms_shortname":"SPPH"},{"rooms_shortname":"SPPH"},{"rooms_shortname":"SPPH"},{"rooms_shortname":"SPPH"},{"rooms_shortname":"SRC"},{"rooms_shortname":"SRC"},{"rooms_shortname":"SRC"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"UCLL"},{"rooms_shortname":"UCLL"},{"rooms_shortname":"UCLL"},{"rooms_shortname":"UCLL"},{"rooms_shortname":"WESB"},{"rooms_shortname":"WESB"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"},{"rooms_shortname":"WOOD"}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("valid check transform, apply and count, excludes GT", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "": { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.equal('{"result":[{"rooms_shortname":"AERL"},{"rooms_shortname":"ALRD"},{"rooms_shortname":"ANGU"},{"rooms_shortname":"ANSO"},{"rooms_shortname":"AUDX"},{"rooms_shortname":"BIOL"},{"rooms_shortname":"BRKX"},{"rooms_shortname":"BUCH"},{"rooms_shortname":"CEME"},{"rooms_shortname":"CHBE"},{"rooms_shortname":"CHEM"},{"rooms_shortname":"CIRS"},{"rooms_shortname":"DMP"},{"rooms_shortname":"EOSM"},{"rooms_shortname":"ESB"},{"rooms_shortname":"FNH"},{"rooms_shortname":"FORW"},{"rooms_shortname":"FRDM"},{"rooms_shortname":"FSC"},{"rooms_shortname":"GEOG"},{"rooms_shortname":"HEBB"},{"rooms_shortname":"HENN"},{"rooms_shortname":"IBLC"},{"rooms_shortname":"IONA"},{"rooms_shortname":"LASR"},{"rooms_shortname":"LSC"},{"rooms_shortname":"LSK"},{"rooms_shortname":"MATH"},{"rooms_shortname":"MATX"},{"rooms_shortname":"MCLD"},{"rooms_shortname":"MCML"},{"rooms_shortname":"MGYM"},{"rooms_shortname":"ORCH"},{"rooms_shortname":"OSBO"},{"rooms_shortname":"PCOH"},{"rooms_shortname":"PHRM"},{"rooms_shortname":"SCRF"},{"rooms_shortname":"SOWK"},{"rooms_shortname":"SPPH"},{"rooms_shortname":"SRC"},{"rooms_shortname":"SWNG"},{"rooms_shortname":"UCLL"},{"rooms_shortname":"WESB"},{"rooms_shortname":"WOOD"}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("valid check transform, apply and count, includes GT", function () {
        return insF.performQuery({ "WHERE": { "GT": { "rooms_seats": 300 } }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "": { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.equal('{"result":[{"rooms_shortname":"CIRS"},{"rooms_shortname":"ESB"},{"rooms_shortname":"HEBB"},{"rooms_shortname":"LSC"},{"rooms_shortname":"OSBO"},{"rooms_shortname":"WESB"},{"rooms_shortname":"WOOD"}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("invalid column monkey, apply donkey ", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "monkey"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "donkey": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            chai_1.expect.fail(result);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect(err.code).to.equal(400);
        });
    });
    it("Attempt valid column no string, apply empty string", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.deep.equal('{"result":[{"rooms_shortname":"HEBB"},{"rooms_shortname":"LSC"},{"rooms_shortname":"OSBO"}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt valid column no string, apply empty, count string ", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "": { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.deep.equal('{"result":[{"rooms_shortname":"HEBB"},{"rooms_shortname":"LSC"},{"rooms_shortname":"OSBO"}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt D2 Query validation, should be 200, contradictory?", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "LT": { "rooms_seats": 300 } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.deep.equal('{"result":[]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("SubQuery goThroughData Test, D2 Query validation, IS based", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.goThroughData({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname"] } });
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal(true);
    });
    it("invalid SubQuery goThroughData Test, maxSeats error", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.goThroughData({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": "maxSeats" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } });
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal(true);
    });
    it("Attempt Query maxSeats is a valid key in column without query, should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": "maxSeats" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.deep.equal('{"result":[{"rooms_shortname":"LSC","maxSeats":350},{"rooms_shortname":"HEBB","maxSeats":375},{"rooms_shortname":"OSBO","maxSeats":442}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect(err.code).to.equal(400);
        });
    });
    it("SubQuery goThroughData Test, GROUP and APPLY validation should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.goThroughData({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": "maxSeats" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } });
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal(true);
    });
    it("Attempt Query GROUP and APPLY validation should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": "maxSeats" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.deep.equal('{"result":[{"rooms_shortname":"LSC","maxSeats":350},{"rooms_shortname":"HEBB","maxSeats":375},{"rooms_shortname":"OSBO","maxSeats":442}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("SubQuery goThroughData Test, Query A D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.goThroughData({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } });
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal(true);
    });
    it("SubQuery optTraverse Test, Query A, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        qrc.apply_strings.push("maxSeats");
        var arr = new Array();
        var result = qrc.optTraverse({ "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] } }, arr);
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal([true, true, true]);
    });
    it("SubQuery recurseLogic Test, Query A, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.recurseLogic({ "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, arr);
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal([true, true]);
    });
    it("SubQuery transfVerse Test, Query A, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.transfTraverse({ "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] }, arr);
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal([true, true, true, true]);
        chai_1.expect(qrc.apply_strings.includes("maxSeats")).to.deep.equal(true);
    });
    it("Attempt Query A D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.deep.equal('{"result":[{"rooms_shortname":"OSBO","maxSeats":442},{"rooms_shortname":"HEBB","maxSeats":375},{"rooms_shortname":"LSC","maxSeats":350}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("SubQuery goThroughData Test, Query 15, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.goThroughData({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "rooms_address", "rooms_seats", "totalSeats", "avgSeats"], "ORDER": { "dir": "DOWN", "keys": ["totalSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname", "rooms_address", "rooms_seats"], "APPLY": [{ "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } });
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal(true);
    });
    it("SubQuery optTraverse Test, Query 15, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        qrc.apply_strings.push("totalSeats");
        qrc.apply_strings.push("avgSeats");
        var result = qrc.optTraverse({ "COLUMNS": ["rooms_shortname", "rooms_address", "rooms_seats", "totalSeats", "avgSeats"], "ORDER": { "dir": "DOWN", "keys": ["totalSeats"] } }, arr);
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal([true, true, true]);
    });
    it("SubQuery recurseLogic Test, Query 15, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.recurseLogic({ "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, arr);
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal([true, true]);
    });
    it("SubQuery transfVerse Test, Query 15, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.transfTraverse({ "GROUP": ["rooms_shortname", "rooms_address", "rooms_seats"], "APPLY": [{ "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] }, arr);
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal([true, true, true, true, true, true, true]);
        chai_1.expect(qrc.apply_strings.includes("totalSeats")).to.deep.equal(true);
        chai_1.expect(qrc.apply_strings.includes("avgSeats")).to.deep.equal(true);
    });
    it("Attempt Query 15, D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "rooms_address", "rooms_seats", "totalSeats", "avgSeats"], "ORDER": { "dir": "DOWN", "keys": ["totalSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname", "rooms_address", "rooms_seats"], "APPLY": [{ "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.deep.equal('{"result":[{"rooms_shortname":"LSC","rooms_address":"2350 Health Sciences Mall","rooms_seats":350,"totalSeats":700,"avgSeats":350},{"rooms_shortname":"OSBO","rooms_address":"6108 Thunderbird Boulevard","rooms_seats":442,"totalSeats":442,"avgSeats":442},{"rooms_shortname":"HEBB","rooms_address":"2045 East Mall","rooms_seats":375,"totalSeats":375,"avgSeats":375}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("SubQuery goThroughData Test, Query B, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.goThroughData({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_furniture"], "APPLY": [] } });
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal(true);
    });
    it("SubQuery optTraverse Test, Query B, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.optTraverse({ "COLUMNS": ["rooms_furniture"], "ORDER": "rooms_furniture" }, arr);
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal([true, true]);
    });
    it("SubQuery recurseLogic Test, Query B, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.recurseLogic({}, arr);
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal([]);
    });
    it("SubQuery transfVerse Test, Query B, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker_1.QuerySyntaxChecker();
        var arr = new Array();
        var result = qrc.transfTraverse({ "GROUP": ["rooms_furniture"], "APPLY": [] }, arr);
        Util_1.default.test('Array content: ' + result);
        chai_1.expect(result).to.deep.equal([true, true]);
    });
    it("Attempt Query B, D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_furniture"], "APPLY": [] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.deep.equal('{"result":[{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Learn Lab"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tablets"}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt Query new, D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"], "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }, { "minSeats": { "MIN": "rooms_seats" } }, { "countRoom": { "COUNT": "rooms_shortname" } }, { "sumSeats": { "SUM": "rooms_seats" } }] } }).then(function (result) {
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(result.body)).to.deep.equal('{"result":[{"rooms_shortname":"OSBO","maxSeats":442,"avgSeats":442,"minSeats":442,"countRoom":1,"sumSeats":442},{"rooms_shortname":"HEBB","maxSeats":375,"avgSeats":375,"minSeats":375,"countRoom":1,"sumSeats":375},{"rooms_shortname":"LSC","maxSeats":350,"avgSeats":350,"minSeats":350,"countRoom":1,"sumSeats":700}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("test invalid", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_furniture"], "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }, { "countSeats": { "COUNT": "rooms_seats" } }, { "maxSeats": { "MAX": "rooms_seats" } }, { "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }).then(function (result) {
            chai_1.expect.fail(result);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect(err.code).to.equal(400);
        });
    });
    it("test invalid missing rooms_seats from group", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_furniture"], "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }, { "countSeats": { "COUNT": "rooms_seats" } }, { "maxSeats": { "MAX": "rooms_seats" } }, { "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }).then(function (result) {
            chai_1.expect.fail(result);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect(err.code).to.equal(400);
        });
    });
});
//# sourceMappingURL=QueryResultSpec.js.map