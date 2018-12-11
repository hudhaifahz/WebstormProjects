"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Query_1 = require("./Query");
var IInsightFacade_1 = require("./IInsightFacade");
var util_1 = require("util");
var QueryController = (function () {
    function QueryController(dataSet) {
        this.dataSet = dataSet;
    }
    QueryController.prototype.executeQuery = function (query, dataset) {
        var filteredItems = this.filterItems(query, dataset);
        var finalItems = filteredItems;
        if (query.hasTransformations()) {
            finalItems = QueryController.groupFilteredItems(filteredItems, query.TRANSFORMATIONS.GROUP, query.TRANSFORMATIONS.APPLY);
        }
        if (query.hasOrder()) {
            QueryController.sortFilteredItems(finalItems, query.OPTIONS.ORDER);
        }
        return QueryController.renderItems(finalItems, query.OPTIONS.COLUMNS);
    };
    QueryController.prototype.isMissingDataset = function (dataset) {
        return !this.dataSet.hasDataset(dataset);
    };
    QueryController.groupFilteredItems = function (items, groups, apply) {
        var itemGroups = this.createItemGroups(items, groups);
        return this.transformGroupedItems(itemGroups, apply);
    };
    QueryController.createItemGroups = function (items, groups) {
        var itemGroups = {};
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var groupKey = IInsightFacade_1.filterObjectProperties(item, groups);
            var stringifiedGroupKey = JSON.stringify(groupKey);
            if (util_1.isUndefined(itemGroups[stringifiedGroupKey])) {
                itemGroups[stringifiedGroupKey] = [item];
            }
            else {
                itemGroups[stringifiedGroupKey].push(item);
            }
        }
        return itemGroups;
    };
    QueryController.transformGroupedItems = function (itemGroups, apply) {
        var results = [];
        for (var stringifiedGroupKey in itemGroups) {
            results.push(__assign({}, JSON.parse(stringifiedGroupKey), this.applyAllTransformation(apply, itemGroups[stringifiedGroupKey])));
        }
        return results;
    };
    QueryController.applyAllTransformation = function (apply, items) {
        var applyResult = {};
        for (var _i = 0, apply_1 = apply; _i < apply_1.length; _i++) {
            var applyItem = apply_1[_i];
            applyResult[Object.keys(applyItem)[0]] = this.applySingleTransformation(applyItem, items);
        }
        return applyResult;
    };
    QueryController.applySingleTransformation = function (applyItem, items) {
        var applyFunction = applyItem[Object.keys(applyItem)[0]];
        if (Query_1.isApplyCount(applyFunction)) {
            return (new Set(items.map(function (item) { return item[applyFunction.COUNT]; })).size);
        }
        else if (Query_1.isApplyMax(applyFunction)) {
            return Math.max.apply(Math, items.map(function (item) { return item[applyFunction.MAX]; }));
        }
        else if (Query_1.isApplyMin(applyFunction)) {
            return Math.min.apply(Math, items.map(function (item) { return item[applyFunction.MIN]; }));
        }
        else if (Query_1.isApplySum(applyFunction)) {
            return items.map(function (item) { return item[applyFunction.SUM]; }).reduce(function (sum, item) { return sum + item; }, 0);
        }
        else if (Query_1.isApplyAvg(applyFunction)) {
            var modifiedSum = items
                .map(function (item) { return Number((item[applyFunction.AVG] * 10).toFixed(0)); })
                .reduce(function (sum, item) { return sum + item; }, 0);
            return Number(((modifiedSum / items.length) / 10).toFixed(2));
        }
    };
    QueryController.prototype.filterItems = function (query, dataset) {
        return this.dataSet.getDataset(dataset)
            .filter(function (item) { return QueryController.shouldIncludeItem(query.WHERE, item); });
    };
    QueryController.sortFilteredItems = function (filteredItems, order) {
        var sortKeys = typeof order === 'string' ? [order] : order.keys;
        var direction = typeof order === 'string' ? 'UP' : order.dir;
        var before = direction === 'UP' ? -1 : 1;
        var after = -before;
        filteredItems.sort(function (item1, item2) {
            for (var _i = 0, sortKeys_1 = sortKeys; _i < sortKeys_1.length; _i++) {
                var key = sortKeys_1[_i];
                var value1 = item1[key];
                var value2 = item2[key];
                if (value1 < value2) {
                    return before;
                }
                else if (value1 > value2) {
                    return after;
                }
            }
            return 0;
        });
    };
    QueryController.renderItems = function (filteredItems, columns) {
        return filteredItems.map(function (item) { return IInsightFacade_1.filterObjectProperties(item, columns); });
    };
    QueryController.shouldIncludeItem = function (filter, item) {
        if (Query_1.isOrFilter(filter)) {
            return this.processOrFilter(filter, item);
        }
        else if (Query_1.isAndFilter(filter)) {
            return this.processAndFilter(filter, item);
        }
        else if (Query_1.isLtFilter(filter)) {
            return this.processLtFilter(filter, item);
        }
        else if (Query_1.isGtFilter(filter)) {
            return this.processGtFilter(filter, item);
        }
        else if (Query_1.isEqFilter(filter)) {
            return this.processEqFilter(filter, item);
        }
        else if (Query_1.isNotFilter(filter)) {
            return !this.shouldIncludeItem(filter.NOT, item);
        }
        else if (Query_1.isIsFilter(filter)) {
            return this.processIsFilter(filter, item);
        }
        else {
            return true;
        }
    };
    QueryController.processOrFilter = function (filter, item) {
        var _this = this;
        return filter.OR.reduce(function (acc, innerQuery) {
            return acc || _this.shouldIncludeItem(innerQuery, item);
        }, false);
    };
    QueryController.processAndFilter = function (filter, item) {
        var _this = this;
        return filter.AND.reduce(function (acc, innerQuery) {
            return acc && _this.shouldIncludeItem(innerQuery, item);
        }, true);
    };
    QueryController.processLtFilter = function (filter, item) {
        var key = Object.keys(filter.LT)[0];
        return key in item && item[key] < filter.LT[key];
    };
    QueryController.processGtFilter = function (filter, item) {
        var key = Object.keys(filter.GT)[0];
        return key in item && item[key] > filter.GT[key];
    };
    QueryController.processEqFilter = function (filter, item) {
        var key = Object.keys(filter.EQ)[0];
        return key in item && item[key] === filter.EQ[key];
    };
    QueryController.processIsFilter = function (filter, item) {
        var key = Object.keys(filter.IS)[0];
        var value = filter.IS[key];
        if (!(key in item))
            return false;
        if (value === '*' || value === '**')
            return true;
        if (value.startsWith("*") && value.endsWith("*")) {
            var searchString = value.substr(1, value.length - 2);
            return item[key].indexOf(searchString) !== -1;
        }
        else if (value.startsWith("*")) {
            var searchString = value.substr(1);
            return item[key].endsWith(searchString);
        }
        else if (value.endsWith("*")) {
            var searchString = value.substr(0, value.length - 1);
            return item[key].startsWith(searchString);
        }
        else {
            return item[key] === value;
        }
    };
    return QueryController;
}());
exports.default = QueryController;
//# sourceMappingURL=QueryController.js.map