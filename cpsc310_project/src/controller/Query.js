"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IInsightFacade_1 = require("./IInsightFacade");
var Query = (function () {
    function Query(WHERE, OPTIONS, TRANSFORMATIONS) {
        this.WHERE = WHERE;
        this.OPTIONS = OPTIONS;
        this.TRANSFORMATIONS = TRANSFORMATIONS;
    }
    Query.isQueryLike = function (item) {
        if (!IInsightFacade_1.isObject(item))
            return false;
        var keys = Object.keys(item);
        if (keys.length !== 3 && keys.length !== 2)
            return false;
        if (keys.length === 3 && !isTransformations(item.TRANSFORMATIONS))
            return false;
        if (!isQueryOptions(item.OPTIONS))
            return false;
        return isFilter(item.WHERE) || IInsightFacade_1.isEmptyObject(item.WHERE);
    };
    Query.prototype.hasOrder = function () {
        return IInsightFacade_1.isObject(this.OPTIONS.ORDER) || typeof this.OPTIONS.ORDER === 'string';
    };
    Query.prototype.hasTransformations = function () {
        return IInsightFacade_1.isObject(this.TRANSFORMATIONS);
    };
    return Query;
}());
exports.default = Query;
function isTransformations(item) {
    if (!IInsightFacade_1.isObject(item))
        return false;
    if (Object.keys(item).length !== 2)
        return false;
    if (!Array.isArray(item.GROUP))
        return false;
    if (!Array.isArray(item.APPLY))
        return false;
    if (item.GROUP.length < 1)
        return false;
    if (item.GROUP.some(function (key) { return typeof key !== 'string'; }))
        return false;
    if (item.GROUP.some(function (key) { return key.match(IInsightFacade_1.keyRegex) === null; }))
        return false;
    if (item.APPLY.some(function (value) { return !isApply(value); }))
        return false;
    var applyKeys = item.APPLY.map(function (item) { return Object.keys(item)[0]; });
    return (new Set(applyKeys)).size === applyKeys.length;
}
function isQueryOptions(item) {
    if (!IInsightFacade_1.isObject(item))
        return false;
    var keys = Object.keys(item);
    if (keys.length !== 2 && keys.length !== 3)
        return false;
    if (!Array.isArray(item.COLUMNS))
        return false;
    if (item.COLUMNS.length < 1)
        return false;
    if (item.COLUMNS.some(function (entry) { return typeof entry !== 'string'; }))
        return false;
    if (item.COLUMNS.some(function (entry) { return entry.indexOf('_') > -1 && entry.match(IInsightFacade_1.keyRegex) === null; }))
        return false;
    if (keys.length === 3 && !isOrder(item.ORDER, item.COLUMNS))
        return false;
    return item.FORM === 'TABLE';
}
function isFilter(item) {
    if (!IInsightFacade_1.isObject(item))
        return false;
    if (Object.keys(item).length !== 1)
        return false;
    return isLtFilter(item) || isGtFilter(item) || isEqFilter(item)
        || isAndFilter(item) || isOrFilter(item) || isNotFilter(item) || isIsFilter(item);
}
function isApply(item) {
    if (!IInsightFacade_1.isObject(item))
        return false;
    if (Object.keys(item).length !== 1)
        return false;
    var token = Object.keys(item)[0];
    var value = item[token];
    if (token.indexOf('_') > -1)
        return false;
    return isApplyFunction(value);
}
function isApplyFunction(item) {
    var apply = item;
    if (!IInsightFacade_1.isObject(item))
        return false;
    if (Object.keys(item).length !== 1)
        return false;
    return isApplyMax(apply) || isApplyMin(apply) || isApplyAvg(apply) || isApplyCount(apply) || isApplySum(apply);
}
function isOrder(item, columns) {
    if (typeof item === 'string') {
        return isOrderString(item, columns);
    }
    else if (IInsightFacade_1.isObject(item)) {
        return isOrderObject(item, columns);
    }
    else {
        return false;
    }
}
function isOrderString(item, columns) {
    return columns.indexOf(item) >= 0;
}
function isOrderObject(item, columns) {
    var keys = Object.keys(item);
    if (keys.indexOf('dir') === -1)
        return false;
    if (keys.indexOf('keys') === -1)
        return false;
    if (keys.length !== 2)
        return false;
    if (!Array.isArray(item.keys))
        return false;
    if (item.keys.length < 1)
        return false;
    for (var _i = 0, _a = item.keys; _i < _a.length; _i++) {
        var key = _a[_i];
        if (columns.indexOf(key) < 0)
            return false;
    }
    return item.dir === 'UP' || item.dir === 'DOWN';
}
function isApplyMax(apply) {
    return isKey(apply.MAX);
}
exports.isApplyMax = isApplyMax;
function isApplyMin(apply) {
    return isKey(apply.MIN);
}
exports.isApplyMin = isApplyMin;
function isApplyAvg(apply) {
    return isKey(apply.AVG);
}
exports.isApplyAvg = isApplyAvg;
function isApplyCount(apply) {
    return isKey(apply.COUNT);
}
exports.isApplyCount = isApplyCount;
function isApplySum(apply) {
    return isKey(apply.SUM);
}
exports.isApplySum = isApplySum;
function isIsFilter(item) {
    if (!couldBeFilter(item))
        return false;
    if (!IInsightFacade_1.isObject(item.IS))
        return false;
    if (Object.keys(item.IS).length !== 1)
        return false;
    var key = Object.keys(item.IS)[0];
    var value = item.IS[key];
    if (key.match(IInsightFacade_1.keyRegex) === null)
        return false;
    return typeof value === 'string';
}
exports.isIsFilter = isIsFilter;
function isGtFilter(item) {
    if (!couldBeFilter(item))
        return false;
    return isComparator(item.GT);
}
exports.isGtFilter = isGtFilter;
function isLtFilter(item) {
    if (!couldBeFilter(item))
        return false;
    return isComparator(item.LT);
}
exports.isLtFilter = isLtFilter;
function isEqFilter(item) {
    if (!couldBeFilter(item))
        return false;
    return isComparator(item.EQ);
}
exports.isEqFilter = isEqFilter;
function isAndFilter(item) {
    if (!couldBeFilter(item))
        return false;
    return isLogic(item.AND);
}
exports.isAndFilter = isAndFilter;
function isOrFilter(item) {
    if (!couldBeFilter(item))
        return false;
    return isLogic(item.OR);
}
exports.isOrFilter = isOrFilter;
function isNotFilter(item) {
    if (!couldBeFilter(item))
        return false;
    return isFilter(item.NOT);
}
exports.isNotFilter = isNotFilter;
function isKey(item) {
    if (typeof item !== 'string')
        return false;
    return item.match(IInsightFacade_1.keyRegex) !== null;
}
function couldBeFilter(item) {
    if (!IInsightFacade_1.isObject(item))
        return false;
    return Object.keys(item).length === 1;
}
function isComparator(item) {
    if (!IInsightFacade_1.isObject(item))
        return false;
    if (Object.keys(item).length !== 1)
        return false;
    var key = Object.keys(item)[0];
    if (key.match(IInsightFacade_1.keyRegex) === null)
        return false;
    return typeof item[key] === 'number';
}
function isLogic(item) {
    if (!Array.isArray(item))
        return false;
    if (item.length < 1)
        return false;
    return item.every(function (item) { return isFilter(item); });
}
//# sourceMappingURL=Query.js.map