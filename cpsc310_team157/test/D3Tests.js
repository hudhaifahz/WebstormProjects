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
    it("basic D3 test: valid transform empty apply", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"] }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [] } }).then(function (result) {
            var resultFinal = result.body;
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
    it("valid no order transform", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"] }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "": { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("basic D2 test: column only for rooms_shortname", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("basic D2 test: column and order for rooms_shortname", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("valid check transform, apply and count, excludes GT", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "": { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("valid check transform, apply and count, includes GT", function () {
        return insF.performQuery({ "WHERE": { "GT": { "rooms_seats": 300 } }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "": { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("invalid column monkey, apply donkey ", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "monkey"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "donkey": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(resultFinal).to.deep.equal('{"result":[{"rooms_shortname":"HEBB"},{"rooms_shortname":"LSC"},{"rooms_shortname":"LSC"},{"rooms_shortname":"OSBO"}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect(err.code).to.equal(400);
        });
    });
    it("Attempt valid column no string, apply empty string", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt valid column no string, apply empty, count string ", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "": { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
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
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
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
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
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
    it("Attempt Query A D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
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
    it("Attempt Query 15, D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "rooms_address", "rooms_seats", "totalSeats", "avgSeats"], "ORDER": { "dir": "DOWN", "keys": ["totalSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname", "rooms_address", "rooms_seats"], "APPLY": [{ "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
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
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt Query new, D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"], "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }, { "minSeats": { "MIN": "rooms_seats" } }, { "countRoom": { "COUNT": "rooms_shortname" } }, { "sumSeats": { "SUM": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt Query Full Load, D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }, { "countSeats": { "COUNT": "rooms_seats" } }, { "maxSeats": { "MAX": "rooms_seats" } }, { "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("test invalid", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_furniture"], "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }, { "countSeats": { "COUNT": "rooms_seats" } }, { "maxSeats": { "MAX": "rooms_seats" } }, { "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(resultFinal).to.deep.equal('{"result":[{"rooms_shortname":"HEBB"},{"rooms_shortname":"LSC"},{"rooms_shortname":"LSC"},{"rooms_shortname":"OSBO"}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect(err.code).to.equal(400);
        });
    });
    it("test invalid missing rooms_seats from group", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_furniture"], "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }, { "countSeats": { "COUNT": "rooms_seats" } }, { "maxSeats": { "MAX": "rooms_seats" } }, { "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect(err.code).to.equal(400);
        });
    });
});
//# sourceMappingURL=D3Tests.js.map