import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import {Unpack} from "../src/controller/Unpack";
import InsightFacade from "../src/controller/InsightFacade"
//import {BuildingInfoParser} from "../src/controller/BuildingInfo";
var fs = require('fs');

describe("QuerySpec", function () {
    var insF: InsightFacade;
    var unP: Unpack;

    before("load full", function() {
    })

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insF = new InsightFacade();
        unP = new Unpack();
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        if(fs.existsSync('./src/controller/database.json')){
            fs.unlinkSync('./src/controller/database.json')
        }
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("courses.zip should return 204", function () {
        this.timeout(20000);
        return insF.addDataset("courses", unP.getFromZip("courses.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(204);
            expect(value.body).to.deep.equal({"Message":"Data Added!"});
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("rooms.zip should return 204", function () {
        this.timeout(20000);
        return insF.addDataset("rooms", unP.getFromZip("rooms.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(204);
            expect(value.body).to.deep.equal({"Message":"Data Added!"});
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("Attempt Empty WHERE: Expected Result: Success, Response Code: 200", function () {
        return insF.performQuery({"WHERE":{"IS": {
            "rooms_name": "DMP_*"
        }}, "OPTIONS":{"COLUMNS":["courses_id"], "ORDER":"courses_id"}}).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test1HardCodedJsonResponse + typeof (test1HardCodedJsonResponse));
            expect(result.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect(err.code).to.equal(400);
        })
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
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            expect(result.code).to.equal(200);
            expect(JSON.stringify(resultFinal)).to.deep.equal('{"result":[{"rooms_name":"DMP_101"},{"rooms_name":"DMP_110"},{"rooms_name":"DMP_201"},{"rooms_name":"DMP_301"},{"rooms_name":"DMP_310"}]}')
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail(err);
        })
    });
});
