"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IInsightFacade_1 = require("./IInsightFacade");
var JSZip = require("jszip");
var QueryParser_1 = require("./QueryParser");
var DataController_1 = require("./DataController");
var QueryController_1 = require("./QueryController");
var InsightFacade = (function () {
    function InsightFacade(cache) {
        if (cache === void 0) { cache = false; }
        this.dataController = new DataController_1.default(cache);
        this.queryController = new QueryController_1.default(this.dataController);
    }
    InsightFacade.prototype.addDataset = function (id, content) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (IInsightFacade_1.isUnknownDataset(id)) {
                return reject({
                    code: 400,
                    body: {
                        error: "Don't know how to handle " + id + " dataset"
                    }
                });
            }
            new JSZip().loadAsync(content, { base64: true })
                .then(function (zip) { return InsightFacade.processZipFile(id, zip).then(function (allItems) {
                var statusCode = _this.isNewDataset(id) ? 204 : 201;
                _this.dataController.addDataset(id, allItems);
                return resolve({
                    code: statusCode,
                    body: {}
                });
            }); })
                .catch(function () {
                return reject({
                    code: 400,
                    body: {
                        error: "Error loading zipfile"
                    }
                });
            });
        });
    };
    InsightFacade.prototype.removeDataset = function (id) {
        var _this = this;
        return new Promise(function (fulfill, reject) {
            if (!_this.dataController.hasDataset(id)) {
                return reject({
                    code: 404,
                    body: {
                        error: "Resource not found"
                    }
                });
            }
            _this.dataController.removeDataset(id);
            return fulfill({
                code: 204,
                body: {}
            });
        });
    };
    InsightFacade.prototype.performQuery = function (query) {
        var _this = this;
        return new Promise(function (fulfill, reject) {
            var parsingResult = QueryParser_1.default.parseQuery(query);
            if (parsingResult === null) {
                return reject({
                    code: 400,
                    body: {
                        error: "Malformed query"
                    }
                });
            }
            if (_this.queryController.isMissingDataset(parsingResult.dataset)) {
                return reject({
                    code: 424,
                    body: {
                        missing: [parsingResult.dataset]
                    }
                });
            }
            var rendered = _this.queryController.executeQuery(parsingResult.query, parsingResult.dataset);
            if (rendered === null) {
                return reject({
                    code: 400,
                    body: {
                        error: "No datasets"
                    }
                });
            }
            return fulfill({
                code: 200,
                body: {
                    render: 'TABLE',
                    result: rendered
                }
            });
        });
    };
    InsightFacade.prototype.isNewDataset = function (id) {
        return !this.dataController.hasDataset(id);
    };
    InsightFacade.processZipFile = function (id, zip) {
        return IInsightFacade_1.dataSetDefinitions[id].processZip(zip);
    };
    InsightFacade.prototype._addDataset = function (id, entries) {
        this.dataController.addDataset(id, entries);
    };
    return InsightFacade;
}());
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map