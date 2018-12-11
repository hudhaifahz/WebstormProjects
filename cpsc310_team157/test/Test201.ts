import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import {Unpack} from "../src/controller/Unpack";
import InsightFacade from "../src/controller/InsightFacade"
var fs = require('fs');

describe("IFTest", function () {
    var insF: InsightFacade;
    var unP: Unpack;

    before("load full", function() {
    })

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insF = new InsightFacade();
        unP = new Unpack();
        //insF.addDataset("courses2.zip", unP.getFromZip("courses2.zip").toString("base64"));
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

    it("check expect 204 small load list (courses2.zip)", function () {
        return insF.addDataset("courses", unP.getFromZip("courses2.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(204);
            //expect(value.body).to.deep.equal('[{"result":[{"tier_eighty_five":1,"tier_ninety":8,"Title":"rsrch methdlgy","Section":"002","Detail":"","tier_seventy_two":0,"Other":1,"Low":89,"tier_sixty_four":0,"id":31379,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":0,"tier_thirty":0,"tier_fifty":0,"Professor":"","Audit":9,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2015","tier_twenty":0,"Stddev":2.65,"Enrolled":20,"tier_fifty_five":0,"tier_eighty":0,"tier_sixty":0,"tier_ten":0,"High":98,"Course":"504","Session":"w","Pass":9,"Fail":0,"Avg":94.44,"Campus":"ubc","Subject":"aanb"},{"tier_eighty_five":1,"tier_ninety":8,"Title":"rsrch methdlgy","Section":"overall","Detail":"","tier_seventy_two":0,"Other":1,"Low":89,"tier_sixty_four":0,"id":31380,"tier_sixty_eight":0,"tier_zero":0,"tier_seventy_six":0,"tier_thirty":0,"tier_fifty":0,"Professor":"","Audit":9,"tier_g_fifty":0,"tier_forty":0,"Withdrew":1,"Year":"2015","tier_twenty":0,"Stddev":2.65,"Enrolled":20,"tier_fifty_five":0,"tier_eighty":0,"tier_sixty":0,"tier_ten":0,"High":98,"Course":"504","Session":"w","Pass":9,"Fail":0,"Avg":94.44,"Campus":"ubc","Subject":"aanb"}],"rank":0}]');
        }).catch(function (err) {
                Log.test('Error: ' + JSON.stringify(err));
                expect.fail();
            })
    });

    it("check expect 201 small load list (courses.zip)", function () {
        return insF.addDataset("courses", unP.getFromZip("courses2.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(201);
            expect(value.body).to.deep.equal({"Message":"Data Updated!"});
        }).catch(function (err) {
                Log.test('Error: ' + JSON.stringify(err));
                expect.fail();
            })
    });

})
