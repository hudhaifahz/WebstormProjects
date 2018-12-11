import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import {Unpack} from "../src/controller/Unpack";
import InsightFacade from "../src/controller/InsightFacade"
import {QuerySyntaxChecker} from "../src/controller/QuerySyntaxChecker"
import {BuildingInfoParser} from "../src/controller/BuildingInfo";
var fs = require('fs');


describe("D3Tests", function () {
    var insF: InsightFacade;
    var unP: Unpack;

    before("load full", function () {
    })

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insF = new InsightFacade();
        unP = new Unpack();
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        if (fs.existsSync('./src/controller/database.json')) {
            fs.unlinkSync('./src/controller/database.json')
        }
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("courses.zip should return 204", function (done) {
        this.timeout(20000)
        insF.addDataset("courses", unP.getFromZip("courses.zip").toString("base64")).then(function (value: InsightResponse) {
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(204);
            expect(value.body).to.deep.equal({"Message": "Data Added!"});
        }).then(done,done).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("rooms.zip should return 204", function (done) {
        this.timeout(20000)
        insF.addDataset("rooms", unP.getFromZip("rooms.zip").toString("base64")).then(function (value: InsightResponse) {
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(204);
            expect(value.body).to.deep.equal({"Message": "Data Added!"});
        }).then(done,done).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });

    //basic D3 test: valid transform empty apply { "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"]}, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [] } }
    //valid no oreder transform/; { "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"]}, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "" : { "COUNT": "rooms_shortname" } }] } }
    //basic D2 test: { "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }}
    //valid check transform, apply and count, excludes GT { "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "" : { "COUNT": "rooms_shortname" } }] } }
    //valid check transform, apply and count, includes GT { "WHERE": { "GT": { "rooms_seats": 300 } }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "" : { "COUNT": "rooms_shortname" } }] } }
    //invalid column monkey, apply donkey { "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "monkey"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "donkey": { "MAX": "rooms_seats" } }] } }
    //valid column no string, apply empty string { "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "" : { "MAX": "rooms_seats" } }] } }
    //valid column no string, apply empty, count string { "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "" : { "COUNT": "rooms_shortname" } }] } }

    it("basic D3 test: valid transform empty apply", function () {
        return insF.performQuery({ "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"]}, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            expect(result.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });
    //{ "GROUP": ["rooms_shortname"], "APPLY": [] }
    it("SubQuery Test", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.transfTraverse({ "GROUP": ["rooms_shortname"], "APPLY": [] } , arr)
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal([true, true]);
    });

    it("SubQuery OPTIONS Test", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.optTraverse({ "COLUMNS": ["rooms_shortname"] } , arr)
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal([true]);
    });

    it("valid SubQuery goThroughData Test", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.goThroughData({ "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"]}, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [] } })
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal(true);
    });

    it("valid SubQuery goThroughData Test, APPLY error", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.goThroughData({ "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"]}, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "" : { "COUNT": "rooms_shortname" } }] } })
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal(true);
    });

    it("valid no order transform", function () {
        return insF.performQuery({ "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"]}, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "" : { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            expect(result.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });

    //{ "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"] }}
    it("basic D2 test: column only for rooms_shortname", function () {
        return insF.performQuery({ "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"] }}).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            expect(result.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });

    it("basic D2 test: column and order for rooms_shortname", function () {
        return insF.performQuery({ "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }}).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            expect(result.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });

    it("valid check transform, apply and count, excludes GT", function () {
        return insF.performQuery({ "WHERE": { }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "" : { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            expect(result.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });

    it("valid check transform, apply and count, includes GT", function () {
        return insF.performQuery({ "WHERE": { "GT": { "rooms_seats": 300 } }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "" : { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            expect(result.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });

    it("invalid column monkey, apply donkey ", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "monkey"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "donkey": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            //expect(result.code).to.equal(200);
            expect(resultFinal).to.deep.equal('{"result":[{"rooms_shortname":"HEBB"},{"rooms_shortname":"LSC"},{"rooms_shortname":"LSC"},{"rooms_shortname":"OSBO"}]}');
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect(err.code).to.equal(400);
        });
    });

    it("Attempt valid column no string, apply empty string", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "" : { "MAX": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            expect(result.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });

    it("Attempt valid column no string, apply empty, count string ", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname"], "ORDER": "rooms_shortname" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "" : { "COUNT": "rooms_shortname" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            expect(result.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });

    it("SubQuery goThroughData Test, D2 Query validation, IS based", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.goThroughData({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname"] } })
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal(true);
    });

    it("invalid SubQuery goThroughData Test, maxSeats error", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.goThroughData({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": "maxSeats" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } });
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal(true);
    });

    it("Attempt Query maxSeats is a valid key in column without query, should be 200", function () {
        //{"error":"maxSeats is not a valid key"}
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": "maxSeats" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            expect(result.code).to.equal(200);
            //expect(resultFinal).to.deep.equal('{"result":[{"rooms_shortname":"OSBO","maxSeats":442},{"rooms_shortname":"HEBB","maxSeats":375},{"rooms_shortname":"LSC","maxSeats":350}]}');
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect(err.code).to.equal(400);
        });
    });

    it("SubQuery goThroughData Test, GROUP and APPLY validation should be 200", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.goThroughData({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": "maxSeats" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } })
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal(true);
    });

    it("Attempt Query GROUP and APPLY validation should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": "maxSeats" }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            expect(result.code).to.equal(200);
            //expect(resultFinal).to.deep.equal('{"result":[{"rooms_shortname":"OSBO","maxSeats":442},{"rooms_shortname":"HEBB","maxSeats":375},{"rooms_shortname":"LSC","maxSeats":350}]}');
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });

    it("SubQuery goThroughData Test, Query A D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.goThroughData({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } })
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal(true);
    });

    it("SubQuery optTraverse Test, Query A, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker();
        qrc.apply_strings.push("maxSeats")
        var arr = new Array()
        let result = qrc.optTraverse({ "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] } }, arr)
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal([true, true, true]);
    });

    it("SubQuery recurseLogic Test, Query A, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.recurseLogic({ "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, arr)
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal([true, true]);
    });

    it("Attempt Query A D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            expect(result.code).to.equal(200);
            //expect(resultFinal).to.deep.equal('{"result":[{"rooms_shortname":"OSBO","maxSeats":442},{"rooms_shortname":"HEBB","maxSeats":375},{"rooms_shortname":"LSC","maxSeats":350}]}');
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });


    it("SubQuery goThroughData Test, Query 15, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.goThroughData({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "rooms_address", "rooms_seats", "totalSeats", "avgSeats"], "ORDER": { "dir": "DOWN", "keys": ["totalSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname", "rooms_address", "rooms_seats"], "APPLY": [{ "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } })
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal(true);
    });

    it("SubQuery optTraverse Test, Query 15, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        qrc.apply_strings.push("totalSeats")
        qrc.apply_strings.push("avgSeats")
        let result = qrc.optTraverse({ "COLUMNS": ["rooms_shortname", "rooms_address", "rooms_seats", "totalSeats", "avgSeats"], "ORDER": { "dir": "DOWN", "keys": ["totalSeats"] } }, arr)
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal([true, true, true]);
    });

    it("SubQuery recurseLogic Test, Query 15, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.recurseLogic({ "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, arr)
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal([true, true]);
    });

    it("Attempt Query 15, D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "rooms_address", "rooms_seats", "totalSeats", "avgSeats"], "ORDER": { "dir": "DOWN", "keys": ["totalSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname", "rooms_address", "rooms_seats"], "APPLY": [{ "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test15ResponseR + typeof (test15ResponseR));
            expect(result.code).to.equal(200);
            //expect(resultFinal).to.deep.equal('{"result":[{"rooms_shortname":"LSC","rooms_address":"2350 Health Sciences Mall","rooms_seats":350,"totalSeats":700,"avgSeats":350},{"rooms_shortname":"OSBO","rooms_address":"6108 Thunderbird Boulevard","rooms_seats":442,"totalSeats":442,"avgSeats":442},{"rooms_shortname":"HEBB","rooms_address":"2045 East Mall","rooms_seats":375,"totalSeats":375,"avgSeats":375}]}')
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });

    it("SubQuery goThroughData Test, Query B, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.goThroughData({ "WHERE": {}, "OPTIONS": { "COLUMNS": [ "rooms_furniture" ], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_furniture"], "APPLY": [] } })
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal(true);
    });

    it("SubQuery optTraverse Test, Query B, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.optTraverse({ "COLUMNS": [ "rooms_furniture" ], "ORDER": "rooms_furniture" }, arr)
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal([true, true]);
    });

    it("SubQuery recurseLogic Test, Query B, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.recurseLogic({ }, arr)
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal([]);
    });

    it("SubQuery transfVerse Test, Query B, D3 TEST should be 200", function () {
        var qrc = new QuerySyntaxChecker();
        var arr = new Array()
        let result = qrc.transfTraverse({ "GROUP": ["rooms_furniture"], "APPLY": [] }, arr)
        Log.test('Array content: ' + result);
        expect(result).to.deep.equal([true, true]);
    });

    it("Attempt Query B, D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": [ "rooms_furniture" ], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_furniture"], "APPLY": [] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test15ResponseR + typeof (test15ResponseR));
            expect(result.code).to.equal(200);
            //expect(resultFinal).to.deep.equal('{"result":[{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Learn Lab"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tablets"}]}')
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });

