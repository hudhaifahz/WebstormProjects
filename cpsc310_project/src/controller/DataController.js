"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var IInsightFacade_1 = require("./IInsightFacade");
var DataController = (function () {
    function DataController(cache) {
        if (cache === void 0) { cache = false; }
        this.cache = cache;
        this.dataSet = new Map(this.getInitialData());
    }
    DataController.prototype.getInitialData = function () {
        if (this.shouldLoadCache()) {
            return DataController.readCacheData();
        }
        else {
            return [];
        }
    };
    DataController.prototype.shouldLoadCache = function () {
        return this.cache && fs.existsSync(IInsightFacade_1.cachePath);
    };
    DataController.readCacheData = function () {
        return JSON.parse(fs.readFileSync(IInsightFacade_1.cachePath).toString());
    };
    DataController.resetCache = function () {
        if (fs.existsSync(IInsightFacade_1.cachePath)) {
            fs.unlinkSync(IInsightFacade_1.cachePath);
        }
    };
    DataController.prototype.getDataset = function (id) {
        return this.dataSet.get(id);
    };
    DataController.prototype.addDataset = function (id, content) {
        this.dataSet.set(id, content);
        if (this.cache) {
            this.writeCache();
        }
    };
    DataController.prototype.removeDataset = function (id) {
        this.dataSet.delete(id);
        if (this.cache) {
            this.writeCache();
        }
    };
    DataController.prototype.hasDataset = function (id) {
        return this.dataSet.has(id);
    };
    DataController.prototype.writeCache = function () {
        var entries = [];
        this.dataSet.forEach(function (value, key) {
            entries.push([key, value]);
        });
        fs.writeFileSync(IInsightFacade_1.cachePath, JSON.stringify(entries));
    };
    return DataController;
}());
exports.default = DataController;
//# sourceMappingURL=DataController.js.map