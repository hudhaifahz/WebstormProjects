"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var DataController_1 = require("../src/controller/DataController");
var QueryController_1 = require("../src/controller/QueryController");
var Query_1 = require("../src/controller/Query");
describe("QueryController.executeQuery", function () {
    var dataController = null;
    var queryController = null;
    before(function () {
        dataController = new DataController_1.default();
        queryController = new QueryController_1.default(dataController);
        dataController.addDataset('courses', [
            {
                courses_title: "hong kong cinema",
                courses_uuid: '39426',
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
                courses_uuid: '39427',
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
                courses_uuid: '39428',
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
                courses_uuid: '39429',
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
    after(function () {
        dataController = null;
        queryController = null;
    });
    it('should correctly order things ascending with a tie breaker', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({}, {
            COLUMNS: [
                'courses_avg',
                'courses_uuid'
            ],
            ORDER: {
                dir: 'UP',
                keys: ['courses_avg', 'courses_uuid']
            },
            FORM: 'TABLE'
        }), 'courses')).to.deep.eq([
            { courses_uuid: '39426', courses_avg: 71.18 },
            { courses_uuid: '39427', courses_avg: 71.18 },
            { courses_uuid: '39429', courses_avg: 90.5 },
            { courses_uuid: '39428', courses_avg: 98.5 }
        ]);
    });
    it('should produce the whole dataset when given an empty WHERE clause', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({}, {
            COLUMNS: [
                "courses_id"
            ],
            ORDER: "courses_id",
            FORM: "TABLE"
        }), 'courses')).to.deep.eq([
            { courses_id: "315" },
            { courses_id: "325" },
            { courses_id: "325" },
            { courses_id: "385" }
        ]);
    });
    it('should correctly group together a simple query', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({}, {
            COLUMNS: [
                "courses_id"
            ],
            ORDER: "courses_id",
            FORM: "TABLE"
        }, {
            GROUP: [
                "courses_id"
            ],
            APPLY: []
        }), 'courses')).to.deep.eq([
            { courses_id: "315" },
            { courses_id: "325" },
            { courses_id: "385" }
        ]);
    });
    it('should correctly apply a simple query', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({}, {
            COLUMNS: [
                "courses_id",
                "totalPass"
            ],
            ORDER: "courses_id",
            FORM: "TABLE"
        }, {
            GROUP: [
                "courses_id"
            ],
            APPLY: [{
                    totalPass: {
                        SUM: "courses_pass"
                    }
                }]
        }), 'courses')).to.deep.eq([
            { courses_id: "315", totalPass: 71 },
            { courses_id: "325", totalPass: 142 },
            { courses_id: "385", totalPass: 71 }
        ]);
    });
    it('should produce the courses with averages between 85 and 98', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({
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
        }, {
            COLUMNS: [
                "courses_dept",
                "courses_avg",
                "courses_id",
            ],
            ORDER: "courses_id",
            FORM: "TABLE"
        }), 'courses')).to.deep.eq([
            { courses_dept: "asia", courses_id: "385", courses_avg: 90.5 }
        ]);
    });
    it('should return the matching entries with a simple query', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({
            "IS": {
                courses_id: "325"
            }
        }, {
            COLUMNS: [
                "courses_dept",
                "courses_id",
                "courses_avg"
            ],
            ORDER: "courses_avg",
            FORM: "TABLE",
        }), 'courses')).to.deep.eq([
            { courses_dept: "asia", courses_id: "325", courses_avg: 71.18 },
            { courses_dept: "asia", courses_id: "325", courses_avg: 71.18 }
        ]);
    });
    it('should correctly filter when given a metric', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({
            "GT": {
                "courses_avg": 97
            }
        }, {
            COLUMNS: [
                "courses_dept",
                "courses_avg"
            ],
            ORDER: "courses_avg",
            FORM: "TABLE",
        }), 'courses')).to.deep.eq([
            { courses_dept: "asia", courses_avg: 98.5 }
        ]);
    });
    it('should correctly filter when given a metric to be less than', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({
            "LT": {
                "courses_avg": 80
            }
        }, {
            COLUMNS: [
                "courses_dept",
                "courses_avg"
            ],
            ORDER: "courses_avg",
            FORM: "TABLE",
        }), 'courses')).to.deep.eq([
            { courses_dept: "asia", courses_avg: 71.18 },
            { courses_dept: "asia", courses_avg: 71.18 }
        ]);
    });
    it('should correctly filter when using NOT', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({
            "NOT": {
                "IS": {
                    "courses_id": "325"
                }
            }
        }, {
            COLUMNS: [
                "courses_dept",
                "courses_avg"
            ],
            ORDER: "courses_avg",
            FORM: "TABLE",
        }), 'courses')).to.deep.eq([
            { courses_dept: "asia", courses_avg: 90.5 },
            { courses_dept: "asia", courses_avg: 98.5 }
        ]);
    });
    it('should correctly filter when using a double NOT', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({
            "NOT": {
                "NOT": {
                    "IS": {
                        "courses_id": "325"
                    }
                }
            }
        }, {
            COLUMNS: [
                "courses_dept",
                "courses_avg"
            ],
            ORDER: "courses_avg",
            FORM: "TABLE",
        }), 'courses')).to.deep.eq([
            { courses_dept: "asia", courses_avg: 71.18 },
            { courses_dept: "asia", courses_avg: 71.18 }
        ]);
    });
    it('should correctly apply an OR query', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({
            "OR": [
                {
                    "GT": {
                        "courses_avg": 97
                    }
                },
                {
                    "IS": {
                        "courses_id": "325"
                    }
                }
            ]
        }, {
            COLUMNS: [
                "courses_dept",
                "courses_avg",
                "courses_id",
            ],
            ORDER: "courses_id",
            FORM: "TABLE",
        }), 'courses')).to.deep.eq([
            { courses_dept: "asia", courses_avg: 98.5, courses_id: "315" },
            { courses_dept: "asia", courses_avg: 71.18, courses_id: "325" },
            { courses_dept: "asia", courses_avg: 71.18, courses_id: "325" }
        ]);
    });
    it('should correctly process stars in IS statements', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({
            "IS": {
                "courses_title": "*cinema"
            }
        }, {
            COLUMNS: [
                "courses_dept",
                "courses_avg"
            ],
            ORDER: "courses_avg",
            FORM: "TABLE",
        }), 'courses')).to.deep.eq([
            { courses_dept: "asia", courses_avg: 71.18 },
            { courses_dept: "asia", courses_avg: 71.18 },
            { courses_dept: "asia", courses_avg: 90.5 },
        ]);
    });
    it('should correctly process surrounding stars in IS statements', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({
            "IS": {
                "courses_title": "*kong*"
            }
        }, {
            COLUMNS: [
                "courses_dept",
                "courses_avg"
            ],
            ORDER: "courses_avg",
            FORM: "TABLE",
        }), 'courses')).to.deep.eq([
            { courses_dept: "asia", courses_avg: 71.18 },
            { courses_dept: "asia", courses_avg: 71.18 },
            { courses_dept: "asia", courses_avg: 98.5 },
        ]);
    });
    it('should correctly process final stars in IS statements', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({
            "IS": {
                "courses_title": "hong kong*"
            }
        }, {
            COLUMNS: [
                "courses_dept",
                "courses_avg"
            ],
            ORDER: "courses_avg",
            FORM: "TABLE",
        }), 'courses')).to.deep.eq([
            { courses_dept: "asia", courses_avg: 71.18 },
            { courses_dept: "asia", courses_avg: 71.18 },
            { courses_dept: "asia", courses_avg: 98.5 },
        ]);
    });
    it('should work with EQ and a double value', function () {
        return chai_1.expect(queryController.executeQuery(new Query_1.default({
            EQ: {
                "courses_avg": 71.18
            }
        }, {
            COLUMNS: [
                "courses_dept",
                "courses_avg"
            ],
            ORDER: "courses_avg",
            FORM: "TABLE",
        }), 'courses')).to.deep.eq([
            { courses_dept: "asia", courses_avg: 71.18 },
            { courses_dept: "asia", courses_avg: 71.18 },
        ]);
    });
});
//# sourceMappingURL=QueryControllerSpec.js.map