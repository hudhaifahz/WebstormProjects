"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var JSZip = require("jszip");
var parse5 = require("parse5");
var HashIt_1 = require("./HashIt");
var Helper_1 = require("./Helper");
var BuildingInfo_1 = require("./BuildingInfo");
var QuerySyntaxChecker_1 = require("./QuerySyntaxChecker");
var fs_1 = require("fs");
var InsightFacade = (function () {
    function InsightFacade() {
        if (fs_1.existsSync(__dirname + "/database.json")) {
            this.database_str = fs.readFileSync(__dirname + "/database.json", "utf8");
            this.database_dat = JSON.parse(this.database_str);
        }
        else {
            this.database_str = "";
            this.database_dat = {};
        }
    }
    InsightFacade.prototype.addDataset = function (id, content) {
        var that = this;
        return new Promise(function (fulfill, reject) {
            if (!(id === 'rooms' || id === 'courses')) {
                reject({
                    code: 400,
                    body: {
                        error: "Cannot process this file!"
                    }
                });
            }
            else {
                try {
                    var binfoParser = new BuildingInfo_1.BuildingInfoParser();
                    var helper = new Helper_1.Helpers();
                    var promiseArray = [];
                    var jsonArray = [];
                    var zip = new JSZip();
                    var index_dat;
                    var htmArray = [];
                    if (that.database_str.length > 0) {
                        var database_str = that.database_str;
                        var database_dat = that.database_dat;
                        try {
                            zip.loadAsync(content, { base64: true }).then(function (zipDat) {
                                var cxx = zipDat.file(/index.htm/);
                                if (cxx.length > 0) {
                                    var file = cxx[0];
                                    var index_path = file['name'];
                                    zip.files[index_path].async('string')
                                        .then(function (dat) {
                                        index_dat = parse5.parse(dat);
                                        var x = helper.processP5(index_dat);
                                        x = x.filter(function (item, index, inputArray) {
                                            return inputArray.indexOf(item) == index;
                                        });
                                        var zipKeys = Object.keys(zipDat.files);
                                        var root = '';
                                        x = helper.augmentPaths(x, root);
                                        zipKeys.map(function (key) {
                                            for (var _i = 0, x_1 = x; _i < x_1.length; _i++) {
                                                var x_i = x_1[_i];
                                                if (key.endsWith(x_i)) {
                                                    promiseArray.push(zip.files[key].async('string'));
                                                }
                                            }
                                        });
                                        Promise.all(promiseArray)
                                            .then(function (result) {
                                            for (var i = 0; i < result.length; i++) {
                                                var htmx = result[i];
                                                try {
                                                    var htm = parse5.parse(htmx);
                                                    htmArray.push(htm);
                                                }
                                                catch (e) {
                                                }
                                            }
                                            ;
                                            var hash = new HashIt_1.HashIt(id);
                                            binfoParser.parseDat(htmArray)
                                                .then(function (result) {
                                                if (Array.isArray(result)) {
                                                    hash.dr_array = result;
                                                }
                                                if (hash.isNoData()) {
                                                    reject({
                                                        code: 400,
                                                        body: {
                                                            error: "No data present in file 1!"
                                                        }
                                                    });
                                                }
                                                else {
                                                    helper.containsDataset(database_dat, id);
                                                    if (helper.contains) {
                                                        helper.removeHelper(database_dat, id);
                                                        if (helper.contains_rem) {
                                                            helper.addToDatabase(hash, database_dat, database_str);
                                                            that.database_str = fs.readFileSync(__dirname + "/database.json", "utf8");
                                                            that.database_dat = JSON.parse(that.database_str);
                                                            fulfill({
                                                                code: 201,
                                                                body: {
                                                                    Message: "Data Updated!"
                                                                }
                                                            });
                                                        }
                                                    }
                                                    else {
                                                        helper.addToDatabase(hash, database_dat, database_str);
                                                        that.database_str = fs.readFileSync(__dirname + "/database.json", "utf8");
                                                        that.database_dat = JSON.parse(that.database_str);
                                                        fulfill({
                                                            code: 204,
                                                            body: {
                                                                Message: "Data Added!"
                                                            }
                                                        });
                                                    }
                                                }
                                            })
                                                .catch(function (err) {
                                            });
                                        })
                                            .catch(function (err) {
                                            reject({
                                                code: 400,
                                                body: {
                                                    error: "Not a zip file!"
                                                }
                                            });
                                        });
                                    })
                                        .catch(function (err) {
                                    });
                                }
                                else {
                                    Object.keys(zipDat.files).map(function (key) {
                                        promiseArray.push(zip.files[key].async('string'));
                                    });
                                    Promise.all(promiseArray)
                                        .then(function (result) {
                                        for (var i = 1; i < result.length; i++) {
                                            var json = result[i];
                                            try {
                                                var jsonX = JSON.parse(json);
                                                jsonArray.push(jsonX);
                                            }
                                            catch (e) {
                                                console.log(e);
                                            }
                                        }
                                        var hash = new HashIt_1.HashIt(id);
                                        hash.jsonInstantiate(jsonArray);
                                        if (hash.isNoData()) {
                                            reject({
                                                code: 400,
                                                body: {
                                                    error: "Data could not be parsed2!"
                                                }
                                            });
                                        }
                                        else {
                                            helper.containsDataset(database_dat, id);
                                            if (helper.contains) {
                                                helper.removeHelper(database_dat, id);
                                                if (helper.contains_rem) {
                                                    helper.addToDatabase(hash, database_dat, database_str);
                                                    that.database_str = fs.readFileSync(__dirname + "/database.json", "utf8");
                                                    that.database_dat = JSON.parse(that.database_str);
                                                    fulfill({
                                                        code: 201,
                                                        body: {
                                                            Message: "Data Updated!"
                                                        }
                                                    });
                                                }
                                            }
                                            else {
                                                helper.addToDatabase(hash, database_dat, database_str);
                                                that.database_str = fs.readFileSync(__dirname + "/database.json", "utf8");
                                                that.database_dat = JSON.parse(that.database_str);
                                                fulfill({
                                                    code: 204,
                                                    body: {
                                                        Message: "Data Added!"
                                                    }
                                                });
                                            }
                                        }
                                    })
                                        .catch(function (err) {
                                        reject({
                                            code: 400,
                                            body: {
                                                error: "Error occurred!"
                                            }
                                        });
                                    });
                                }
                            })
                                .catch(function (err) {
                                reject({
                                    code: 400,
                                    body: {
                                        error: "Not a zip file!"
                                    }
                                });
                            });
                        }
                        catch (e) {
                            reject({
                                code: 400,
                                body: {
                                    error: "Not a zip file!"
                                }
                            });
                        }
                    }
                    else {
                        var hashits = [];
                        try {
                            zip.loadAsync(content, { base64: true }).then(function (zipDat) {
                                var index_path_base = '/index.htm';
                                var cxx = zipDat.file(/index.htm/);
                                if (cxx.length > 0) {
                                    var file = cxx[0];
                                    var index_path = file['name'];
                                    var zipKeys = Object.keys(zipDat.files);
                                    zip.files[index_path].async('string')
                                        .then(function (dat) {
                                        index_dat = parse5.parse(dat);
                                        var x = helper.processP5(index_dat);
                                        x = x.filter(function (item, index, inputArray) {
                                            return inputArray.indexOf(item) == index;
                                        });
                                        var root = '';
                                        x = helper.augmentPaths(x, root);
                                        zipKeys.map(function (key) {
                                            for (var _i = 0, x_2 = x; _i < x_2.length; _i++) {
                                                var x_i = x_2[_i];
                                                if (key.endsWith(x_i)) {
                                                    promiseArray.push(zip.files[key].async('string'));
                                                }
                                            }
                                        });
                                        Promise.all(promiseArray)
                                            .then(function (result) {
                                            for (var i = 0; i < result.length; i++) {
                                                var htmx = result[i];
                                                try {
                                                    var htm = parse5.parse(htmx);
                                                    htmArray.push(htm);
                                                }
                                                catch (e) {
                                                }
                                            }
                                            ;
                                            var hash = new HashIt_1.HashIt(id);
                                            binfoParser.parseDat(htmArray)
                                                .then(function (result) {
                                                if (Array.isArray(result)) {
                                                    hash.dr_array = result;
                                                }
                                                if (hash.isNoData()) {
                                                    reject({
                                                        code: 400,
                                                        body: {
                                                            error: "Data could not be parsed3!"
                                                        }
                                                    });
                                                }
                                                else {
                                                    hashits.push(hash);
                                                    fs.writeFileSync(__dirname + "/database.json", JSON.stringify(hashits));
                                                    that.database_str = fs.readFileSync(__dirname + "/database.json", "utf8");
                                                    that.database_dat = JSON.parse(that.database_str);
                                                    fulfill({
                                                        code: 204,
                                                        body: {
                                                            Message: "Data Added!"
                                                        }
                                                    });
                                                }
                                            })
                                                .catch(function (err) {
                                            });
                                        })
                                            .catch(function (err) {
                                            reject({
                                                code: 400,
                                                body: {
                                                    error: "Not a zip file!"
                                                }
                                            });
                                        });
                                    })
                                        .catch(function (err) {
                                    });
                                }
                                else {
                                    Object.keys(zipDat.files).map(function (key) {
                                        promiseArray.push(zip.files[key].async('string'));
                                    });
                                    Promise.all(promiseArray)
                                        .then(function (result) {
                                        for (var i = 1; i < result.length; i++) {
                                            var json = result[i];
                                            try {
                                                var jsonX = JSON.parse(json);
                                                jsonArray.push(jsonX);
                                            }
                                            catch (e) {
                                                console.log(e);
                                            }
                                        }
                                        var hash = new HashIt_1.HashIt(id);
                                        hash.jsonInstantiate(jsonArray);
                                        if (hash.isNoData()) {
                                            reject({
                                                code: 400,
                                                body: {
                                                    error: "Data could not be parsed4!"
                                                }
                                            });
                                        }
                                        else {
                                            hashits.push(hash);
                                            fs.writeFileSync(__dirname + "/database.json", JSON.stringify(hashits));
                                            that.database_str = fs.readFileSync(__dirname + "/database.json", "utf8");
                                            that.database_dat = JSON.parse(that.database_str);
                                            fulfill({
                                                code: 204,
                                                body: {
                                                    Message: "Data Added!"
                                                }
                                            });
                                        }
                                    })
                                        .catch(function (err) {
                                        reject({
                                            code: 400,
                                            body: {
                                                error: "Not a zip file!"
                                            }
                                        });
                                    });
                                }
                            })
                                .catch(function (err) {
                                reject({
                                    code: 400,
                                    body: {
                                        error: "Not a zip file!"
                                    }
                                });
                            });
                        }
                        catch (e) {
                            reject({
                                code: 400,
                                body: {
                                    error: "Not a zip file!"
                                }
                            });
                        }
                    }
                }
                catch (e) {
                    reject({
                        code: 400,
                        body: {
                            error: "Not a zip file!"
                        }
                    });
                }
            }
        });
    };
    InsightFacade.prototype.removeDataset = function (id) {
        var that = this;
        return new Promise(function (fulfill, reject) {
            if (that.database_str.length > 0) {
                var helpers = new Helper_1.Helpers();
                var database_str = that.database_str;
                var database_dat = that.database_dat;
                helpers.containsDataset(database_dat, id);
                if (helpers.contains) {
                    helpers.removeHelper(database_dat, id);
                    if (helpers.contains_rem === true) {
                        fulfill({
                            code: 204,
                            body: {
                                Message: "deleted"
                            }
                        });
                    }
                    else {
                        reject({
                            code: 404,
                            body: {
                                error: "Dataset does not exist in database!"
                            }
                        });
                    }
                }
                else {
                    reject({
                        code: 404,
                        body: {
                            error: "Dataset does not exist in database!"
                        }
                    });
                }
            }
            else {
                reject({
                    code: 404,
                    body: {
                        error: "Database does not exist!"
                    }
                });
            }
        });
    };
    InsightFacade.prototype.performQuery = function (query) {
        var that = this;
        return new Promise(function (fulfill, reject) {
            var q = new QuerySyntaxChecker_1.QuerySyntaxChecker();
            if (q.goThroughData(query)) {
                var database_str = that.database_str;
                if (database_str === "") {
                    reject({
                        code: 424,
                        body: {
                            error: "No datasets avaialable"
                        }
                    });
                }
                else {
                    var database_dat = that.database_dat;
                    var data_keys = Object.keys(database_dat);
                    var helper = new Helper_1.Helpers();
                    helper.datasetID = q.indicator_key;
                    var x = {};
                    var dbExists = false;
                    var hash_dr_arr = [];
                    for (var i = 0; i < data_keys.length; i++) {
                        var key = data_keys[i];
                        var hash_i = database_dat[key];
                        hash_dr_arr = hash_i["dr_array"];
                        if (Array.isArray(hash_dr_arr) && hash_dr_arr.length > 0) {
                            if (Object.keys(hash_dr_arr[0]).includes(q.indicator_key)) {
                                dbExists = true;
                                break;
                            }
                        }
                    }
                    if (dbExists) {
                        var result = helper.goThroughData(hash_dr_arr, query);
                        x["result"] = result;
                        fulfill({
                            code: 200,
                            body: x
                        });
                    }
                    else {
                        reject({
                            code: 424,
                            body: {
                                error: "Valid database not found"
                            }
                        });
                    }
                }
            }
            else {
                reject({
                    code: 400,
                    body: {
                        error: "Query invalid!"
                    }
                });
            }
        });
    };
    return InsightFacade;
}());
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map