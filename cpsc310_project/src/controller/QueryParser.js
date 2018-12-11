"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IInsightFacade_1 = require("./IInsightFacade");
var Query_1 = require("./Query");
var ParsingResult = (function () {
    function ParsingResult(query, dataset) {
        this.query = query;
        this.dataset = dataset;
    }
    return ParsingResult;
}());
exports.ParsingResult = ParsingResult;
var QueryParser = (function () {
    function QueryParser() {
    }
    QueryParser.parseQuery = function (queryLike) {
        if (!Query_1.default.isQueryLike(queryLike)) {
            return null;
        }
        var query = new Query_1.default(queryLike.WHERE, queryLike.OPTIONS, queryLike.TRANSFORMATIONS);
        var datasets = this.extractAllDatasets(query);
        var uniqueDatasets = this.removeDuplicates(datasets);
        if (uniqueDatasets.length > 1)
            return null;
        var dataset = uniqueDatasets[0];
        if (!IInsightFacade_1.isUnknownDataset(dataset)) {
            if (!this.verifyFilterDataTypes(dataset, query.WHERE))
                return null;
            if (query.hasTransformations() && !this.verifyTransformations(dataset, query.TRANSFORMATIONS))
                return null;
            if (!this.verifyOptions(query.OPTIONS, this.getAcceptableColumns(query, dataset)))
                return null;
        }
        return new ParsingResult(query, dataset);
    };
    QueryParser.getAcceptableColumns = function (query, dataset) {
        if (query.hasTransformations()) {
            return this.extractTransformationsKeys(query.TRANSFORMATIONS);
        }
        else {
            return Object.keys(IInsightFacade_1.dataSetDefinitions[dataset].keys);
        }
    };
    QueryParser.extractAllDatasets = function (query) {
        var optionsDatasets = this.extractOptionsDatasets(query.OPTIONS);
        var filterDatasets = IInsightFacade_1.isEmptyObject(query.WHERE) ? [] : this.extractFilterDatasets(query.WHERE);
        var transformationsDatasets = query.hasTransformations() ?
            this.extractTransformationsDatasets(query.TRANSFORMATIONS) : [];
        return optionsDatasets.concat(filterDatasets, transformationsDatasets);
    };
    QueryParser.removeDuplicates = function (datasets) {
        return datasets.filter(function (value, index) { return datasets.indexOf(value) === index; });
    };
    QueryParser.verifyFilterDataTypes = function (dataset, filter) {
        return IInsightFacade_1.isEmptyObject(filter) || this.verifyFilterTypes(filter, dataset, IInsightFacade_1.dataSetDefinitions[dataset].keys);
    };
    QueryParser.verifyTransformations = function (dataset, transformations) {
        var groupCorrect = this.verifyGroup(transformations.GROUP, IInsightFacade_1.dataSetDefinitions[dataset].keys);
        var applyCorrect = this.verifyApply(transformations.APPLY, IInsightFacade_1.dataSetDefinitions[dataset].keys);
        return groupCorrect && applyCorrect;
    };
    QueryParser.extractTransformationsKeys = function (transformations) {
        return transformations.APPLY.map(function (entry) { return Object.keys(entry)[0]; }).concat(transformations.GROUP);
    };
    QueryParser.verifyOptions = function (options, keys) {
        return options.COLUMNS.every(function (key) { return keys.indexOf(key) > -1; });
    };
    QueryParser.verifyGroup = function (group, keySet) {
        var keys = Object.keys(keySet);
        return group.every(function (key) { return keys.indexOf(key) !== -1; });
    };
    QueryParser.verifyApply = function (apply, keys) {
        var _this = this;
        return apply
            .map(function (entry) { return entry[Object.keys(entry)[0]]; })
            .every(function (value) { return _this.verifyApplyValue(value, keys); });
    };
    QueryParser.verifyApplyValue = function (applyValue, keys) {
        if (Query_1.isApplyCount(applyValue)) {
            return keys[applyValue.COUNT] === 'string'
                || keys[applyValue.COUNT] === 'number';
        }
        else if (Query_1.isApplyMax(applyValue)) {
            return keys[applyValue.MAX] === 'number';
        }
        else if (Query_1.isApplyMin(applyValue)) {
            return keys[applyValue.MIN] === 'number';
        }
        else if (Query_1.isApplyAvg(applyValue)) {
            return keys[applyValue.AVG] === 'number';
        }
        else {
            return keys[applyValue.SUM] === 'number';
        }
    };
    QueryParser.extractOptionsDatasets = function (options) {
        return options.COLUMNS.map(function (key) {
            var matches = key.match(IInsightFacade_1.keyRegex);
            if (matches === null) {
                return null;
            }
            else {
                return key.match(IInsightFacade_1.keyRegex)[1];
            }
        }).filter(function (dataset) { return dataset !== null; });
    };
    QueryParser.extractFilterDatasets = function (filter) {
        if (Query_1.isAndFilter(filter))
            return this.extractLogicFilterDatasets(filter.AND);
        else if (Query_1.isOrFilter(filter))
            return this.extractLogicFilterDatasets(filter.OR);
        else if (Query_1.isNotFilter(filter))
            return this.extractFilterDatasets(filter.NOT);
        else if (Query_1.isLtFilter(filter))
            return this.extractComparisonFilterDatasets(filter.LT);
        else if (Query_1.isGtFilter(filter))
            return this.extractComparisonFilterDatasets(filter.GT);
        else if (Query_1.isEqFilter(filter))
            return this.extractComparisonFilterDatasets(filter.EQ);
        else if (Query_1.isIsFilter(filter))
            return this.extractIsFilterDatasets(filter.IS);
    };
    QueryParser.extractIsFilterDatasets = function (entry) {
        return Object.keys(entry).map(function (key) { return key.match(IInsightFacade_1.keyRegex)[1]; });
    };
    QueryParser.extractTransformationsDatasets = function (transformations) {
        var groupDatasets = transformations.GROUP.map(function (key) { return key.match(IInsightFacade_1.keyRegex)[1]; });
        var applyDatasets = transformations.APPLY
            .map(function (item) { return item[Object.keys(item)[0]]; })
            .map(function (applyFunction) { return applyFunction[Object.keys(applyFunction)[0]]; })
            .map(function (key) { return key.match(IInsightFacade_1.keyRegex)[1]; });
        return groupDatasets.concat(applyDatasets);
    };
    QueryParser.verifyFilterTypes = function (filter, dataSet, keyTypes) {
        var _this = this;
        var filterType = Object.keys(filter)[0];
        switch (filterType) {
            case "OR":
            case "AND":
                return filter[filterType].reduce(function (acc, innerFilter) {
                    return acc && _this.verifyFilterTypes(innerFilter, dataSet, keyTypes);
                }, true);
            case "NOT":
                return this.verifyFilterTypes(filter[filterType], dataSet, keyTypes);
            case "LT":
            case "GT":
            case "EQ":
            case "IS":
                var key = Object.keys(filter[filterType])[0];
                var value = filter[filterType][key];
                return typeof value === keyTypes[key];
        }
    };
    QueryParser.extractLogicFilterDatasets = function (filters) {
        var _this = this;
        return filters.reduce(function (acc, filter) {
            return acc.concat(_this.extractFilterDatasets(filter));
        }, []);
    };
    QueryParser.extractComparisonFilterDatasets = function (comparator) {
        return Object.keys(comparator).map(function (key) { return key.match(IInsightFacade_1.keyRegex)[1]; });
    };
    return QueryParser;
}());
exports.default = QueryParser;
//# sourceMappingURL=QueryParser.js.map