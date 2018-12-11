import Server from "../src/rest/Server";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
import {Unpack} from "../src/controller/Unpack";
import InsightFacade from "../src/controller/InsightFacade"
import {QuerySyntaxChecker} from "../src/controller/QuerySyntaxChecker"
import {BuildingInfoParser} from "../src/controller/BuildingInfo";
import chai = require('chai');
import chaiHttp = require('chai-http');
import Response = ChaiHttp.Response;
import restify = require('restify');
var fs = require('fs');


describe("RESTSpec", function () {

    // Init
    chai.use(chaiHttp);
    let server = new Server(4321);
    let URL = "http://127.0.0.1:4321";

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);

        function sanityCheck(response: InsightResponse) {
            expect(response).to.have.property('code');
            expect(response).to.have.property('body');
            expect(response.code).to.be.a('number');
        }

        server.start();

    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        server.stop();
        if (fs.existsSync('./src/controller/database.json')) {
            fs.unlinkSync('./src/controller/database.json')
        }
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });


        it("POST 424, unhandled promis rejection?", function () {

            let query = {
                "WHERE": {"AND": [{"IS": {"rooms_furniture": "*Tables*"}}, {"GT": {"rooms_seats": 300}}]},
                "OPTIONS": {
                    "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"],
                    "ORDER": {"dir": "DOWN", "keys": ["maxSeats"]}
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{"maxSeats": {"MAX": "rooms_seats"}}, {"avgSeats": {"AVG": "rooms_seats"}}, {"minSeats": {"MIN": "rooms_seats"}}, {"countRoom": {"COUNT": "rooms_shortname"}}, {"sumSeats": {"SUM": "rooms_seats"}}]
                }
            }

                return chai.request(URL)
                    .post('/query')
                    .send(query)
                    .then(function (res: Response) {
                        Log.trace('then:');
                        })
                    .catch(function (err) {
                        Log.trace('catch:' + err);
                        // some assertions
                        expect(err.status).to.equal(424)
                        //expect.fail();
                    });

        });

        it("PUT description ?", function () {
            this.timeout(5000);
            return chai.request(URL)
                .put('/dataset/rooms')
                .attach("body", fs.readFileSync("./rooms.zip"), "rooms.zip")
                .then(function (res: Response) {
                    Log.trace('then:');
                    // some assertions
                    expect(res.status).to.equal(204)
                    expect(res.body).to.deep.equal({"Message":"Data Added!"})
                })
                .catch(function (err) {
                    Log.trace('catch:' + err);
                    console.log('------');
                    // some assertions
                    expect.fail();
                });
        });

        it("PUT description", function () {


            this.timeout(5000);
            return chai.request(URL)
                .put('/dataset/rooms')
                .attach("body", fs.readFileSync("./rooms.zip"), "rooms.zip")
                .then(function (res: Response) {
                    Log.trace('then:');
                    // some assertions
                    expect(res.status).to.equal(201)
                    //expect(res.body).to.deep.equal('{"Message":"Data Updated!"}')
                })
                .catch(function (err) {
                    Log.trace('catch:' + err);
                    console.log('------');
                    // some assertions
                    expect.fail();
                });
        });

        it("PUT description", function () {

            this.timeout(5000);
            return chai.request(URL)
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("./courses.zip"), "courses.zip")
                .then(function (res: Response) {
                    Log.trace('then:');
                    // some assertions
                    expect(res.status).to.equal(204)
                    //expect(res.body).to.deep.equal('{"Message":"Data Added!"}')
                })
                .catch(function (err) {
                    Log.trace('catch:' + err);
                    console.log('------');
                    // some assertions
                    expect.fail();
                });
        });

        it("PUT description", function () {

            this.timeout(5000);
            return chai.request(URL)
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("./courses.zip"), "courses.zip")
                .then(function (res: Response) {
                    Log.trace('then:');
                    // some assertions
                    expect(res.status).to.equal(201)
                    //expect(res.body).to.deep.equal('{"Message":"Data Added!"}')
                })
                .catch(function (err) {
                    Log.trace('catch:' + err);
                    console.log('------');
                    // some assertions
                    expect.fail();
                });
        });

        it("POST 200", function () {


            let query = {
                "WHERE": {"AND": [{"IS": {"rooms_furniture": "*Tables*"}}, {"GT": {"rooms_seats": 300}}]},
                "OPTIONS": {
                    "COLUMNS": ["rooms_shortname", "maxSeats", "avgSeats", "minSeats", "countRoom", "sumSeats"],
                    "ORDER": {"dir": "DOWN", "keys": ["maxSeats"]}
                },
                "TRANSFORMATIONS": {
                    "GROUP": ["rooms_shortname"],
                    "APPLY": [{"maxSeats": {"MAX": "rooms_seats"}}, {"avgSeats": {"AVG": "rooms_seats"}}, {"minSeats": {"MIN": "rooms_seats"}}, {"countRoom": {"COUNT": "rooms_shortname"}}, {"sumSeats": {"SUM": "rooms_seats"}}]
                }
            }

            return chai.request(URL)
                .post('/query')
                .send(query)
                .then(function (res: Response) {
                    Log.trace('then:');
                    // some assertions
                    expect(res.status).to.equal(200)
                    //expect(res.body).to.deep.equal('{"result":[{"rooms_shortname":"OSBO","maxSeats":442,"avgSeats":442,"minSeats":442,"countRoom":1,"sumSeats":442},{"rooms_shortname":"HEBB","maxSeats":375,"avgSeats":375,"minSeats":375,"countRoom":1,"sumSeats":375},{"rooms_shortname":"LSC","maxSeats":350,"avgSeats":350,"minSeats":350,"countRoom":1,"sumSeats":700}]}')
                })
                .catch(function (err) {
                    Log.trace('catch:' + err);
                    // some assertions
                    expect.fail();
                });
        });

        it("POST 200", function () {


            let query = { "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "ORDER": "rooms_furniture" }, "TRANSFORMATIONS": { "GROUP": ["rooms_fullname", "rooms_shortname", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_number", "rooms_seats", "rooms_href", "rooms_type", "rooms_furniture"], "APPLY": [{ "minSeats": { "MIN": "rooms_seats" } }, { "countSeats": { "COUNT": "rooms_seats" } }, { "maxSeats": { "MAX": "rooms_seats" } },{ "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } }

            return chai.request(URL)
                .post('/query')
                .send(query)
                .then(function (res: Response) {
                    Log.trace('then:');
                    // some assertions
                    expect(res.status).to.equal(200)
                    //expect(res.body).to.deep.equal('{"result":[{"rooms_shortname":"OSBO","maxSeats":442,"avgSeats":442,"minSeats":442,"countRoom":1,"sumSeats":442},{"rooms_shortname":"HEBB","maxSeats":375,"avgSeats":375,"minSeats":375,"countRoom":1,"sumSeats":375},{"rooms_shortname":"LSC","maxSeats":350,"avgSeats":350,"minSeats":350,"countRoom":1,"sumSeats":700}]}')
                })
                .catch(function (err) {
                    Log.trace('catch:' + err);
                    // some assertions
                    //expect(err.status).to.equal(400)
                    expect.fail();
                });
        });

        it("PUT description", function () {

            this.timeout(5000)
            return chai.request(URL)
                .put('/dataset/courses')
                .attach("body", fs.readFileSync("./courses.zip"), "courses.zip")
                .then(function (res: Response) {
                    Log.trace('then:');
                    // some assertions
                    expect(res.status).to.equal(201)
                    //expect(res.body).to.deep.equal('{"Message":"Data Added!"}')
                })
                .catch(function (err) {
                    Log.trace('catch:' + err);
                    console.log('------');
                    // some assertions
                    expect.fail();
                });
        });
});