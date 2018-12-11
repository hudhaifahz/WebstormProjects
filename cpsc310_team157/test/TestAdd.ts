import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import {Unpack} from "../src/controller/Unpack";
import InsightFacade from "../src/controller/InsightFacade"
import {BuildingInfoParser} from "../src/controller/BuildingInfo";
var fs = require('fs');

describe("TestAdd", function () {
    var insF: InsightFacade;
    var unP: Unpack;
    var insF2: InsightFacade;
    var unP2: Unpack;

    before("load full", function() {
    })

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insF = new InsightFacade();
        unP = new Unpack();
        //insF2 = new InsightFacade();
        unP2 = new Unpack();
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        if(fs.existsSync('./src/controller/database.json')) {
            fs.unlinkSync('./src/controller/database.json')
        }
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("empty dataset should return 400 error", function () {
        return insF.addDataset("courses", unP.getFromZip("courses1.zip").toString("base64")).then(function (value: InsightResponse) {
                Log.test('Error: ' + value);
                expect.fail();
            }).catch(function (err) {
                //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
                expect(err.code).to.equal(400);
                expect(err.body).to.deep.equal({
                    "error": "Data could not be parsed!"
                });
            })
    });
    it("zip file but not data should return 400 error", function () {
        return insF.addDataset("courses", unP.getFromZip("STSR2395741.zip").toString("base64")).then(function (value: InsightResponse) {
                Log.test('Error: ' + value);
                expect.fail();
            }).catch(function (err: InsightResponse) {
                //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
                expect(err.code).to.equal(400);
                expect(err.body).to.deep.equal({
                    "error": "Data could not be parsed!"
                });
            })
    });
    it("7z not a zip file should return 400 error", function () {
        return insF.addDataset("courses", unP.getFromZip("STSR2395741.7z").toString("base64")).then(function (value: InsightResponse) {
                Log.test('Error: ' + value);
                expect.fail();
            }).catch(function (err) {
                //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
                expect(err.code).to.equal(400);
                expect(err.body).to.deep.equal({ error: 'Not a zip file!' });
            })
    });

    it("OPTIONAL: data missing from zip return 204 after skipping bad parts", function () { //is this a good test?
        return insF.addDataset("broken", unP.getFromZip("broken.zip").toString("base64")).then(function (value: InsightResponse) {
                Log.test('Value: ' + JSON.stringify(value));
                expect(value.code).to.equal(204);
                expect(value.body).to.deep.equal({"Message":"Data Added!"});
            }).catch(function (err: InsightResponse) {
                Log.test('Value: ' + err);
                expect.fail(err);
            })
    });

    it("OPTIONAL:zip file with data but also other things should return 204 after skipping bad parts", function () {
        return insF.addDataset("mixed", unP.getFromZip("mixed.zip").toString("base64")).then(function (value: InsightResponse) {
            Log.test('Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(204);
            expect(value.body).to.deep.equal({"Message":"Data Added!"});
            }).catch(function (err) {
                expect.fail(err);
            })
    });


    it("txt to zip file (corrupted) should return 400 error", function () {
        return insF.addDataset("courses", unP.getFromZip("zip.zip").toString("base64")).then(function (value: InsightResponse) {
                Log.test('Error: ' + value);
                expect.fail();
            }).catch(function (err: InsightResponse) {
                //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
                expect(err.code).to.equal(400);
                expect(err.body).to.deep.equal({
                    "error": "Not a zip file!"
                });
            })
    });
    it("folder in folder zip should return 400 error", function () { //is this a good test?
        return insF.addDataset("courses", unP.getFromZip("zip.zip").toString("base64")).then(function (value: InsightResponse) {
                Log.test('Error: ' + value); //currently printing error promise, as it didn't fail
                expect.fail();
            }).catch(function (err: InsightResponse) {
                //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
                expect(err.code).to.equal(400);
                expect(err.body).to.deep.equal({
                    "error": "Not a zip file!"
                });
            })
    });

    it("courses should return 204", function () {
        this.timeout(10000)
        return insF.addDataset("courses", unP.getFromZip("courses.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(204);
            expect(value.body).to.deep.equal({"Message":"Data Added!"});
        }).catch(function (err) {
            Log.test('Error: ' + err);
            Log.test('Stringified Value: ' + JSON.stringify(err));
            expect.fail();
        })
    });



    it("courses UNHANDLED PROMISE REJECTION should return 201", function () {
        this.timeout(100000);
        return insF.addDataset("courses", unP.getFromZip("courses.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(204);
            expect(value.body).to.deep.equal({"Message":"Data Added!"});
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    })

    it("rooms should return 204", function () {
        this.timeout(20000);
        return insF.addDataset("rooms", unP.getFromZip("rooms.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(204);
            expect(value.body).to.deep.equal({"Message":"Data Added!"});
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        })
    });

    it("rooms should return 400, destructured rooms.zip", function () {
        this.timeout(20000);
        return insF.addDataset("rooms", unP.getFromZip("rooms33.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            expect.fail();
            expect(value.body).to.deep.equal({"Message":"Data Added!"});
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect(err.code).to.equal(400);

        })
    });

    it("check query1 correct", function () {
        var query = fs.readFileSync('query1.json', 'utf8');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (value: InsightResponse) {
            //Log.test('Value: ' + value);
            Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(200);
            }).catch(function (err) {
                Log.test('Error: ' + err);
                expect.fail();
            })
    })

    it("check query2 correct", function () {
        var query = fs.readFileSync('query2.json', 'utf8');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (value: InsightResponse) {
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(200);
            }).catch(function (err) {
                Log.test('Error: ' + err);
                expect.fail();
            })
    })

    it("check query, bad query, reject 400", function () {
        //var query = fs.readFileSync('query1.json');
        //query = JSON.parse(query);
        return insF.performQuery("cpsc").then(function (result) {
            var resultFinal = result.body;
            //log.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            expect(result.code).to.equal(400);
        }).catch(function (err) {
            //log.test('Error: ' + JSON.stringify(err));
            expect(JSON.stringify(err)).to.equal('{"code":400,"body":{"error":"Query invalid!"}}');
        });
    })

    it("check query4, rooms invalid wildcard ***", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query4.json');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        }).catch(function (value: InsightResponse) {
            Log.test('Value: ' + JSON.stringify(value));
            Log.test('Stringified Value: ' + value.body);
            expect(value.code).to.equal(400);
        })
    })

    it("check query5, rooms invalid wildcard *A*N*", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query5.json');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        }).catch(function (value: InsightResponse) {
            Log.test('Value: ' + JSON.stringify(value));
            Log.test('Stringified Value: ' + value.body);
            expect(value.code).to.equal(400);
        })
    })

    it("check query6, rooms invalid ORDER key 1", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query6.json');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        }).catch(function (value: InsightResponse) {
            Log.test('Value: ' + JSON.stringify(value));
            Log.test('Stringified Value: ' + value.body);
            expect(value.code).to.equal(400);
        })
    })

    it("check query7, rooms invalid ORDER key 2", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query7.json');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        }).catch(function (value: InsightResponse) {
            Log.test('Value: ' + JSON.stringify(value));
            Log.test('Stringified Value: ' + value.body);
            expect(value.code).to.equal(400);
        })
    })

    it("check query8, rooms invalid key", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query8.json');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        }).catch(function (value: InsightResponse) {
            Log.test('Value: ' + JSON.stringify(value));
            Log.test('Stringified Value: ' + value.body);
            expect(value.code).to.equal(400);
        })
    })

    it("check query9, rooms invalid value", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query9.json');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        }).catch(function (value: InsightResponse) {
            Log.test('Value: ' + JSON.stringify(value));
            Log.test('Stringified Value: ' + value.body);
            expect(value.code).to.equal(400);
        })
    })

    it("check query11txt, ACCEPTING NON JSON FILE but with JSON FORM rooms checks all APPLY ops", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query11txt');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (value) {
            Log.test('Value: ' + value);
            Log.test('Stringified Value: ' + value.body);
            expect(value.code).to.equal(200);
        }).catch(function (err: InsightResponse) {
            //Log.test('Value: ' + value);
            Log.test('Stringified Value: ' + JSON.stringify(err));
            expect.fail();
        })
    })

    it("check query11.txt, ACCEPTING NON JSON FILE but with JSON FORM rooms checks all APPLY ops", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query11.txt');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (value) {
            Log.test('Value: ' + value);
            Log.test('Stringified Value: ' + value.body);
            expect(value.code).to.equal(200);
        }).catch(function (err: InsightResponse) {
            //Log.test('Value: ' + value);
            Log.test('Stringified Value: ' + JSON.stringify(err));
            expect.fail();
        })
    })

    it("check query11.json, rooms checks all APPLY ops", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query11.json');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (value) {
            Log.test('Value: ' + value);
            Log.test('Stringified Value: ' + value.body);
            expect(value.code).to.equal(200);
        }).catch(function (err: InsightResponse) {
            //Log.test('Value: ' + value);
            Log.test('Stringified Value: ' + JSON.stringify(err));
            expect.fail();
        })
    })

    it("check query10, rooms valid query (empty WHERE)", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query10.json');
        query = JSON.parse(query);
        var insf2 = new InsightFacade();
        return insf2.performQuery(query).then(function (value: InsightResponse) {
            Log.test('Value: ' + value);
            Log.test('Stringified Value: ' + value.body);
            expect(value.code).to.equal(200);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        })
    })

    it("check query3, rooms", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query3.json');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (value: InsightResponse) {
            Log.test('Value: ' + value);
            Log.test('Stringified Value: ' + value.body);
            Log.test('Length: ' + Object.keys(JSON.stringify(value.body)).length)
            Log.test('Length: ' + Object.keys(JSON.stringify({"result":[{"rooms_name":"AERL_120"},{"rooms_name":"ALRD_105"},{"rooms_name":"ALRD_121"},{"rooms_name":"ALRD_B101"},{"rooms_name":"ANGU_037"},{"rooms_name":"ANGU_039"},{"rooms_name":"ANGU_098"},{"rooms_name":"ANGU_234"},{"rooms_name":"ANGU_235"},{"rooms_name":"ANGU_237"},{"rooms_name":"ANGU_241"},{"rooms_name":"ANGU_243"},{"rooms_name":"ANGU_291"},{"rooms_name":"ANGU_295"},{"rooms_name":"ANGU_334"},{"rooms_name":"ANGU_335"},{"rooms_name":"ANGU_343"},{"rooms_name":"ANGU_345"},{"rooms_name":"ANGU_347"},{"rooms_name":"ANGU_350"},{"rooms_name":"ANGU_354"},{"rooms_name":"ANGU_434"},{"rooms_name":"ANSO_203"},{"rooms_name":"ANSO_205"},{"rooms_name":"ANSO_207"},{"rooms_name":"BIOL_2000"},{"rooms_name":"BIOL_2200"},{"rooms_name":"BRKX_2365"},{"rooms_name":"BUCH_A101"},{"rooms_name":"BUCH_A102"},{"rooms_name":"BUCH_A103"},{"rooms_name":"BUCH_A104"},{"rooms_name":"BUCH_A201"},{"rooms_name":"BUCH_A202"},{"rooms_name":"BUCH_A203"},{"rooms_name":"BUCH_B208"},{"rooms_name":"BUCH_B209"},{"rooms_name":"BUCH_B210"},{"rooms_name":"BUCH_B211"},{"rooms_name":"BUCH_B213"},{"rooms_name":"BUCH_B215"},{"rooms_name":"BUCH_B218"},{"rooms_name":"BUCH_B219"},{"rooms_name":"BUCH_B302"},{"rooms_name":"BUCH_B303"},{"rooms_name":"BUCH_B304"},{"rooms_name":"BUCH_B306"},{"rooms_name":"BUCH_B307"},{"rooms_name":"BUCH_B308"},{"rooms_name":"BUCH_B309"},{"rooms_name":"BUCH_B310"},{"rooms_name":"BUCH_B313"},{"rooms_name":"BUCH_B315"},{"rooms_name":"BUCH_B319"},{"rooms_name":"BUCH_D213"},{"rooms_name":"BUCH_D216"},{"rooms_name":"BUCH_D217"},{"rooms_name":"BUCH_D218"},{"rooms_name":"BUCH_D219"},{"rooms_name":"BUCH_D222"},{"rooms_name":"BUCH_D228"},{"rooms_name":"BUCH_D301"},{"rooms_name":"BUCH_D304"},{"rooms_name":"BUCH_D306"},{"rooms_name":"BUCH_D307"},{"rooms_name":"BUCH_D312"},{"rooms_name":"BUCH_D313"},{"rooms_name":"BUCH_D314"},{"rooms_name":"BUCH_D316"},{"rooms_name":"BUCH_D317"},{"rooms_name":"BUCH_D322"},{"rooms_name":"CEME_1202"},{"rooms_name":"CEME_1204"},{"rooms_name":"CEME_1212"},{"rooms_name":"CEME_1215"},{"rooms_name":"CHBE_101"},{"rooms_name":"CHBE_102"},{"rooms_name":"CHEM_B150"},{"rooms_name":"CHEM_B250"},{"rooms_name":"CHEM_C124"},{"rooms_name":"CHEM_C126"},{"rooms_name":"CHEM_D200"},{"rooms_name":"CHEM_D300"},{"rooms_name":"CIRS_1250"},{"rooms_name":"DMP_110"},{"rooms_name":"DMP_301"},{"rooms_name":"DMP_310"},{"rooms_name":"ESB_1012"},{"rooms_name":"ESB_1013"},{"rooms_name":"ESB_2012"},{"rooms_name":"FNH_20"},{"rooms_name":"FNH_320"},{"rooms_name":"FNH_40"},{"rooms_name":"FNH_50"},{"rooms_name":"FNH_60"},{"rooms_name":"FORW_303"},{"rooms_name":"FRDM_153"},{"rooms_name":"FSC_1001"},{"rooms_name":"FSC_1003"},{"rooms_name":"FSC_1005"},{"rooms_name":"FSC_1221"},{"rooms_name":"GEOG_100"},{"rooms_name":"GEOG_212"},{"rooms_name":"GEOG_214"},{"rooms_name":"GEOG_242"},{"rooms_name":"HEBB_10"},{"rooms_name":"HEBB_100"},{"rooms_name":"HEBB_12"},{"rooms_name":"HEBB_13"},{"rooms_name":"HENN_200"},{"rooms_name":"HENN_201"},{"rooms_name":"HENN_202"},{"rooms_name":"IBLC_155"},{"rooms_name":"IBLC_182"},{"rooms_name":"IBLC_192"},{"rooms_name":"IBLC_193"},{"rooms_name":"IBLC_194"},{"rooms_name":"IBLC_263"},{"rooms_name":"IBLC_266"},{"rooms_name":"IBLC_461"},{"rooms_name":"IONA_301"},{"rooms_name":"LASR_102"},{"rooms_name":"LASR_104"},{"rooms_name":"LASR_105"},{"rooms_name":"LASR_107"},{"rooms_name":"LSC_1001"},{"rooms_name":"LSC_1002"},{"rooms_name":"LSC_1003"},{"rooms_name":"LSK_200"},{"rooms_name":"LSK_201"},{"rooms_name":"MATH_100"},{"rooms_name":"MATH_105"},{"rooms_name":"MATH_202"},{"rooms_name":"MATH_204"},{"rooms_name":"MATH_225"},{"rooms_name":"MATX_1100"},{"rooms_name":"MCLD_202"},{"rooms_name":"MCLD_228"},{"rooms_name":"MCML_158"},{"rooms_name":"MCML_160"},{"rooms_name":"MCML_166"},{"rooms_name":"MCML_360A"},{"rooms_name":"MCML_360B"},{"rooms_name":"MCML_360C"},{"rooms_name":"MCML_360D"},{"rooms_name":"MCML_360E"},{"rooms_name":"MCML_360F"},{"rooms_name":"MCML_360G"},{"rooms_name":"MCML_360H"},{"rooms_name":"MCML_360J"},{"rooms_name":"MCML_360K"},{"rooms_name":"MCML_360L"},{"rooms_name":"MGYM_206"},{"rooms_name":"MGYM_208"},{"rooms_name":"ORCH_1001"},{"rooms_name":"ORCH_3004"},{"rooms_name":"ORCH_3016"},{"rooms_name":"ORCH_3018"},{"rooms_name":"ORCH_3052"},{"rooms_name":"ORCH_3062"},{"rooms_name":"ORCH_3068"},{"rooms_name":"ORCH_3072"},{"rooms_name":"ORCH_4002"},{"rooms_name":"ORCH_4004"},{"rooms_name":"ORCH_4016"},{"rooms_name":"ORCH_4018"},{"rooms_name":"ORCH_4052"},{"rooms_name":"ORCH_4062"},{"rooms_name":"ORCH_4072"},{"rooms_name":"ORCH_4074"},{"rooms_name":"OSBO_203B"},{"rooms_name":"PCOH_1003"},{"rooms_name":"PCOH_1008"},{"rooms_name":"PHRM_1101"},{"rooms_name":"PHRM_1201"},{"rooms_name":"SCRF_100"},{"rooms_name":"SCRF_201"},{"rooms_name":"SCRF_203"},{"rooms_name":"SOWK_124"},{"rooms_name":"SOWK_222"},{"rooms_name":"SOWK_223"},{"rooms_name":"SOWK_224"},{"rooms_name":"SPPH_143"},{"rooms_name":"SPPH_B108"},{"rooms_name":"SPPH_B151"},{"rooms_name":"SWNG_121"},{"rooms_name":"SWNG_122"},{"rooms_name":"SWNG_221"},{"rooms_name":"SWNG_222"},{"rooms_name":"SWNG_406"},{"rooms_name":"SWNG_408"},{"rooms_name":"UCLL_103"},{"rooms_name":"UCLL_109"},{"rooms_name":"WESB_100"},{"rooms_name":"WESB_201"},{"rooms_name":"WOOD_1"},{"rooms_name":"WOOD_2"},{"rooms_name":"WOOD_3"},{"rooms_name":"WOOD_4"},{"rooms_name":"WOOD_5"},{"rooms_name":"WOOD_6"},{"rooms_name":"WOOD_B79"}]})).length)
            expect(value.code).to.equal(200);
            //expect(value.body).to.deep.equal('Query invalid');
            expect(Object.keys(JSON.stringify(value.body)).length).to.deep.equal(5328);
        }).catch(function (err) {
            Log.test('Error: ' + JSON.stringify(err));
            expect.fail();
        })
    })

    it("lat lon test", function () {
        var BIP = new BuildingInfoParser();
        return BIP.getLatLon('6245 Agronomy Road V6T 1Z4', '157')
            .then(function (result) {
                console.log(result);
            })
            .catch(function (err) {
                console.log(err);
            })
    });

    //============================================ RUN LAST

    it("empty cache", function () {
      if(fs.existsSync('./src/controller/database.json')){
          fs.unlinkSync('./src/controller/database.json')
      }
    })


    it("check query1 no dataset", function () {
        if(fs.existsSync('./src/controller/database.json')){
            fs.unlinkSync('./src/controller/database.json')
        }
        var query = fs.readFileSync('query1.json', 'utf8');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (value: InsightResponse) {
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(424);
            //expect(value.body).to.deep.equal({ error: 'No datasets avaialable' });
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(JSON.stringify(err)).to.equal('{"code":424,"body":{"error":"No datasets avaialable"}}');
        })
    })

    it("check query2 no dataset", function () {
        if(fs.existsSync('./src/controller/database.json')){
            fs.unlinkSync('./src/controller/database.json')
        }
        var query = fs.readFileSync('query1.json', 'utf8');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (value: InsightResponse) {
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            expect(value.code).to.equal(424);
            //expect(value.body).to.deep.equal({ error: 'No datasets avaialable' });
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect(JSON.stringify(err)).to.equal('{"code":424,"body":{"error":"No datasets avaialable"}}');
        })
    })

    it("ARSENIC", function () {
        this.timeout(20000)
        return insF.addDataset("courses", unP.getFromZip("courses.zip").toString("base64")).then(function() {
            return insF.addDataset("rooms", unP.getFromZip("rooms.zip").toString("base64"));
        })
    })

    //ARSENIC

