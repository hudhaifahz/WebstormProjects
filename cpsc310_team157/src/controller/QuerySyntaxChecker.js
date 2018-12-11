"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QuerySyntaxChecker = (function () {
    function QuerySyntaxChecker() {
        this.course_keys = ['courses_id', 'courses_title', 'courses_uuid', 'courses_instructor', 'courses_audit', 'courses_pass', 'courses_fail', 'courses_avg', 'courses_dept', 'courses_year'];
        this.rooms_keys = ['rooms_fullname', 'rooms_shortname', 'rooms_name', 'rooms_address', 'rooms_lat', 'rooms_lon', 'rooms_number', 'rooms_seats', 'rooms_href', 'rooms_type', 'rooms_furniture'];
        this.course_num_keys = ['courses_audit', 'courses_pass', 'courses_fail', 'courses_avg', 'courses_year'];
        this.course_str_keys = ['courses_id', 'courses_title', 'courses_instructor', 'courses_dept', 'courses_uuid'];
        this.rooms_num_keys = ['rooms_lat', 'rooms_lon', 'rooms_seats'];
        this.rooms_str_keys = ['rooms_fullname', 'rooms_shortname', 'rooms_name', 'rooms_address', 'rooms_number', 'rooms_href', 'rooms_type', 'rooms_furniture'];
        this.apply_keys = ['MAX', 'MIN', 'AVG', 'COUNT', 'SUM'];
        this.group_keys = [];
        this.apply_strings = [];
        this.indicator_key = "";
        this.transf_present = false;
    }
    QuerySyntaxChecker.prototype.basicMixedQueryCheck = function (query) {
        var queryString = JSON.stringify(query);
        var truth = true;
        for (var i = 0; i < this.course_keys.length; i++) {
            for (var j = 0; j < this.rooms_keys.length; j++) {
                if (queryString.includes(this.course_keys[i]) && queryString.includes(this.rooms_keys[j])) {
                    truth = false;
                }
            }
        }
        return truth;
    };
    QuerySyntaxChecker.prototype.goThroughData = function (query) {
        var truth = true;
        if (this.basicMixedQueryCheck(query)) {
            var that = this;
            var querykeys = Object.keys(query);
            var subResult = [];
            var result = [];
            if (querykeys.length === 2) {
                querykeys.map(function (query_key) {
                    if (query_key === 'WHERE') {
                        var whereObj = query[query_key];
                        if (!(Array.isArray(whereObj))) {
                            if (Object.keys(whereObj).length === 0) {
                                subResult.push(true);
                            }
                            else {
                                subResult = that.recurseLogic(whereObj, subResult);
                            }
                        }
                        else {
                            subResult.push(false);
                        }
                    }
                    else if (query_key === 'OPTIONS') {
                        var optsObj = query[query_key];
                        if (!(Array.isArray(optsObj))) {
                            subResult = that.concatenateArrays(subResult, that.optTraverse(optsObj, subResult));
                        }
                        else {
                            subResult.push(false);
                        }
                    }
                    else {
                        subResult.push(false);
                    }
                });
                if (subResult.includes(false)) {
                    truth = false;
                }
            }
            else if (querykeys.length === 3) {
                querykeys.map(function (query_key) {
                    if (query_key === 'WHERE') {
                        var whereObj = query[query_key];
                        if (!(Array.isArray(whereObj))) {
                            if (Object.keys(whereObj).length === 0) {
                                subResult.push(true);
                            }
                            else {
                                subResult = that.recurseLogic(whereObj, subResult);
                            }
                        }
                        else {
                            subResult.push(false);
                        }
                    }
                    else if (query_key === 'OPTIONS') {
                        subResult.push(true);
                    }
                    else if (query_key === 'TRANSFORMATIONS') {
                        that.transf_present = true;
                        var transfObj = query[query_key];
                        if (!(Array.isArray(transfObj))) {
                            subResult = that.concatenateArrays(subResult, that.transfTraverse(transfObj, subResult));
                            var optsObj = query['OPTIONS'];
                            if (!(Array.isArray(optsObj))) {
                                subResult = that.concatenateArrays(subResult, that.optTraverse(optsObj, subResult));
                            }
                            else {
                                subResult.push(false);
                            }
                        }
                        else {
                            subResult.push(false);
                        }
                    }
                    else {
                        subResult.push(false);
                    }
                });
                if (subResult.includes(false)) {
                    truth = false;
                }
            }
            else {
                truth = false;
            }
        }
        else {
            truth = false;
        }
        return truth;
    };
    QuerySyntaxChecker.prototype.recurseLogic = function (subQuery, database) {
        var that = this;
        var keys = Object.keys(subQuery);
        var subResult = [];
        keys.map(function (whereKey) {
            var subQuery1 = subQuery[whereKey];
            if (Object.keys(subQuery1).length > 0) {
                if (whereKey === 'OR' || whereKey === 'AND') {
                    if (Array.isArray(subQuery1) && subQuery1.length >= 2) {
                        for (var i = 0; i < subQuery1.length; i++) {
                            var sub = [];
                            sub = that.recurseLogic(subQuery1[i], database);
                            subResult = that.concatenateArrays(subResult, sub);
                        }
                    }
                    else {
                        subResult.push(false);
                    }
                }
                else if (whereKey === 'LT' || whereKey === 'GT' || whereKey === 'EQ') {
                    if (!(Array.isArray(subQuery1))) {
                        var keysx = Object.keys(subQuery1);
                        var val_key = keysx[0];
                        if (that.course_num_keys.includes(val_key) || that.rooms_num_keys.includes(val_key)) {
                            that.indicator_key = val_key;
                            var valxz = subQuery1[val_key];
                            if (typeof valxz === 'number') {
                                subResult.push(true);
                            }
                            else {
                                subResult.push(false);
                            }
                        }
                        else {
                            subResult.push(false);
                        }
                    }
                    else {
                        subResult.push(false);
                    }
                }
                else if (whereKey === 'IS') {
                    if (!(Array.isArray(subQuery1))) {
                        var keysx = Object.keys(subQuery1);
                        var val_key = keysx[0];
                        if (that.course_str_keys.includes(val_key) || that.rooms_str_keys.includes(val_key)) {
                            that.indicator_key = val_key;
                            var valx = subQuery1[val_key];
                            if (typeof valx === "string") {
                                if (valx.length === 0) {
                                    subResult.push(true);
                                }
                                else if (valx.startsWith('*')) {
                                    if (valx.endsWith('*') && valx.length === 2) {
                                        subResult.push(true);
                                    }
                                    else if (valx.substring(1).endsWith('*')) {
                                        if (valx.substring(1, valx.length - 1).includes('*')) {
                                            subResult.push(false);
                                        }
                                        else {
                                            subResult.push(true);
                                        }
                                    }
                                    else {
                                        if (valx.substring(1).includes('*')) {
                                            subResult.push(false);
                                        }
                                        else {
                                            subResult.push(true);
                                        }
                                    }
                                }
                                else {
                                    if (valx.endsWith('*')) {
                                        if (valx.substring(0, valx.length - 1).includes('*')) {
                                            subResult.push(false);
                                        }
                                        else {
                                            subResult.push(true);
                                        }
                                    }
                                    else {
                                        if (valx.includes('*')) {
                                            subResult.push(false);
                                        }
                                        else {
                                            subResult.push(true);
                                        }
                                    }
                                }
                            }
                            else {
                                subResult.push(false);
                            }
                        }
                        else {
                            subResult.push(false);
                        }
                    }
                    else {
                        subResult.push(false);
                    }
                }
                else if (whereKey === 'NOT') {
                    if (!(Array.isArray(subQuery1))) {
                        var sub = [];
                        sub = that.recurseLogic(subQuery1, database);
                        subResult = that.concatenateArrays(subResult, sub);
                    }
                }
                else {
                    subResult.push(false);
                }
            }
            else {
                subResult.push(false);
            }
        });
        return subResult;
    };
    QuerySyntaxChecker.prototype.optTraverse = function (subQuery, subResult) {
        var that = this;
        var keys = Object.keys(subQuery);
        if (keys.length < 1) {
            result.push(false);
        }
        var result = [];
        var resultx = [];
        keys.map(function (key) {
            var obj = subQuery[key];
            if (key === "COLUMNS") {
                if (Array.isArray(obj)) {
                    var truthx = true;
                    if (that.transf_present) {
                        for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                            var obj_x = obj_1[_i];
                            if (!(that.group_keys.includes(obj_x) || that.apply_strings.includes(obj_x))) {
                                truthx = false;
                            }
                            else {
                                if (!(that.apply_strings.includes(obj_x))) {
                                    that.indicator_key = obj_x;
                                }
                            }
                        }
                    }
                    else {
                        for (var _a = 0, obj_2 = obj; _a < obj_2.length; _a++) {
                            var obj_x = obj_2[_a];
                            if (!(that.rooms_keys.includes(obj_x) || that.course_keys.includes(obj_x) || that.apply_strings.includes(obj_x))) {
                                truthx = false;
                            }
                            else {
                                if (!(that.apply_strings.includes(obj_x))) {
                                    that.indicator_key = obj_x;
                                }
                            }
                        }
                    }
                    result.push(truthx);
                    resultx = obj;
                }
                else {
                    result.push(false);
                }
            }
            else if (key === "ORDER") {
                if (typeof obj === 'string') {
                    if (that.course_keys.includes(obj) || that.rooms_keys.includes(obj) || that.apply_strings.includes(obj)) {
                        if (!(resultx.includes(obj))) {
                            result.push(false);
                        }
                        else {
                            result.push(true);
                            if (that.course_keys.includes(obj) || that.rooms_keys.includes(obj)) {
                                that.indicator_key = obj;
                            }
                        }
                    }
                }
                else if (typeof obj === 'number') {
                    result.push(false);
                }
                else if (Array.isArray(obj)) {
                    result.push(false);
                }
                else {
                    var subObjKeys = Object.keys(obj);
                    if (subObjKeys.length > 2) {
                        result.push(false);
                    }
                    else {
                        subObjKeys.map(function (subObjKey) {
                            if (subObjKey === 'dir') {
                                var dir = obj[subObjKey];
                                if (typeof dir === 'string') {
                                    if (!(dir === 'UP' || dir === 'DOWN')) {
                                        result.push(false);
                                    }
                                    else {
                                        result.push(true);
                                    }
                                }
                                else {
                                    result.push(false);
                                }
                            }
                            else if (subObjKey === 'keys') {
                                var ordKeys = obj[subObjKey];
                                if (Array.isArray(ordKeys)) {
                                    if (ordKeys.length < 1) {
                                        result.push(false);
                                    }
                                    else {
                                        for (var _i = 0, ordKeys_1 = ordKeys; _i < ordKeys_1.length; _i++) {
                                            var ordKeyx = ordKeys_1[_i];
                                            if (!(resultx.includes(ordKeyx))) {
                                                result.push(false);
                                            }
                                            else {
                                                result.push(true);
                                            }
                                        }
                                    }
                                }
                                else {
                                    subResult.push(false);
                                }
                            }
                            else {
                                result.push(false);
                            }
                        });
                    }
                }
            }
            else {
                result.push(false);
            }
        });
        return result;
    };
    QuerySyntaxChecker.prototype.transfTraverse = function (subQuery, subResult) {
        var that = this;
        var result = [];
        var subkeys = Object.keys(subQuery);
        if (subkeys.length === 2) {
            subkeys.map(function (key) {
                if (key === 'GROUP') {
                    var groupObj = subQuery['GROUP'];
                    if (Array.isArray(groupObj)) {
                        if (groupObj.length > 0) {
                            var truthx = true;
                            for (var _i = 0, groupObj_1 = groupObj; _i < groupObj_1.length; _i++) {
                                var group_x = groupObj_1[_i];
                                if (!(that.rooms_keys.includes(group_x) || that.course_keys.includes(group_x))) {
                                    truthx = false;
                                }
                                else {
                                    that.group_keys.push(group_x);
                                    that.indicator_key = group_x;
                                }
                            }
                            result.push(truthx);
                        }
                        else {
                            result.push(false);
                        }
                    }
                    else {
                        result.push(false);
                    }
                }
                else if (key === 'APPLY') {
                    var applyObj = subQuery['APPLY'];
                    if (Array.isArray(applyObj)) {
                        if (applyObj.length > 0) {
                            for (var _a = 0, applyObj_1 = applyObj; _a < applyObj_1.length; _a++) {
                                var subObj = applyObj_1[_a];
                                if (typeof subObj === 'string') {
                                    result.push(false);
                                }
                                else if (typeof subObj === 'number') {
                                    result.push(false);
                                }
                                else if (Array.isArray(subObj)) {
                                    result.push(false);
                                }
                                else {
                                    var subsubkeys = Object.keys(subObj);
                                    if (subsubkeys.length === 1) {
                                        var userDefStr = subsubkeys[0];
                                        if (userDefStr.includes('_')) {
                                            result.push(false);
                                        }
                                        else {
                                            var subsubkey = userDefStr;
                                            var subsubobj = subObj[subsubkey];
                                            if (that.apply_strings.includes(subsubkey)) {
                                                result.push(false);
                                            }
                                            that.apply_strings.push(subsubkey);
                                            var sub3Keys = Object.keys(subsubobj);
                                            if (sub3Keys.length > 1) {
                                                result.push(false);
                                            }
                                            else {
                                                var sub3key = sub3Keys[0];
                                                if (!(that.apply_keys.includes(sub3key))) {
                                                    result.push(false);
                                                }
                                                else {
                                                    result.push(true);
                                                    var sub3Val = subsubobj[sub3key];
                                                    if (!(that.course_keys.includes(sub3Val) || that.rooms_keys.includes(sub3Val))) {
                                                        result.push(false);
                                                    }
                                                    else {
                                                        if (sub3key === 'MAX' || sub3key === 'MIN' || sub3key === 'AVG' || sub3key === 'SUM') {
                                                            if (!(that.course_num_keys.includes(sub3Val) || that.rooms_num_keys.includes(sub3Val))) {
                                                                result.push(false);
                                                            }
                                                            else {
                                                                result.push(true);
                                                            }
                                                        }
                                                        result.push(true);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        result.push(false);
                                    }
                                }
                            }
                        }
                        else {
                            result.push(true);
                        }
                    }
                    else {
                        result.push(false);
                    }
                }
                else {
                    result.push(false);
                }
            });
        }
        else {
            result.push(false);
        }
        return result;
    };
    QuerySyntaxChecker.prototype.concatenateArrays = function (a1, a2) {
        var x = a1;
        for (var _i = 0, a2_1 = a2; _i < a2_1.length; _i++) {
            var x_x = a2_1[_i];
            x.push(x_x);
        }
        return x;
    };
    return QuerySyntaxChecker;
}());
exports.QuerySyntaxChecker = QuerySyntaxChecker;
//# sourceMappingURL=QuerySyntaxChecker.js.map