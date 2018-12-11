"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var Unpack_1 = require("../src/controller/Unpack");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var fs = require('fs');
describe("QuerySpec", function () {
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
    it("courses.zip should return 204", function () {
        this.timeout(20000);
        return insF.addDataset("courses", unP.getFromZip("courses.zip").toString("base64")).then(function (value) {
            chai_1.expect(value.code).to.equal(204);
            chai_1.expect(value.body).to.deep.equal({ "Message": "Data Added!" });
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("rooms.zip should return 204", function () {
        this.timeout(20000);
        return insF.addDataset("rooms", unP.getFromZip("rooms.zip").toString("base64")).then(function (value) {
            chai_1.expect(value.code).to.equal(204);
            chai_1.expect(value.body).to.deep.equal({ "Message": "Data Added!" });
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("Attempt Empty WHERE: Expected Result: Success, Response Code: 200", function () {
        return insF.performQuery({ "WHERE": { "IS": {
                    "rooms_name": "DMP_*"
                } }, "OPTIONS": { "COLUMNS": ["courses_id"], "ORDER": "courses_id" } }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect(err.code).to.equal(400);
        });
    });
    it("Attempt Empty WHERE: Expected Result: Success, Response Code: 200", function () {
        return insF.performQuery({
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name"
            }
        }).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(resultFinal)).to.deep.equal('{"result":[{"rooms_name":"DMP_101"},{"rooms_name":"DMP_110"},{"rooms_name":"DMP_201"},{"rooms_name":"DMP_301"},{"rooms_name":"DMP_310"}]}');
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail(err);
        });
    });
});
//# sourceMappingURL=QuerySpec.js.map