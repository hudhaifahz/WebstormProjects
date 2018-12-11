"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Decimal = require('decimal.js');
var Helpers = (function () {
    function Helpers() {
        this.contains = false;
        this.contains_rem = false;
        this.subResultRecur = [];
        this.grLen = 0;
        this.datasetID = "";
        this.x = [];
    }
    Helpers.prototype.containsDataset = function (database, id) {
        var that = this;
        var keys = Object.keys(database);
        var exists;
        keys.map(function (key) {
            var exists1;
            var x = database[key];
            if (x["id"] === id) {
                exists1 = true;
            }
            else {
                exists1 = false;
            }
            exists = exists1;
            if (exists) {
                that.contains = exists;
            }
        });
    };
    Helpers.prototype.addToDatabase = function (hash, databaseD, dataStr) {
        if (!(dataStr.length === 0)) {
            var database = databaseD;
            if (Array.isArray(database)) {
                database.push(hash);
                fs.writeFileSync(__dirname + "/database.json", JSON.stringify(database));
            }
        }
        else {
            var hashArray = [];
            hashArray.push(hash);
            fs.writeFileSync(__dirname + "/database.json", JSON.stringify(hashArray));
        }
    };
    Helpers.prototype.removeHelper = function (database, id) {
        var that = this;
        var hashArray = [];
        var keys = Object.keys(database);
        hashArray = database;
        var exists;
        for (var i = 0; i < hashArray.length; i++) {
            var x = hashArray[i];
            if (x["id"] === id) {
                hashArray.splice(i, 1);
                that.contains_rem = true;
            }
        }
        fs.writeFileSync(__dirname + "/database.json", JSON.stringify(hashArray));
    };
    Helpers.prototype.goThroughData = function (database, query) {
        var that = this;
        var querykeys = Object.keys(query);
        var subResult = [];
        var result = [];
        var transfResult = [];
        that.subResultRecur = database;
        if (querykeys.length === 2) {
            querykeys.map(function (query_key) {
                if (query_key === 'WHERE') {
                    var whereObj = query[query_key];
                    if (Object.keys(whereObj).length === 0) {
                        subResult = database;
                    }
                    else {
                        subResult = that.recurseLogic(whereObj, database, "");
                    }
                }
                else if (query_key === 'OPTIONS') {
                    var optsObj = query[query_key];
                    result = that.optTraverse(optsObj, subResult);
                }
            });
        }
        else if (querykeys.length === 3) {
            querykeys.map(function (query_key) {
                if (query_key === 'WHERE') {
                    var whereObj = query[query_key];
                    if (Object.keys(whereObj).length === 0) {
                        subResult = database;
                    }
                    else {
                        subResult = that.recurseLogic(whereObj, database, "");
                    }
                }
                else if (query_key === 'TRANSFORMATIONS') {
                    var transfObj = query[query_key];
                    transfResult = that.transfTraverser(transfObj, subResult);
                    var optsObj = query['OPTIONS'];
                    result = that.optTraverse(optsObj, transfResult);
                }
            });
        }
        return result;
    };
    Helpers.prototype.transfTraverser = function (subQuery, subResult) {
        var that = this;
        var keys = Object.keys(subQuery);
        var result = [];
        var groups = [];
        var groupsFinal = [];
        var groupObjTop = [];
        keys.map(function (key) {
            if (key === 'GROUP') {
                var groupObj = subQuery[key];
                if (Array.isArray(groupObj)) {
                    groupObjTop = groupObj;
                    if (groupObj.length === 1) {
                        var uniqueItems = that.getUniqueValues(groupObj[0], subResult);
                        for (var _i = 0, uniqueItems_1 = uniqueItems; _i < uniqueItems_1.length; _i++) {
                            var unique = uniqueItems_1[_i];
                            var group = [];
                            for (var _a = 0, subResult_1 = subResult; _a < subResult_1.length; _a++) {
                                var obj = subResult_1[_a];
                                if (obj[groupObj[0]] === unique) {
                                    group.push(obj);
                                }
                            }
                            groups.push(group);
                        }
                    }
                    else if (groupObj.length > 1) {
                        that.grLen = groupObj.length;
                        groups = that.groupRecurse(groupObj, subResult, 0);
                        that.grLen = 0;
                    }
                    for (var _b = 0, groups_1 = groups; _b < groups_1.length; _b++) {
                        var groupx = groups_1[_b];
                        var groupRepx = {};
                        var groupMember = groupx[0];
                        for (var _c = 0, groupObj_1 = groupObj; _c < groupObj_1.length; _c++) {
                            var groupObjx = groupObj_1[_c];
                            groupRepx[groupObjx] = groupMember[groupObjx];
                        }
                        groupsFinal.push(groupRepx);
                    }
                }
            }
            else if (key === 'APPLY') {
                var applyObj = subQuery[key];
                if (Array.isArray(applyObj)) {
                    for (var group_i in groups) {
                        for (var _d = 0, applyObj_1 = applyObj; _d < applyObj_1.length; _d++) {
                            var applyx = applyObj_1[_d];
                            var appKeys = Object.keys(applyx);
                            var applyKey = appKeys[0];
                            var applyOpObj = applyx[applyKey];
                            var applyOpKeys = Object.keys(applyOpObj);
                            var applyOp = applyOpKeys[0];
                            var applyOn = applyOpObj[applyOp];
                            var opResult = 0;
                            if (applyOp === 'MAX') {
                                var max = 0;
                                var group_x = groups[group_i];
                                for (var _e = 0, group_x_1 = group_x; _e < group_x_1.length; _e++) {
                                    var obj_n = group_x_1[_e];
                                    if (obj_n[applyOn] > max) {
                                        max = obj_n[applyOn];
                                    }
                                }
                                opResult = max;
                            }
                            else if (applyOp === 'MIN') {
                                var min = 123456;
                                var group_x = groups[group_i];
                                for (var _f = 0, group_x_2 = group_x; _f < group_x_2.length; _f++) {
                                    var obj_n = group_x_2[_f];
                                    if (obj_n[applyOn] < min) {
                                        min = obj_n[applyOn];
                                    }
                                }
                                opResult = min;
                            }
                            else if (applyOp === 'AVG') {
                                var group_x = groups[group_i];
                                var values = [];
                                for (var _g = 0, group_x_3 = group_x; _g < group_x_3.length; _g++) {
                                    var obj_n = group_x_3[_g];
                                    values.push(obj_n[applyOn]);
                                }
                                var avg = Number((values.map(function (val) { return new Decimal(val); }).reduce(function (a, b) { return a.plus(b); }).toNumber() / values.length).toFixed(2));
                                opResult = avg;
                            }
                            else if (applyOp === 'COUNT') {
                                var group_x = groups[group_i];
                                var uniqueVals = that.getUniqueValues(applyOn, group_x);
                                opResult = uniqueVals.length;
                            }
                            else if (applyOp === 'SUM') {
                                var group_x = groups[group_i];
                                var values = [];
                                for (var _h = 0, group_x_4 = group_x; _h < group_x_4.length; _h++) {
                                    var obj_n = group_x_4[_h];
                                    values.push(obj_n[applyOn]);
                                }
                                var sum = Number(values.map(function (val) { return new Decimal(val); }).reduce(function (a, b) { return a.plus(b); }).toNumber().toFixed(2));
                                opResult = sum;
                            }
                            groupsFinal[group_i][applyKey] = opResult;
                        }
                    }
                }
            }
        });
        return groupsFinal;
    };
    Helpers.prototype.groupRecurse = function (groupObj, subResult, i) {
        var that = this;
        var groups = [];
        var uniqueItems = that.getUniqueValues(groupObj[0], subResult);
        for (var _i = 0, uniqueItems_2 = uniqueItems; _i < uniqueItems_2.length; _i++) {
            var unique = uniqueItems_2[_i];
            var group = [];
            for (var _a = 0, subResult_2 = subResult; _a < subResult_2.length; _a++) {
                var obj = subResult_2[_a];
                if (obj[groupObj[0]] === unique) {
                    group.push(obj);
                }
            }
            if (i === that.grLen - 1) {
                groups.push(group);
            }
            else {
                var groupPopped = [];
                for (var j = 1; j < groupObj.length; j++) {
                    groupPopped.push(groupObj[j]);
                }
                groups = that.concatenateArraysBasic(groups, this.groupRecurse(groupPopped, group, i + 1));
            }
        }
        return groups;
    };
    Helpers.prototype.concatenateArraysBasic = function (a1, a2) {
        var x = a1;
        for (var _i = 0, a2_1 = a2; _i < a2_1.length; _i++) {
            var x_x = a2_1[_i];
            x.push(x_x);
        }
        return x;
    };
    Helpers.prototype.getUniqueValues = function (groupKey, subResult) {
        var uniqueValues = [];
        for (var _i = 0, subResult_3 = subResult; _i < subResult_3.length; _i++) {
            var obj = subResult_3[_i];
            if (!(uniqueValues.includes(obj[groupKey]))) {
                uniqueValues.push(obj[groupKey]);
            }
        }
        return uniqueValues;
    };
    Helpers.prototype.recurseLogic = function (subQuery, database, baseRecur) {
        var that = this;
        var keys = Object.keys(subQuery);
        var subResult = [];
        keys.map(function (whereKey) {
            var subQuery1 = subQuery[whereKey];
            if (whereKey === 'OR') {
                if (that.datasetID.includes('rooms')) {
                    if (Array.isArray(subQuery1) && subQuery1.length >= 2) {
                        var datTemp = database;
                        for (var i = 0; i < subQuery1.length; i++) {
                            var sub = [];
                            sub = that.recurseLogic(subQuery1[i], datTemp, 'OR');
                            subResult = that.concatenateArrays(subResult, sub);
                        }
                    }
                }
                else if (that.datasetID.includes('courses')) {
                    if (Array.isArray(subQuery1) && subQuery1.length >= 2) {
                        var datTemp = database;
                        for (var i = 0; i < subQuery1.length; i++) {
                            var sub = [];
                            sub = that.recurseLogic(subQuery1[i], datTemp, 'OR');
                            subResult = that.concatenateArraysBasic(subResult, sub);
                        }
                    }
                }
            }
            else if (whereKey === 'AND') {
                subResult = database;
                if (Array.isArray(subQuery1) && subQuery1.length >= 2) {
                    for (var i = 0; i < subQuery1.length - 1; i++) {
                        var sub = [];
                        sub = that.recurseLogic(subQuery1[i], that.recurseLogic(subQuery1[i + 1], subResult, 'AND'), 'AND');
                        subResult = sub;
                    }
                }
            }
            else if (whereKey === 'LT') {
                var keysx = Object.keys(subQuery1);
                var val_key = keysx[0];
                var val = subQuery1[val_key];
                for (var dr_obj_i = 0; dr_obj_i < database.length; dr_obj_i++) {
                    var dr_obj = database[dr_obj_i];
                    var subqK = Object.keys(subQuery1);
                    subqK.map(function (sub_key) {
                        var drx = dr_obj[sub_key];
                        if (dr_obj[sub_key] < val) {
                            subResult.push(dr_obj);
                        }
                    });
                }
            }
            else if (whereKey === 'GT') {
                var keysx = Object.keys(subQuery1);
                var val_key = keysx[0];
                var val = subQuery1[val_key];
                for (var dr_obj_i = 0; dr_obj_i < database.length; dr_obj_i++) {
                    var dr_obj = database[dr_obj_i];
                    var subqK = Object.keys(subQuery1);
                    subqK.map(function (sub_key) {
                        var drx = dr_obj[sub_key];
                        if (dr_obj[sub_key] > val) {
                            subResult.push(dr_obj);
                        }
                    });
                }
            }
            else if (whereKey === 'EQ') {
                var keysx = Object.keys(subQuery1);
                var val_key = keysx[0];
                var val = subQuery1[val_key];
                for (var dr_obj_i = 0; dr_obj_i < database.length; dr_obj_i++) {
                    var dr_obj = database[dr_obj_i];
                    var subqK = Object.keys(subQuery1);
                    subqK.map(function (sub_key) {
                        var drx = dr_obj[sub_key];
                        if (dr_obj[sub_key] === val) {
                            subResult.push(dr_obj);
                        }
                    });
                }
            }
            else if (whereKey === 'IS') {
                var keysx = Object.keys(subQuery1);
                var val_key = keysx[0];
                var valx = subQuery1[val_key];
                for (var dr_obj_i = 0; dr_obj_i < database.length; dr_obj_i++) {
                    var dr_obj = database[dr_obj_i];
                    var obj_keys = Object.keys(dr_obj);
                    var subqK = Object.keys(subQuery1);
                    subqK.map(function (sub_key) {
                        if (obj_keys.includes(sub_key)) {
                            var drx = dr_obj[sub_key];
                            if (valx.startsWith('*')) {
                                if (valx.length === 2 && valx.endsWith('*')) {
                                    if (drx.includes("")) {
                                        subResult.push(dr_obj);
                                    }
                                }
                                else if (valx.length === 1) {
                                    if (drx.includes("")) {
                                        subResult.push(dr_obj);
                                    }
                                }
                                else if (valx.substring(1).endsWith('*')) {
                                    if (drx.includes(valx.substring(1, valx.substring(1).indexOf('*') + 1))) {
                                        subResult.push(dr_obj);
                                    }
                                }
                                else {
                                    if (drx.endsWith(valx.substring(1))) {
                                        subResult.push(dr_obj);
                                    }
                                }
                            }
                            else {
                                if (valx.endsWith('*')) {
                                    if (drx.startsWith(valx.substring(0, valx.indexOf('*')))) {
                                        subResult.push(dr_obj);
                                    }
                                }
                                else if (valx.length === 0) {
                                    if (drx.includes("")) {
                                        subResult.push(dr_obj);
                                    }
                                }
                                else {
                                    if (drx === valx) {
                                        subResult.push(dr_obj);
                                    }
                                }
                            }
                        }
                    });
                }
            }
            else if (whereKey === 'NOT') {
                if (subResult.length === 0) {
                    var sub = [];
                    sub = that.recurseLogic(subQuery1, database, 'NOT');
                    subResult = database.filter(function (element) {
                        var truth = false;
                        for (var _i = 0, sub_1 = sub; _i < sub_1.length; _i++) {
                            var sub_x = sub_1[_i];
                            if (element === sub_x) {
                                truth = true;
                            }
                        }
                        return !truth;
                    });
                }
            }
        });
        return subResult;
    };
    Helpers.prototype.optTraverse = function (subQuery, subResult) {
        var that = this;
        var keys = Object.keys(subQuery);
        var result = [];
        var resultx = [];
        keys.map(function (key) {
            var obj = subQuery[key];
            if (key === "COLUMNS") {
                if (Array.isArray(obj)) {
                    for (var _i = 0, subResult_4 = subResult; _i < subResult_4.length; _i++) {
                        var subres_i = subResult_4[_i];
                        var rrow_json = {};
                        for (var _a = 0, obj_1 = obj; _a < obj_1.length; _a++) {
                            var col = obj_1[_a];
                            rrow_json[col] = subres_i[col];
                        }
                        result.push(rrow_json);
                    }
                }
            }
            else if (key === "ORDER") {
                if (typeof obj === 'string') {
                    result.sort(function (a, b) {
                        if (a[obj] < b[obj])
                            return -1;
                        if (a[obj] > b[obj])
                            return 1;
                        return 0;
                    });
                }
                else {
                    var sortKeys = obj['keys'];
                    if (obj['dir'] === 'UP') {
                        for (var _b = 0, sortKeys_1 = sortKeys; _b < sortKeys_1.length; _b++) {
                            var sortkey = sortKeys_1[_b];
                            result.sort(function (a, b) {
                                if (a[sortkey] < b[sortkey])
                                    return -1;
                                if (a[sortkey] > b[sortkey])
                                    return 1;
                                return 0;
                            });
                        }
                    }
                    else if (obj['dir'] === 'DOWN') {
                        for (var _c = 0, sortKeys_2 = sortKeys; _c < sortKeys_2.length; _c++) {
                            var sortkey = sortKeys_2[_c];
                            result.sort(function (a, b) {
                                if (a[sortkey] < b[sortkey])
                                    return 1;
                                if (a[sortkey] > b[sortkey])
                                    return -1;
                                return 0;
                            });
                        }
                    }
                }
            }
        });
        return result;
    };
    Helpers.prototype.processP5 = function (node) {
        var keys = Object.keys(node);
        if (keys.includes('childNodes')) {
            var childnodes = node['childNodes'];
            for (var _i = 0, childnodes_1 = childnodes; _i < childnodes_1.length; _i++) {
                var node_x = childnodes_1[_i];
                this.processP5(node_x);
            }
        }
        if (keys.includes('nodeName')) {
            if (node['nodeName'] === 'div') {
                if (keys.includes('attrs')) {
                    var attributes = node['attrs'];
                    for (var _a = 0, attributes_1 = attributes; _a < attributes_1.length; _a++) {
                        var attribute_x = attributes_1[_a];
                        if (attribute_x['name'] === 'class') {
                            if (attribute_x['value'] === 'view-content') {
                                if (keys.includes('childNodes')) {
                                    var div_childnodes = node['childNodes'];
                                    var tableNode = {};
                                    var tbodyNode = {};
                                    for (var _b = 0, div_childnodes_1 = div_childnodes; _b < div_childnodes_1.length; _b++) {
                                        var childNode_i = div_childnodes_1[_b];
                                        if (Object.keys(childNode_i).includes('nodeName')) {
                                            if (childNode_i['nodeName'] === 'table') {
                                                tableNode = childNode_i;
                                                break;
                                            }
                                        }
                                    }
                                    var table_keys = Object.keys(tableNode);
                                    if (table_keys.length > 0) {
                                        if (table_keys.includes('childNodes')) {
                                            var tableChildNodes = tableNode['childNodes'];
                                            for (var _c = 0, tableChildNodes_1 = tableChildNodes; _c < tableChildNodes_1.length; _c++) {
                                                var tableChildNodeX = tableChildNodes_1[_c];
                                                var tableChildNodeXKeys = Object.keys(tableChildNodeX);
                                                if (tableChildNodeXKeys.includes('nodeName')) {
                                                    if (tableChildNodeX['nodeName'] === 'tbody') {
                                                        tbodyNode = tableChildNodeX;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    var tbodyKeys = Object.keys(tbodyNode);
                                    if (tbodyKeys.length > 0) {
                                        if (tbodyKeys.includes('childNodes')) {
                                            var tbodyChildNodes = tbodyNode['childNodes'];
                                            for (var _d = 0, tbodyChildNodes_1 = tbodyChildNodes; _d < tbodyChildNodes_1.length; _d++) {
                                                var tbodyChildNodeX = tbodyChildNodes_1[_d];
                                                var tbodyChildKeys = Object.keys(tbodyChildNodeX);
                                                if (tbodyChildKeys.includes('nodeName')) {
                                                    var tbChNodeName = tbodyChildNodeX['nodeName'];
                                                    if (tbChNodeName === 'tr') {
                                                        var trNode = tbodyChildNodeX;
                                                        var trNodeKeys = Object.keys(trNode);
                                                        if (trNodeKeys.includes('childNodes')) {
                                                            var trChildren = trNode['childNodes'];
                                                            for (var _e = 0, trChildren_1 = trChildren; _e < trChildren_1.length; _e++) {
                                                                var trChildNodeX = trChildren_1[_e];
                                                                var trChildKeys = Object.keys(trChildNodeX);
                                                                if (trChildKeys.includes('nodeName')) {
                                                                    if (trChildNodeX['nodeName'] === 'td') {
                                                                        var tdNode = trChildNodeX;
                                                                        var tdKeys = Object.keys(tdNode);
                                                                        if (tdKeys.includes('childNodes')) {
                                                                            var tdChildren = tdNode['childNodes'];
                                                                            for (var _f = 0, tdChildren_1 = tdChildren; _f < tdChildren_1.length; _f++) {
                                                                                var tdChild = tdChildren_1[_f];
                                                                                var tdChildKeys = Object.keys(tdChild);
                                                                                if (tdChildKeys.includes('nodeName')) {
                                                                                    if (tdChild['nodeName'] === 'a') {
                                                                                        if (tdChildKeys.includes('attrs')) {
                                                                                            var tdAttrs = tdChild['attrs'];
                                                                                            for (var _g = 0, tdAttrs_1 = tdAttrs; _g < tdAttrs_1.length; _g++) {
                                                                                                var tdAttrx = tdAttrs_1[_g];
                                                                                                if (tdAttrx['name'] === 'href') {
                                                                                                    this.x.push(tdAttrx['value']);
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return this.x;
    };
    Helpers.prototype.augmentPaths = function (paths, root) {
        var pathsAugmented = [];
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var path = paths_1[_i];
            pathsAugmented.push(path.replace("./", root));
        }
        return pathsAugmented;
    };
    Helpers.prototype.existsInZip = function (zip, path) {
        var truth = false;
        Object.keys(zip.files).map(function (key) {
            var keyx = key;
            if (keyx.endsWith(path)) {
                truth = true;
            }
        });
        return truth;
    };
    Helpers.prototype.concatenateArrays = function (a1, a2) {
        var that = this;
        var x = a1;
        for (var _i = 0, a2_2 = a2; _i < a2_2.length; _i++) {
            var x_x = a2_2[_i];
            if (!this.alreadyContains(x, x_x)) {
                x.push(x_x);
            }
        }
        return x;
    };
    Helpers.prototype.checkObjectEquality = function (o, thing) {
        var that = this;
        var truth = true;
        var truthArr = [];
        var uniqueKey = {};
        if (that.datasetID.includes('courses')) {
            uniqueKey = 'courses_uuid';
        }
        else if (that.datasetID.includes('rooms')) {
            uniqueKey = 'rooms_name';
        }
        if (!(thing[uniqueKey] === o[uniqueKey])) {
            truthArr.push(false);
        }
        else {
            truthArr.push(true);
        }
        if (truthArr.includes(false)) {
            truth = false;
        }
        return truth;
    };
    Helpers.prototype.alreadyContains = function (arr, obj) {
        var that = this;
        var alreadyContainsx = false;
        for (var i = 0; i < arr.length; i++) {
            if (that.checkObjectEquality(arr[i], obj)) {
                alreadyContainsx = true;
                break;
            }
        }
        return alreadyContainsx;
    };
    return Helpers;
}());
exports.Helpers = Helpers;
//# sourceMappingURL=Helper.js.map