//passes but is double return really testing it?
    it("aresenic/cobalt 1", function () {
        this.timeout(20000);
        return insF.addDataset("rooms", unP.getFromZip("rooms.310.zip").toString("base64")).then(function (value: InsightResponse){
            expect(value.code).to.equal(204);}).then(function () {
            return insF.removeDataset("rooms").then(function (valuex: InsightResponse){
                expect(valuex.code).to.equal(204);}).then(function () {
                return insF.addDataset("rooms", unP.getFromZip("rooms.310.zip").toString("base64")).then(function (value: InsightResponse){
                    expect(value.code).to.equal(204);}).then(function () {
                    return insF.addDataset("rooms", unP.getFromZip("rooms.310.zip").toString("base64")).then(function (value: InsightResponse){
                        expect(value.code).to.equal(201);}).then(function () {
                        return insF.removeDataset("rooms").then(function (valuex: InsightResponse){
                            expect(valuex.code).to.equal(204);})
                    })
                })
            }).catch(function (err) {
                Log.test('Error: ' + err);
                expect.fail();
            })
            //expect(value.code).to.equal(204);
            //expect(value.body).to.deep.equal({"Message":"Data Added!"});
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("aresenic/cobalt 1.1", function () {
        this.timeout(20000);
        return insF.addDataset("rooms", unP.getFromZip("rooms.310.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            //var insF2 = new InsightFacade();
            expect(value.code).to.equal(204);
            insF2 = new InsightFacade();
            return insF2.addDataset("rooms", unP2.getFromZip("rooms.310.zip").toString("base64")).then(function (valuex: InsightResponse){
                Log.test('Value: ' + valuex);
                Log.test('Stringified Value: ' + JSON.stringify(valuex));
                expect(valuex.code).to.equal(201);
                //expect(valuex.body).to.deep.equal({"Message":"Data Added!"});
            }).catch(function (err) {
                Log.test('Error: ' + err);
                expect.fail();
            })
            //expect(value.code).to.equal(204);
            //expect(value.body).to.deep.equal({"Message":"Data Added!"});
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("aresenic/cobalt 2", function () {
        this.timeout(20000);
        return insF.addDataset("rooms", unP.getFromZip("rooms.310.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            //var insF2 = new InsightFacade();
            expect(value.code).to.equal(204);}).then(function () {
            return insF.addDataset("rooms", unP.getFromZip("rooms.zip").toString("base64")).then(function (valuex: InsightResponse){
                Log.test('Value: ' + valuex);
                Log.test('Stringified Value: ' + JSON.stringify(valuex));
                expect(valuex.code).to.equal(201);
                //expect(valuex.body).to.deep.equal({"Message":"Data Added!"});
            }).catch(function (err) {
                Log.test('Error: ' + err);
                expect.fail();
            })
            //expect(value.code).to.equal(204);
            //expect(value.body).to.deep.equal({"Message":"Data Added!"});
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("aresenic/cobalt 3", function () {
        this.timeout(20000);
        return insF.addDataset("courses", unP.getFromZip("courses.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            //var insF2 = new InsightFacade();
            expect(value.code).to.equal(201);}).then(function () {
            return insF.addDataset("rooms", unP.getFromZip("rooms.310.zip").toString("base64")).then(function (valuex: InsightResponse){
                Log.test('Value: ' + valuex);
                Log.test('Stringified Value: ' + JSON.stringify(valuex));
                expect(valuex.code).to.equal(201);
                //expect(valuex.body).to.deep.equal({"Message":"Data Added!"});
            }).catch(function (err) {
                Log.test('Error: ' + err);
                expect.fail();
            })
            //expect(value.code).to.equal(204);
            //expect(value.body).to.deep.equal({"Message":"Data Added!"});
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });

    it("aresenic/cobalt 4", function () {
        this.timeout(20000);
        return insF.addDataset("courses", unP.getFromZip("courses.zip").toString("base64")).then(function (value: InsightResponse){
            //Log.test('Value: ' + value);
            //Log.test('Stringified Value: ' + JSON.stringify(value));
            //var insF2 = new InsightFacade();
            expect(value.code).to.equal(201);}).then(function () {
            return insF.addDataset("courses", unP.getFromZip("courses.zip").toString("base64")).then(function (valuex: InsightResponse){
                Log.test('Value: ' + valuex);
                Log.test('Stringified Value: ' + JSON.stringify(valuex));
                expect(valuex.code).to.equal(201);
                //expect(valuex.body).to.deep.equal({"Message":"Data Added!"});
            }).catch(function (err) {
                Log.test('Error: ' + err);
                expect.fail();
            })
            //expect(value.code).to.equal(204);
            //expect(value.body).to.deep.equal({"Message":"Data Added!"});
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });

});