//
    it("Attempt Query new, D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": [ "rooms_shortname", "maxSeats","avgSeats","minSeats","countRoom","sumSeats" ], "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [ { "maxSeats": { "MAX": "rooms_seats" }}, {"avgSeats":{ "AVG":"rooms_seats"} }, {"minSeats":{ "MIN":"rooms_seats"} }, {"countRoom":{ "COUNT":"rooms_shortname"} }, {"sumSeats":{ "SUM":"rooms_seats"} } ] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test15ResponseR + typeof (test15ResponseR));
            expect(result.code).to.equal(200);
            //expect(resultFinal).to.deep.equal('{"result":[{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Learn Lab"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tablets"}]}')
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });


    it("Attempt Query Full Load, D3 TEST should be 200", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }, { "countSeats": { "COUNT": "rooms_seats" } }, { "maxSeats": { "MAX": "rooms_seats" } },{ "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test15ResponseR + typeof (test15ResponseR));
            expect(result.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        });
    });

    it("test invalid", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_furniture"], "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }, { "countSeats": { "COUNT": "rooms_seats" } }, { "maxSeats": { "MAX": "rooms_seats" } },{ "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            //expect(result.code).to.equal(200);
            expect(resultFinal).to.deep.equal('{"result":[{"rooms_shortname":"HEBB"},{"rooms_shortname":"LSC"},{"rooms_shortname":"LSC"},{"rooms_shortname":"OSBO"}]}');
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect(err.code).to.equal(400);
        });
    });

    it("test invalid missing rooms_seats from group", function () {
        return insF.performQuery({ "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_furniture"], "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }, { "countSeats": { "COUNT": "rooms_seats" } }, { "maxSeats": { "MAX": "rooms_seats" } },{ "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }).then(function (result) {
            var resultFinal = result.body;
            //Log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            //Log.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            //expect(result.code).to.equal(200);
            //expect(resultFinal).to.deep.equal('{"result":[{"rooms_shortname":"HEBB"},{"rooms_shortname":"LSC"},{"rooms_shortname":"LSC"},{"rooms_shortname":"OSBO"}]}');
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect(err.code).to.equal(400);
        });
    });


})