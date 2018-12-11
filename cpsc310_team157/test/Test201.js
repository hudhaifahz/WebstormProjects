"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var Unpack_1 = require("../src/controller/Unpack");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var fs = require('fs');
describe("IFTest", function () {
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
    it("check expect 204 small load list (courses2.zip)", function () {
        return insF.addDataset("courses", unP.getFromZip("courses2.zip").toString("base64")).then(function (value) {
            chai_1.expect(value.code).to.equal(204);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("check expect 201 small load list (courses.zip)", function () {
        return insF.addDataset("courses", unP.getFromZip("courses2.zip").toString("base64")).then(function (value) {
            Util_1.default.test('Stringified Value: ' + JSON.stringify(value));
            chai_1.expect(value.code).to.equal(201);
            chai_1.expect(value.body).to.deep.equal({ "Message": "Data Updated!" });
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
});
//# sourceMappingURL=Test201.js.map