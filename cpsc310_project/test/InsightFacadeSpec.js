"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InsightFacade_1 = require("../src/controller/InsightFacade");
var chai_1 = require("chai");
var fs = require("fs");
var DataController_1 = require("../src/controller/DataController");
describe("InsightFacade.addDataset", function () {
    var insightFacade = null;
    var courses;
    var rooms;
    before(function () {
        this.timeout(10000);
        courses = fs.readFileSync('test/courses.zip').toString('base64');
        rooms = fs.readFileSync('test/rooms.zip').toString('base64');
    });
    beforeEach(function () {
        insightFacade = new InsightFacade_1.default(false);
    });
    afterEach(function () {
        insightFacade = null;
    });
    it('should add courses to the dataset successfully', function () {
        this.timeout(10000);
        return insightFacade.addDataset("courses", courses)
            .then(function (response) {
            chai_1.expect(response).to.deep.eq({
                code: 204,
                body: {}
            });
        });
    });
    it('should add rooms to the dataset successfully', function () {
        this.timeout(10000);
        return insightFacade.addDataset("rooms", rooms)
            .then(function (response) {
            chai_1.expect(response).to.deep.eq({
                code: 204,
                body: {}
            });
        });
    });
    it('should add an id to the dataset successfully twice', function () {
        this.timeout(10000);
        return insightFacade.addDataset("courses", courses).then(function (response) {
            chai_1.expect(response).to.deep.eq({
                code: 204,
                body: {}
            });
            return insightFacade.addDataset("courses", courses);
        }).then(function (response) {
            chai_1.expect(response).to.deep.eq({
                code: 201,
                body: {}
            });
        });
    });
    it('should cache a dataset and load the data', function () {
        this.timeout(10000);
        DataController_1.default.resetCache();
        insightFacade = new InsightFacade_1.default(true);
        return insightFacade.addDataset("courses", courses).then(function (response) {
            chai_1.expect(response).to.deep.eq({
                code: 204,
                body: {}
            });
            insightFacade = new InsightFacade_1.default(true);
            return insightFacade.addDataset("courses", courses);
        }).then(function (response) {
            chai_1.expect(response).to.deep.eq({
                code: 201,
                body: {}
            });
        });
    });
    it('should fail to add an invalid dataset', function () {
        return insightFacade.addDataset("courses", null).then(function (response) {
            throw new Error("Should not have gotten response: " + response);
        }, function (err) {
            chai_1.expect(err).to.deep.eq({
                code: 400,
                body: {
                    error: "Error loading zipfile"
                }
            });
        });
    });
});
describe("InsightFacade.removeDataset", function () {
    var insightFacade = null;
    beforeEach(function () {
        insightFacade = new InsightFacade_1.default(false);
        insightFacade._addDataset('courses', []);
    });
    afterEach(function () {
        insightFacade = null;
    });
    it('should remove an existing ID successfully', function () {
        return insightFacade.removeDataset("courses").then(function (response) {
            chai_1.expect(response).to.deep.eq({
                code: 204,
                body: {}
            });
        });
    });
    it('should fail to remove an id that hasn\'t been added', function () {
        return insightFacade.removeDataset("fake").then(function (response) {
            throw new Error("Should not have gotten response: " + response);
        }, function (err) {
            chai_1.expect(err).to.deep.eq({
                code: 404,
                body: {
                    error: "Resource not found"
                }
            });
        });
    });
});
describe("InsightFacade.performQuery", function () {
    var insightFacade = null;
    beforeEach(function () {
        insightFacade = new InsightFacade_1.default(false);
        insightFacade._addDataset('courses', [
            {
                courses_title: "hong kong cinema",
                courses_uuid: 39426,
                courses_instructor: "bailey, c. d. alison",
                courses_audit: 1,
                courses_id: "325",
                courses_pass: 71,
                courses_fail: 1,
                courses_avg: 71.18,
                courses_dept: "asia"
            },
            {
                courses_title: "hong kong cinema",
                courses_uuid: 39427,
                courses_instructor: "",
                courses_audit: 1,
                courses_id: "325",
                courses_pass: 71,
                courses_fail: 1,
                courses_avg: 71.18,
                courses_dept: "asia"
            },
            {
                courses_title: "hong kong cinema 2",
                courses_uuid: 39428,
                courses_instructor: "some guy 1",
                courses_audit: 1,
                courses_id: "315",
                courses_pass: 71,
                courses_fail: 1,
                courses_avg: 98.5,
                courses_dept: "asia"
            },
            {
                courses_title: "vancouver cinema",
                courses_uuid: 39429,
                courses_instructor: "some guy 2",
                courses_audit: 1,
                courses_id: "385",
                courses_pass: 71,
                courses_fail: 1,
                courses_avg: 90.5,
                courses_dept: "asia"
            }
        ]);
    });
    afterEach(function () {
        insightFacade = null;
    });
    it('should produce the courses with averages between 85 and 98', function () {
        return insightFacade.performQuery({
            WHERE: {
                AND: [
                    {
                        GT: {
                            courses_avg: 85
                        }
                    },
                    {
                        LT: {
                            courses_avg: 95
                        }
                    }
                ]
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_dept",
                    "courses_avg",
                    "courses_id",
                ],
                ORDER: "courses_id",
                FORM: "TABLE"
            }
        }).then(function (response) { return chai_1.expect(response).to.deep.eq({
            code: 200,
            body: {
                render: 'TABLE',
                result: [
                    { courses_dept: "asia", courses_id: "385", courses_avg: 90.5 }
                ]
            }
        }); });
    });
    it('should produce 400 for an invalid query', function () {
        return insightFacade.performQuery(null).then(function () {
            throw new Error("Test should have failed");
        }, function (err) { return chai_1.expect(err).to.deep.eq({
            code: 400,
            body: {
                error: 'Malformed query'
            }
        }); });
    });
    it('should produce 424 for missing datasets', function () {
        return insightFacade.performQuery({
            WHERE: {
                NOT: {
                    IS: {
                        fake_avgs: "325"
                    }
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "fake_avgs"
                ],
                ORDER: "fake_avgs",
                FORM: "TABLE"
            }
        }).then(function () {
            throw new Error("Test should have failed");
        }, function (err) { return chai_1.expect(err).to.deep.eq({
            code: 424,
            body: {
                missing: ['fake']
            }
        }); });
    });
    it('should not be able to perform query when dataset has not been added', function () {
        insightFacade = new InsightFacade_1.default(false);
        return insightFacade.performQuery({
            WHERE: {
                IS: {
                    courses_title: "hong kong cinema"
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_title"
                ],
                FORM: "TABLE"
            }
        }).then(function () {
            throw new Error("Test should have failed");
        }, function (err) { return chai_1.expect(err).to.deep.eq({
            code: 424,
            body: {
                missing: ['courses']
            }
        }); });
    });
    it('should not be able to perform query when dataset has been removed', function () {
        return insightFacade.removeDataset('courses').then(function (response) {
            chai_1.expect(response.code).eq(204);
            return insightFacade.performQuery({
                WHERE: {
                    IS: {
                        courses_title: "hong kong cinema"
                    }
                },
                OPTIONS: {
                    COLUMNS: [
                        "courses_title"
                    ],
                    FORM: "TABLE"
                }
            }).then(function () {
                throw new Error("Test should have failed");
            }, function (err) { return chai_1.expect(err).to.deep.eq({
                code: 424,
                body: {
                    missing: ['courses']
                }
            }); });
        });
    });
});
//# sourceMappingURL=InsightFacadeSpec.js.map