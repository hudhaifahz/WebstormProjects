"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Util_1 = require("../src/Util");
var Unpack_1 = require("../src/controller/Unpack");
var InsightFacade_1 = require("../src/controller/InsightFacade");
var BuildingInfo_1 = require("../src/controller/BuildingInfo");
var fs = require('fs');
describe("TestChain", function () {
    var insF;
    var unP;
    var test1Wildc = { "WHERE": { "OR": [{ "AND": [{ "GT": { "courses_avg": 90 } }, { "IS": { "courses_instructor": "*john*" } }] }, { "EQ": { "courses_avg": 100 } }] }, "OPTIONS": { "COLUMNS": ["courses_dept", "courses_id", "courses_avg", "courses_instructor"], "ORDER": "courses_avg" } };
    var test1Resultc = '{"result":[{"courses_dept":"sowk","courses_id":"510","courses_avg":90.2,"courses_instructor":"johnson, shelly"},{"courses_dept":"sowk","courses_id":"400","courses_avg":90.4,"courses_instructor":"johnston, patricia"},{"courses_dept":"thtr","courses_id":"500","courses_avg":90.43,"courses_instructor":"johnston, kirsty"},{"courses_dept":"edcp","courses_id":"491","courses_avg":90.52,"courses_instructor":"johnson, jennifer"},{"courses_dept":"educ","courses_id":"500","courses_avg":90.53,"courses_instructor":"carter, john"},{"courses_dept":"sowk","courses_id":"425","courses_avg":90.62,"courses_instructor":"johnson, shelly"},{"courses_dept":"sowk","courses_id":"400","courses_avg":90.66,"courses_instructor":"johnston, patricia"},{"courses_dept":"thtr","courses_id":"500","courses_avg":90.75,"courses_instructor":"johnston, kirsty"},{"courses_dept":"phys","courses_id":"508","courses_avg":92.2,"courses_instructor":"ng, john"},{"courses_dept":"musc","courses_id":"305","courses_avg":92.63,"courses_instructor":"van deursen, john"},{"courses_dept":"cnps","courses_id":"584","courses_avg":92.72,"courses_instructor":"carter, john"},{"courses_dept":"musc","courses_id":"506","courses_avg":93.33,"courses_instructor":"van deursen, john"},{"courses_dept":"cnps","courses_id":"584","courses_avg":94,"courses_instructor":"carter, john"},{"courses_dept":"cnps","courses_id":"584","courses_avg":94,"courses_instructor":"carter, john"},{"courses_dept":"cnps","courses_id":"584","courses_avg":94.26,"courses_instructor":"carter, john"},{"courses_dept":"psyc","courses_id":"537","courses_avg":94.75,"courses_instructor":"wagner, john"},{"courses_dept":"psyc","courses_id":"541","courses_avg":95.25,"courses_instructor":"wagner, john"},{"courses_dept":"cnps","courses_id":"584","courses_avg":96,"courses_instructor":"carter, john"}]}';
    var test3424c = { "WHERE": { "OR": [{ "AND": [{ "GT": { "coursesZr_avg": 90 } }, { "IS": { "courses_instructor": "*john*" } }] }, { "EQ": { "coursetetes_avg": 100 } }] }, "OPTIONS": { "COLUMNS": ["courses_dept", "courses_id", "courses_avg", "courses_instructor"], "ORDER": "courses_avg" } };
    var test4400c = { "WHERE": { "OR": [{ "AND": [{ "GT": { "courses_avg": "90" } }, { "IS": { "courses_instructor": "*john*" } }] }, { "EQ": { "courses_avg": 100 } }] }, "OPTIONS": { "COLUMNS": ["courses_dept", "courses_id", "courses_avg", "courses_instructor"], "ORDER": "courses_avg" } };
    var test3Responsec = '{"result":[{"courses_dept":"sowk","courses_id":"510","courses_avg":90.2,"courses_instructor":"johnson, shelly"},{"courses_dept":"sowk","courses_id":"400","courses_avg":90.4,"courses_instructor":"johnston, patricia"},{"courses_dept":"thtr","courses_id":"500","courses_avg":90.43,"courses_instructor":"johnston, kirsty"},{"courses_dept":"edcp","courses_id":"491","courses_avg":90.52,"courses_instructor":"johnson, jennifer"},{"courses_dept":"educ","courses_id":"500","courses_avg":90.53,"courses_instructor":"carter, john"},{"courses_dept":"sowk","courses_id":"425","courses_avg":90.62,"courses_instructor":"johnson, shelly"},{"courses_dept":"sowk","courses_id":"400","courses_avg":90.66,"courses_instructor":"johnston, patricia"},{"courses_dept":"thtr","courses_id":"500","courses_avg":90.75,"courses_instructor":"johnston, kirsty"},{"courses_dept":"phys","courses_id":"508","courses_avg":92.2,"courses_instructor":"ng, john"},{"courses_dept":"musc","courses_id":"305","courses_avg":92.63,"courses_instructor":"van deursen, john"},{"courses_dept":"cnps","courses_id":"584","courses_avg":92.72,"courses_instructor":"carter, john"},{"courses_dept":"musc","courses_id":"506","courses_avg":93.33,"courses_instructor":"van deursen, john"},{"courses_dept":"cnps","courses_id":"584","courses_avg":94,"courses_instructor":"carter, john"},{"courses_dept":"cnps","courses_id":"584","courses_avg":94,"courses_instructor":"carter, john"},{"courses_dept":"cnps","courses_id":"584","courses_avg":94.26,"courses_instructor":"carter, john"},{"courses_dept":"psyc","courses_id":"537","courses_avg":94.75,"courses_instructor":"wagner, john"},{"courses_dept":"psyc","courses_id":"541","courses_avg":95.25,"courses_instructor":"wagner, john"},{"courses_dept":"cnps","courses_id":"584","courses_avg":96,"courses_instructor":"carter, john"}]}';
    var test5Notc = { "WHERE": { "OR": [{ "AND": [{ "GT": { "courses_avg": 90 } }, { "IS": { "courses_instructor": "john*" } }, { "NOT": { "IS": { "courses_dept": "sowk*" } } }] }, { "EQ": { "courses_avg": 100 } }] }, "OPTIONS": { "COLUMNS": ["courses_dept", "courses_id", "courses_avg", "courses_instructor"], "ORDER": "courses_avg" } };
    var test5Responsec = '{"result":[{"courses_dept":"thtr","courses_id":"500","courses_avg":90.43,"courses_instructor":"johnston, kirsty"},{"courses_dept":"edcp","courses_id":"491","courses_avg":90.52,"courses_instructor":"johnson, jennifer"},{"courses_dept":"thtr","courses_id":"500","courses_avg":90.75,"courses_instructor":"johnston, kirsty"}]}';
    var test1HardCodedJsonRequestc = { "WHERE": { "EQ": { "courses_avg": 97 } }, "OPTIONS": { "COLUMNS": ["courses_dept", "courses_avg"], "ORDER": "courses_avg" } };
    var test1HardCodedJsonResponsec = '{"result":[{"courses_dept":"crwr","courses_avg":97},{"courses_dept":"epse","courses_avg":97},{"courses_dept":"psyc","courses_avg":97}]}';
    var test7R = { "WHERE": { "IS": { "rooms_name": "FNH_*" } }, "OPTIONS": { "COLUMNS": ["rooms_name"], "ORDER": "rooms_name" } };
    var test7ResponseR = '{"result":[{"rooms_name":"FNH_20"},{"rooms_name":"FNH_30"},{"rooms_name":"FNH_320"},{"rooms_name":"FNH_40"},{"rooms_name":"FNH_50"},{"rooms_name":"FNH_60"}]}';
    var test13R = { "WHERE": { "OR": [{ "AND": [{ "GT": { "rooms_seats": 1 } }, { "IS": { "rooms_shortname": "FNH" } }, { "IS": { "rooms_furniture": "Classroom-Movable Tables & Chairs" } }] }, { "EQ": { "rooms_seats": 1000 } }] }, "OPTIONS": { "COLUMNS": ["rooms_fullname", "rooms_shortname", "rooms_number", "rooms_name", "rooms_address", "rooms_lat", "rooms_lon", "rooms_seats", "rooms_type", "rooms_furniture", "rooms_href"], "ORDER": "rooms_shortname" } };
    var test13ResponseR = '{"result":[{"rooms_fullname":"Food, Nutrition and Health","rooms_shortname":"FNH","rooms_number":"30","rooms_name":"FNH_30","rooms_address":"2205 East Mall","rooms_lat":49.26414,"rooms_lon":-123.24959,"rooms_seats":28,"rooms_type":"Small Group","rooms_furniture":"Classroom-Movable Tables & Chairs","rooms_href":"http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/FNH-30"}]}';
    var test15ResponseR = '{"result":[{"rooms_shortname":"LSC","rooms_address":"2350 Health Sciences Mall","rooms_seats":350,"totalSeats":700,"avgSeats":350},{"rooms_shortname":"OSBO","rooms_address":"6108 Thunderbird Boulevard","rooms_seats":442,"totalSeats":442,"avgSeats":442},{"rooms_shortname":"HEBB","rooms_address":"2045 East Mall","rooms_seats":375,"totalSeats":375,"avgSeats":375}]}';
    var test16R = { "WHERE": {}, "OPTIONS": { "COLUMNS": ["rooms_furniture"], "ORDER": "rooms_furniture" } };
    var test16ResponseR = '{"result":[{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Fixed Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Movable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs"},{"rooms_furniture":"Classroom-Fixed Tables/Moveable Chairs"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Fixed Tablets"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Hybrid Furniture"},{"rooms_furniture":"Classroom-Learn Lab"},{"rooms_furniture":"Classroom-Learn Lab"},{"rooms_furniture":"Classroom-Learn Lab"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tables & Chairs"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Movable Tablets"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tables & Chairs"},{"rooms_furniture":"Classroom-Moveable Tablets"}]}';
    var test17R = { "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "maxSeats"], "ORDER": { "dir": "DOWN", "keys": ["maxSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname"], "APPLY": [{ "maxSeats": { "MAX": "rooms_seats" } }] } };
    var test17ResponseR = '{"result":[{"rooms_shortname":"OSBO","maxSeats":442},{"rooms_shortname":"HEBB","maxSeats":375},{"rooms_shortname":"LSC","maxSeats":350}]}';
    var test18C = { "WHERE": { "IS": { "courses_title": "teach adult" } }, "OPTIONS": { "COLUMNS": ["courses_dept", "courses_year"], "ORDER": "courses_year" } };
    var test18ResponseC = '{"result":[{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":1900},{"courses_dept":"adhe","courses_year":2007},{"courses_dept":"adhe","courses_year":2007},{"courses_dept":"adhe","courses_year":2007},{"courses_dept":"adhe","courses_year":2007},{"courses_dept":"adhe","courses_year":2008},{"courses_dept":"adhe","courses_year":2008},{"courses_dept":"adhe","courses_year":2009},{"courses_dept":"adhe","courses_year":2009},{"courses_dept":"adhe","courses_year":2009},{"courses_dept":"adhe","courses_year":2010},{"courses_dept":"adhe","courses_year":2010},{"courses_dept":"adhe","courses_year":2010},{"courses_dept":"adhe","courses_year":2011},{"courses_dept":"adhe","courses_year":2011},{"courses_dept":"adhe","courses_year":2011},{"courses_dept":"adhe","courses_year":2011},{"courses_dept":"adhe","courses_year":2012},{"courses_dept":"adhe","courses_year":2012},{"courses_dept":"adhe","courses_year":2012},{"courses_dept":"adhe","courses_year":2012},{"courses_dept":"adhe","courses_year":2012},{"courses_dept":"adhe","courses_year":2012},{"courses_dept":"adhe","courses_year":2013},{"courses_dept":"adhe","courses_year":2013},{"courses_dept":"adhe","courses_year":2013},{"courses_dept":"adhe","courses_year":2013},{"courses_dept":"adhe","courses_year":2013},{"courses_dept":"adhe","courses_year":2013},{"courses_dept":"adhe","courses_year":2014},{"courses_dept":"adhe","courses_year":2014},{"courses_dept":"adhe","courses_year":2014},{"courses_dept":"adhe","courses_year":2014},{"courses_dept":"adhe","courses_year":2014},{"courses_dept":"adhe","courses_year":2014},{"courses_dept":"adhe","courses_year":2014},{"courses_dept":"adhe","courses_year":2015},{"courses_dept":"adhe","courses_year":2015},{"courses_dept":"adhe","courses_year":2015},{"courses_dept":"adhe","courses_year":2015},{"courses_dept":"adhe","courses_year":2015},{"courses_dept":"adhe","courses_year":2015},{"courses_dept":"adhe","courses_year":2016},{"courses_dept":"adhe","courses_year":2016}]}';
    var test15R = { "WHERE": { "AND": [{ "IS": { "rooms_furniture": "*Tables*" } }, { "GT": { "rooms_seats": 300 } }] }, "OPTIONS": { "COLUMNS": ["rooms_shortname", "rooms_address", "rooms_seats", "totalSeats", "avgSeats"], "ORDER": { "dir": "DOWN", "keys": ["totalSeats"] } }, "TRANSFORMATIONS": { "GROUP": ["rooms_shortname", "rooms_address", "rooms_seats"], "APPLY": [{ "totalSeats": { "SUM": "rooms_seats" } }, { "avgSeats": { "AVG": "rooms_seats" } }] } };
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
    it("check query1 correct COMMENTED", function () {
        var query = fs.readFileSync('query1.json', 'utf8');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (value) {
            Util_1.default.test('Value: ' + value.body);
            chai_1.expect(value.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("check query2 correct COMMENTED", function () {
        var query = fs.readFileSync('query2.json', 'utf8');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (value) {
            chai_1.expect(value.code).to.equal(200);
            ;
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        }).then(function () {
        });
    });
    it("check query, bad query, reject 400", function () {
        return insF.performQuery("cpsc").then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(400);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect(JSON.stringify(err)).to.equal('{"code":400,"body":{"error":"Query invalid!"}}');
        });
    });
    it("check query3, rooms", function () {
        this.timeout(10000);
        var query = fs.readFileSync('query3.json');
        query = JSON.parse(query);
        return insF.performQuery(query).then(function (value) {
            Util_1.default.test('Value: ' + (JSON.stringify(value)));
            Util_1.default.test('Stringified Value: ' + (JSON.stringify(value.body)));
            Util_1.default.test('Length: ' + Object.keys(JSON.stringify(value)).length);
            Util_1.default.test('Length: ' + Object.keys(JSON.stringify({ "result": [{ "rooms_name": "AERL_120" }, { "rooms_name": "ALRD_105" }, { "rooms_name": "ALRD_121" }, { "rooms_name": "ALRD_B101" }, { "rooms_name": "ANGU_037" }, { "rooms_name": "ANGU_039" }, { "rooms_name": "ANGU_098" }, { "rooms_name": "ANGU_234" }, { "rooms_name": "ANGU_235" }, { "rooms_name": "ANGU_237" }, { "rooms_name": "ANGU_241" }, { "rooms_name": "ANGU_243" }, { "rooms_name": "ANGU_291" }, { "rooms_name": "ANGU_295" }, { "rooms_name": "ANGU_334" }, { "rooms_name": "ANGU_335" }, { "rooms_name": "ANGU_343" }, { "rooms_name": "ANGU_345" }, { "rooms_name": "ANGU_347" }, { "rooms_name": "ANGU_350" }, { "rooms_name": "ANGU_354" }, { "rooms_name": "ANGU_434" }, { "rooms_name": "ANSO_203" }, { "rooms_name": "ANSO_205" }, { "rooms_name": "ANSO_207" }, { "rooms_name": "BIOL_2000" }, { "rooms_name": "BIOL_2200" }, { "rooms_name": "BRKX_2365" }, { "rooms_name": "BUCH_A101" }, { "rooms_name": "BUCH_A102" }, { "rooms_name": "BUCH_A103" }, { "rooms_name": "BUCH_A104" }, { "rooms_name": "BUCH_A201" }, { "rooms_name": "BUCH_A202" }, { "rooms_name": "BUCH_A203" }, { "rooms_name": "BUCH_B208" }, { "rooms_name": "BUCH_B209" }, { "rooms_name": "BUCH_B210" }, { "rooms_name": "BUCH_B211" }, { "rooms_name": "BUCH_B213" }, { "rooms_name": "BUCH_B215" }, { "rooms_name": "BUCH_B218" }, { "rooms_name": "BUCH_B219" }, { "rooms_name": "BUCH_B302" }, { "rooms_name": "BUCH_B303" }, { "rooms_name": "BUCH_B304" }, { "rooms_name": "BUCH_B306" }, { "rooms_name": "BUCH_B307" }, { "rooms_name": "BUCH_B308" }, { "rooms_name": "BUCH_B309" }, { "rooms_name": "BUCH_B310" }, { "rooms_name": "BUCH_B313" }, { "rooms_name": "BUCH_B315" }, { "rooms_name": "BUCH_B319" }, { "rooms_name": "BUCH_D213" }, { "rooms_name": "BUCH_D216" }, { "rooms_name": "BUCH_D217" }, { "rooms_name": "BUCH_D218" }, { "rooms_name": "BUCH_D219" }, { "rooms_name": "BUCH_D222" }, { "rooms_name": "BUCH_D228" }, { "rooms_name": "BUCH_D301" }, { "rooms_name": "BUCH_D304" }, { "rooms_name": "BUCH_D306" }, { "rooms_name": "BUCH_D307" }, { "rooms_name": "BUCH_D312" }, { "rooms_name": "BUCH_D313" }, { "rooms_name": "BUCH_D314" }, { "rooms_name": "BUCH_D316" }, { "rooms_name": "BUCH_D317" }, { "rooms_name": "BUCH_D322" }, { "rooms_name": "CEME_1202" }, { "rooms_name": "CEME_1204" }, { "rooms_name": "CEME_1212" }, { "rooms_name": "CEME_1215" }, { "rooms_name": "CHBE_101" }, { "rooms_name": "CHBE_102" }, { "rooms_name": "CHEM_B150" }, { "rooms_name": "CHEM_B250" }, { "rooms_name": "CHEM_C124" }, { "rooms_name": "CHEM_C126" }, { "rooms_name": "CHEM_D200" }, { "rooms_name": "CHEM_D300" }, { "rooms_name": "CIRS_1250" }, { "rooms_name": "DMP_110" }, { "rooms_name": "DMP_301" }, { "rooms_name": "DMP_310" }, { "rooms_name": "ESB_1012" }, { "rooms_name": "ESB_1013" }, { "rooms_name": "ESB_2012" }, { "rooms_name": "FNH_20" }, { "rooms_name": "FNH_320" }, { "rooms_name": "FNH_40" }, { "rooms_name": "FNH_50" }, { "rooms_name": "FNH_60" }, { "rooms_name": "FORW_303" }, { "rooms_name": "FRDM_153" }, { "rooms_name": "FSC_1001" }, { "rooms_name": "FSC_1003" }, { "rooms_name": "FSC_1005" }, { "rooms_name": "FSC_1221" }, { "rooms_name": "GEOG_100" }, { "rooms_name": "GEOG_212" }, { "rooms_name": "GEOG_214" }, { "rooms_name": "GEOG_242" }, { "rooms_name": "HEBB_10" }, { "rooms_name": "HEBB_100" }, { "rooms_name": "HEBB_12" }, { "rooms_name": "HEBB_13" }, { "rooms_name": "HENN_200" }, { "rooms_name": "HENN_201" }, { "rooms_name": "HENN_202" }, { "rooms_name": "IBLC_155" }, { "rooms_name": "IBLC_182" }, { "rooms_name": "IBLC_192" }, { "rooms_name": "IBLC_193" }, { "rooms_name": "IBLC_194" }, { "rooms_name": "IBLC_263" }, { "rooms_name": "IBLC_266" }, { "rooms_name": "IBLC_461" }, { "rooms_name": "IONA_301" }, { "rooms_name": "LASR_102" }, { "rooms_name": "LASR_104" }, { "rooms_name": "LASR_105" }, { "rooms_name": "LASR_107" }, { "rooms_name": "LSC_1001" }, { "rooms_name": "LSC_1002" }, { "rooms_name": "LSC_1003" }, { "rooms_name": "LSK_200" }, { "rooms_name": "LSK_201" }, { "rooms_name": "MATH_100" }, { "rooms_name": "MATH_105" }, { "rooms_name": "MATH_202" }, { "rooms_name": "MATH_204" }, { "rooms_name": "MATH_225" }, { "rooms_name": "MATX_1100" }, { "rooms_name": "MCLD_202" }, { "rooms_name": "MCLD_228" }, { "rooms_name": "MCML_158" }, { "rooms_name": "MCML_160" }, { "rooms_name": "MCML_166" }, { "rooms_name": "MCML_360A" }, { "rooms_name": "MCML_360B" }, { "rooms_name": "MCML_360C" }, { "rooms_name": "MCML_360D" }, { "rooms_name": "MCML_360E" }, { "rooms_name": "MCML_360F" }, { "rooms_name": "MCML_360G" }, { "rooms_name": "MCML_360H" }, { "rooms_name": "MCML_360J" }, { "rooms_name": "MCML_360K" }, { "rooms_name": "MCML_360L" }, { "rooms_name": "MGYM_206" }, { "rooms_name": "MGYM_208" }, { "rooms_name": "ORCH_1001" }, { "rooms_name": "ORCH_3004" }, { "rooms_name": "ORCH_3016" }, { "rooms_name": "ORCH_3018" }, { "rooms_name": "ORCH_3052" }, { "rooms_name": "ORCH_3062" }, { "rooms_name": "ORCH_3068" }, { "rooms_name": "ORCH_3072" }, { "rooms_name": "ORCH_4002" }, { "rooms_name": "ORCH_4004" }, { "rooms_name": "ORCH_4016" }, { "rooms_name": "ORCH_4018" }, { "rooms_name": "ORCH_4052" }, { "rooms_name": "ORCH_4062" }, { "rooms_name": "ORCH_4072" }, { "rooms_name": "ORCH_4074" }, { "rooms_name": "OSBO_203B" }, { "rooms_name": "PCOH_1003" }, { "rooms_name": "PCOH_1008" }, { "rooms_name": "PHRM_1101" }, { "rooms_name": "PHRM_1201" }, { "rooms_name": "SCRF_100" }, { "rooms_name": "SCRF_201" }, { "rooms_name": "SCRF_203" }, { "rooms_name": "SOWK_124" }, { "rooms_name": "SOWK_222" }, { "rooms_name": "SOWK_223" }, { "rooms_name": "SOWK_224" }, { "rooms_name": "SPPH_143" }, { "rooms_name": "SPPH_B108" }, { "rooms_name": "SPPH_B151" }, { "rooms_name": "SWNG_121" }, { "rooms_name": "SWNG_122" }, { "rooms_name": "SWNG_221" }, { "rooms_name": "SWNG_222" }, { "rooms_name": "SWNG_406" }, { "rooms_name": "SWNG_408" }, { "rooms_name": "UCLL_103" }, { "rooms_name": "UCLL_109" }, { "rooms_name": "WESB_100" }, { "rooms_name": "WESB_201" }, { "rooms_name": "WOOD_1" }, { "rooms_name": "WOOD_2" }, { "rooms_name": "WOOD_3" }, { "rooms_name": "WOOD_4" }, { "rooms_name": "WOOD_5" }, { "rooms_name": "WOOD_6" }, { "rooms_name": "WOOD_B79" }] })).length);
            chai_1.expect(value.code).to.equal(200);
            chai_1.expect(Object.keys(JSON.stringify(value.body)).length).to.deep.equal(5328);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
    it("lat lon test", function () {
        var BIP = new BuildingInfo_1.BuildingInfoParser();
        return BIP.getLatLon('6245 Agronomy Road V6T 1Z4', '157')
            .then(function (result) {
            console.log(result);
        })
            .catch(function (err) {
            console.log(err);
        });
    });
    it("Attempt Query 1: DataSet Exists on Disk, Response is in JSON. Expected Result: Success, Response Code: 200", function () {
        return insF.performQuery(test1HardCodedJsonRequestc).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(resultFinal)).to.deep.equal(test1HardCodedJsonResponsec);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt Query 2: DataSet Exists on Disk but contradictory EBNF Fields used in Query, Expected Result: Success, Response Code: 200", function () {
        return insF.performQuery(test1Wildc).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(resultFinal)).to.deep.equal(test1Resultc);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt Query 3", function () {
        return insF.performQuery(test3424c).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect(JSON.stringify(err)).to.equal('{"code":400,"body":{"error":"Query invalid!"}}');
        });
    });
    it("Attempt Query 4", function () {
        return insF.performQuery(test4400c).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(400);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect(JSON.stringify(err)).to.equal('{"code":400,"body":{"error":"Query invalid!"}}');
        });
    });
    it("Attempt Query 5", function () {
        return insF.performQuery(test5Notc).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(resultFinal)).to.deep.equal(test5Responsec);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt Query 18", function () {
        return insF.performQuery(test18C).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(resultFinal)).to.deep.equal(test18ResponseC);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt Query 7", function () {
        return insF.performQuery(test7R).then(function (result) {
            var resultFinal = result.body;
            Util_1.default.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            Util_1.default.test('val of expected: ' + test7ResponseR + typeof (test7ResponseR));
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(resultFinal)).to.deep.equal(test7ResponseR);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt Query 13", function () {
        return insF.performQuery(test13R).then(function (result) {
            var resultFinal = result.body;
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(resultFinal)).to.deep.equal(test13ResponseR);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt Query 15", function () {
        return insF.performQuery(test15R).then(function (result) {
            var resultFinal = result.body;
            Util_1.default.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            Util_1.default.test('val of expected: ' + test15ResponseR + typeof (test15ResponseR));
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(resultFinal)).to.deep.equal(test15ResponseR);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt Query 16", function () {
        return insF.performQuery(test16R).then(function (result) {
            var resultFinal = result.body;
            Util_1.default.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            Util_1.default.test('val of expected: ' + test16ResponseR + typeof (test16ResponseR));
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(resultFinal)).to.deep.equal(test16ResponseR);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("Attempt Query 17", function () {
        return insF.performQuery(test17R).then(function (result) {
            var resultFinal = result.body;
            Util_1.default.test('val of result: ' + result.body + typeof (JSON.stringify(result.body)));
            Util_1.default.test('val of expected: ' + test17ResponseR + typeof (test17ResponseR));
            chai_1.expect(result.code).to.equal(200);
            chai_1.expect(JSON.stringify(resultFinal)).to.deep.equal(test17ResponseR);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + JSON.stringify(err));
            chai_1.expect.fail();
        });
    });
    it("empty cache", function () {
        if (fs.existsSync('./src/controller/database.json')) {
            fs.unlinkSync('./src/controller/database.json');
        }
    });
});
//# sourceMappingURL=TestChain.js.map