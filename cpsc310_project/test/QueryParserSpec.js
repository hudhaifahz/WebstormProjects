"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var QueryParser_1 = require("../src/controller/QueryParser");
var Query_1 = require("../src/controller/Query");
var QueryParser_2 = require("../src/controller/QueryParser");
describe('QueryParser.parseQuery', function () {
    it('should fail if a column is present that is not in GROUP or APPLY', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'rooms_shortname'
                ],
                FORM: 'TABLE'
            },
            TRANSFORMATIONS: {
                GROUP: [
                    'rooms_seats'
                ],
                APPLY: []
            }
        })).to.be.null;
    });
    it('should reject a column not defined in APPLY', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'variantone'
                ],
                FORM: 'TABLE'
            },
            TRANSFORMATIONS: {
                GROUP: [
                    'rooms_name'
                ],
                APPLY: [{
                        varianttwo: {
                            MAX: 'rooms_seats'
                        }
                    }]
            }
        })).to.be.null;
    });
    it('should fail if an APPLY key contains an underscore', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'rooms_modified'
                ],
                FORM: 'TABLE'
            },
            TRANSFORMATIONS: {
                GROUP: [
                    'rooms_name'
                ],
                APPLY: [{
                        rooms_modified: {
                            MAX: 'rooms_seats'
                        }
                    }]
            }
        })).to.be.null;
    });
    it('should fail if keys is the wrong type', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'rooms_seats'
                ],
                ORDER: {
                    dir: 'UP',
                    keys: null
                },
                FORM: 'TABLE'
            }
        })).to.be.null;
    });
    it('should fail if no order keys are provided', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'rooms_seats'
                ],
                ORDER: {
                    dir: 'UP',
                    keys: []
                },
                FORM: 'TABLE'
            }
        })).to.be.null;
    });
    it('should fail with a duplicate apply key', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'maxSeats'
                ],
                FORM: "TABLE"
            },
            TRANSFORMATIONS: {
                GROUP: [
                    'rooms_address'
                ],
                APPLY: [{
                        maxSeats: {
                            MAX: 'rooms_seats'
                        }
                    }, {
                        maxSeats: {
                            MAX: 'rooms_seats'
                        }
                    }]
            }
        })).to.be.null;
    });
    it('should determine the dataset when it is only mentioned in GROUP and APPLY', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'maxSeats'
                ],
                FORM: "TABLE"
            },
            TRANSFORMATIONS: {
                GROUP: [
                    'rooms_address'
                ],
                APPLY: [{
                        maxSeats: {
                            MAX: 'rooms_seats'
                        }
                    }]
            }
        })).to.deep.eq(new QueryParser_2.ParsingResult(new Query_1.default({}, {
            COLUMNS: [
                'maxSeats'
            ],
            FORM: 'TABLE'
        }, {
            GROUP: [
                'rooms_address'
            ],
            APPLY: [{
                    maxSeats: {
                        MAX: 'rooms_seats'
                    }
                }]
        }), 'rooms'));
    });
    it('should fail with an emply apply', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'rooms_address'
                ],
                FORM: "TABLE"
            },
            TRANSFORMATIONS: {
                GROUP: [
                    'rooms_address'
                ],
                APPLY: [{}]
            }
        })).to.be.null;
    });
    it('should fail if an apply entry has more than one item', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'maxSeats',
                    'minSeats'
                ],
                FORM: "TABLE"
            },
            TRANSFORMATIONS: {
                GROUP: [
                    'rooms_address'
                ],
                APPLY: [{
                        maxSeats: {
                            MAX: 'rooms_seats'
                        },
                        minSeats: {
                            MIN: 'rooms_seats'
                        }
                    }]
            }
        })).to.be.null;
    });
    it('should fail on an empty list of columns', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [],
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should allow a D3 style order', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_id",
                    "courses_avg"
                ],
                ORDER: {
                    keys: ["courses_avg"],
                    dir: "DOWN"
                },
                FORM: "TABLE"
            }
        })).to.deep.eq(new QueryParser_2.ParsingResult(new Query_1.default({}, {
            COLUMNS: [
                "courses_id",
                "courses_avg"
            ],
            ORDER: {
                keys: ["courses_avg"],
                dir: "DOWN"
            },
            FORM: "TABLE"
        }), "courses"));
    });
    it('should fail if GROUPS is empty', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_id"
                ],
                FORM: "TABLE"
            },
            TRANSFORMATIONS: {
                GROUP: [],
                APPLY: []
            }
        })).to.be.null;
    });
    it('should fail if GROUPS is present and columns are not all in GROUPS or APPLY', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_id"
                ],
                FORM: "TABLE"
            },
            TRANSFORMATIONS: {
                GROUP: [
                    'rooms_shortname'
                ],
                APPLY: []
            }
        })).to.be.null;
    });
    it('should permit a column that refers to the APPLY block', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'rooms_shortname',
                    'maxSeats'
                ],
                FORM: 'TABLE'
            },
            TRANSFORMATIONS: {
                GROUP: [
                    'rooms_shortname'
                ],
                APPLY: [{
                        maxSeats: {
                            MAX: 'rooms_seats'
                        }
                    }]
            }
        })).to.deep.eq(new QueryParser_2.ParsingResult(new Query_1.default({}, {
            COLUMNS: [
                'rooms_shortname',
                'maxSeats'
            ],
            FORM: 'TABLE'
        }, {
            GROUP: [
                'rooms_shortname'
            ],
            APPLY: [{
                    maxSeats: {
                        MAX: 'rooms_seats'
                    }
                }]
        }), 'rooms'));
    });
    it('should permit an empty WHERE clause', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'courses_dept'
                ],
                FORM: 'TABLE'
            }
        })).to.deep.eq(new QueryParser_2.ParsingResult(new Query_1.default({}, {
            COLUMNS: [
                'courses_dept'
            ],
            FORM: 'TABLE'
        }), 'courses'));
    });
    it('should produce a correct query when the query is valid', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                "IS": {
                    courses_id: "325"
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE",
            }
        })).to.deep.eq(new QueryParser_2.ParsingResult(new Query_1.default({
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
        }), 'courses'));
    });
    it('should produce a correct query for new ORDER UP', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                ORDER: {
                    dir: "UP",
                    keys: ["courses_id", "courses_avg"]
                },
                FORM: "TABLE",
            }
        })).to.deep.eq(new QueryParser_2.ParsingResult(new Query_1.default({}, {
            COLUMNS: [
                "courses_dept",
                "courses_id",
                "courses_avg"
            ],
            ORDER: {
                dir: 'UP',
                keys: ["courses_id", "courses_avg"]
            },
            FORM: "TABLE",
        }), 'courses'));
    });
    it('should produce a correct query for new ORDER DOWN', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                ORDER: {
                    dir: "DOWN",
                    keys: ["courses_id", "courses_avg"]
                },
                FORM: "TABLE",
            }
        })).to.deep.eq(new QueryParser_2.ParsingResult(new Query_1.default({}, {
            COLUMNS: [
                "courses_dept",
                "courses_id",
                "courses_avg"
            ],
            ORDER: {
                dir: 'DOWN',
                keys: ["courses_id", "courses_avg"]
            },
            FORM: "TABLE",
        }), 'courses'));
    });
    it('should fail when an order key is not in columns', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                ORDER: {
                    dir: "DOWN",
                    keys: ["courses_uuid", "courses_avg"]
                },
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail when ORDER is invalid', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'courses_dept'
                ],
                ORDER: null,
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when ORDER is not in COLUMNS', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'courses_dept'
                ],
                ORDER: 'courses_avg',
                FORM: 'TABLE'
            }
        })).to.be.null;
    });
    it('should accept an ORDER in an APPLY block', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    'courses_id',
                    'averagePass'
                ],
                ORDER: {
                    keys: ['averagePass'],
                    dir: 'UP'
                },
                FORM: 'TABLE'
            },
            TRANSFORMATIONS: {
                GROUP: ['courses_id'],
                APPLY: [{
                        averagePass: {
                            AVG: 'courses_avg'
                        }
                    }]
            }
        })).to.deep.eq(new QueryParser_2.ParsingResult(new Query_1.default({}, {
            COLUMNS: [
                'courses_id',
                'averagePass'
            ],
            ORDER: {
                keys: ['averagePass'],
                dir: 'UP'
            },
            FORM: 'TABLE'
        }, {
            GROUP: ['courses_id'],
            APPLY: [{
                    averagePass: {
                        AVG: 'courses_avg'
                    }
                }]
        }), 'courses'));
    });
    it('should accept queries with room keys', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            "WHERE": {
                "IS": {
                    "rooms_name": "DMP_*"
                }
            },
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_name"
                ],
                "ORDER": "rooms_name",
                "FORM": "TABLE"
            }
        })).to.deep.eq(new QueryParser_2.ParsingResult(new Query_1.default({
            "IS": {
                "rooms_name": "DMP_*"
            }
        }, {
            "COLUMNS": [
                "rooms_name"
            ],
            "ORDER": "rooms_name",
            "FORM": "TABLE"
        }), 'rooms'));
    });
    it('should fail when given a query without an OPTIONS', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {
                    courses_id: "315"
                }
            }
        })).to.be.null;
    });
    it('should fail when given a query without a WHERE', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            OPTIONS: {
                COLUMNS: [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should produce the same two missing datasets when they are missing in both WHERE and COLUMNS', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                OR: [
                    {
                        IS: {
                            fake_instructor: "*pamela*"
                        }
                    }
                ]
            },
            OPTIONS: {
                COLUMNS: [
                    "fake_instructor"
                ],
                ORDER: "fake_instructor",
                FORM: "TABLE"
            }
        })).to.deep.eq(new QueryParser_2.ParsingResult(new Query_1.default({
            OR: [
                {
                    IS: {
                        fake_instructor: "*pamela*"
                    }
                }
            ]
        }, {
            COLUMNS: [
                "fake_instructor"
            ],
            ORDER: "fake_instructor",
            FORM: "TABLE"
        }), 'fake'));
    });
    it('should fail when given an undefined query', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery(undefined)).to.be.null;
    });
    it('should fail when given a null query', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery(null)).to.be.null;
    });
    it('should show nested missing datasets', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
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
        })).to.deep.eq(new QueryParser_2.ParsingResult(new Query_1.default({
            NOT: {
                IS: {
                    fake_avgs: "325"
                }
            }
        }, {
            COLUMNS: [
                "fake_avgs"
            ],
            ORDER: "fake_avgs",
            FORM: "TABLE"
        }), 'fake'));
    });
    it('should fail with a key that is not the right type in the dataset', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {
                    courses_avg: "325"
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg",
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail with a key that is not a part of the dataset', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {
                    courses_ids: "325"
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail with an order not found in COLUMNS', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {
                    courses_id: "325"
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_id",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when given a bad key in order', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {
                    courses_id: "325"
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "bad",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when WHERE has more than one item', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {
                    "courses_id": "325"
                },
                GT: {
                    "courses_avg": 90.5
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg",
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when NOT has more than one item', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                NOT: {
                    IS: {
                        "courses_id": "325"
                    },
                    GT: {
                        "courses_avg": 90.5
                    }
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg",
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when NOT is not an array', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                NOT: null
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg",
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when IS is has more than one entry', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {
                    "courses_id": "325",
                    "courses_title": "test"
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg",
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when AND is empty', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                AND: []
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg",
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when IS is empty', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {}
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg",
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when COLUMNS is empty', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {
                    "courses_id": "325"
                }
            },
            OPTIONS: {
                COLUMNS: [],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when COLUMNS is not an array', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {
                    "courses_id": "325"
                }
            },
            OPTIONS: {
                COLUMNS: null,
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when the value of a key in an IS is a number', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {
                    "courses_avg": 90.5
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when the value of an IS is null', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: null
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when the value of an IS is undefined', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: undefined
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when one of the inner items of AND is invalid', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                AND: [
                    {
                        EQ: {
                            "courses_avg": 90,
                        },
                    },
                    null
                ]
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when given an invalid AND query', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                "AND": "bad"
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when given an undefined query', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: null,
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail when given an undefined query', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: undefined,
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail on a malformed EQ', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                GT: {
                    "courses_avg": { "bad": "object" }
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail on a malformed GT', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                GT: {
                    "courses_avg": "value"
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail on a malformed LT', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                LT: {
                    "courses_avg": "value"
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail on a malformed IS', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                IS: {
                    IS: {
                        "bad": "value"
                    }
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail if FORM is not TABLE', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "OEU",
            }
        })).to.be.null;
    });
    it('should fail on malformed columns', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "fake_sham",
                    "bad",
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail if columns include non-courses ids', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                "IS": {
                    "courses_dept": "asia"
                }
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_dept",
                    "instructors_name",
                    "fake_sham",
                    "courses_avg"
                ],
                ORDER: "courses_dept",
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail if ORDER is not in COLUMNS', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_dept",
                    "courses_avg"
                ],
                ORDER: "courses_id",
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail when a query contains more than one dataset', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {
                OR: [{
                        AND: [
                            {
                                GT: {
                                    courses_avg: 90
                                }
                            },
                            {
                                IS: {
                                    rooms_shortname: "DMP"
                                }
                            }
                        ]
                    }, {
                        EQ: {
                            courses_avg: 95
                        }
                    }]
            },
            OPTIONS: {
                COLUMNS: [
                    "courses_dept",
                    "courses_id",
                    "courses_avg"
                ],
                ORDER: "courses_avg",
                FORM: "TABLE"
            }
        })).to.be.null;
    });
    it('should fail if new ORDER is null', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_id"
                ],
                ORDER: null,
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail if new ORDER doesnt have keys', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_id"
                ],
                ORDER: {},
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail if new ORDER has invalid keys', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_id"
                ],
                ORDER: {
                    DIR: "UP",
                    KEYS: []
                },
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail if new ORDER has invalid dir', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_id"
                ],
                ORDER: {
                    dir: "abc",
                    keys: []
                },
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail if new ORDER has missing keys', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: {
                COLUMNS: [
                    "courses_id"
                ],
                ORDER: {
                    dir: "UP",
                    keys: ["courses_abc"]
                },
                FORM: "TABLE",
            }
        })).to.be.null;
    });
    it('should fail if options null', function () {
        return chai_1.expect(QueryParser_1.default.parseQuery({
            WHERE: {},
            OPTIONS: null
        })).to.be.null;
    });
});
//# sourceMappingURL=QueryParserSpec.js.map