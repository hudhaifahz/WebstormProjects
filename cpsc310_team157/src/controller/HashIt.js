"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataRow_1 = require("./DataRow");
var HashIt = (function () {
    function HashIt(id) {
        this.id = id;
    }
    HashIt.prototype.isNoData = function () {
        if (this.dr_array.length === 0) {
            return true;
        }
        return false;
    };
    HashIt.prototype.jsonInstantiate = function (jsonArray) {
        var that = this;
        that.dr_array = [];
        for (var _i = 0, jsonArray_1 = jsonArray; _i < jsonArray_1.length; _i++) {
            var json_i = jsonArray_1[_i];
            var jsonArr_ij = json_i["result"];
            for (var _a = 0, jsonArr_ij_1 = jsonArr_ij; _a < jsonArr_ij_1.length; _a++) {
                var json_x = jsonArr_ij_1[_a];
                var keys_ij = Object.keys(json_x);
                var dr = new DataRow_1.DataRow();
                keys_ij.map(function (key) {
                    if (key === "Title") {
                        dr.courses_title = json_x[key];
                    }
                    else if (key === "id") {
                        dr.courses_uuid = json_x[key].toString();
                    }
                    else if (key === "Professor") {
                        dr.courses_instructor = json_x[key];
                    }
                    else if (key === "Audit") {
                        dr.courses_audit = json_x[key];
                    }
                    else if (key === "Course") {
                        dr.courses_id = json_x[key];
                    }
                    else if (key === "Pass") {
                        dr.courses_pass = json_x[key];
                    }
                    else if (key === "Fail") {
                        dr.courses_fail = json_x[key];
                    }
                    else if (key === "Avg") {
                        dr.courses_avg = json_x[key];
                    }
                    else if (key === "Subject") {
                        dr.courses_dept = json_x[key];
                    }
                    else if (key === "Year") {
                        if (json_x['Section'] === 'overall') {
                            dr.courses_year = 1900;
                        }
                        else {
                            var str = json_x[key];
                            dr.courses_year = parseInt(str);
                        }
                    }
                });
                that.dr_array.push(dr);
            }
            dr = null;
        }
    };
    return HashIt;
}());
exports.HashIt = HashIt;
//# sourceMappingURL=HashIt.js.map