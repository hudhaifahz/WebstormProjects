
/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse} from "./IInsightFacade";

import fs = require("fs");
var JSZip = require("jszip");
import * as parse5 from 'parse5'
import {Room, DataRow} from "./DataRow";
import {HashIt} from "./HashIt";
import {Helpers} from "./Helper";
import {BuildingInfoParser} from "./BuildingInfo"
import {QuerySyntaxChecker} from "./QuerySyntaxChecker";
import {error} from "util";
import Log from "../Util";
import {existsSync} from "fs";
import {InsightResponseC} from "./InsResp";
import {ASTNode} from 'parse5/index'

export default class InsightFacade implements IInsightFacade{
    private database_str: string;
    private database_dat: any;

    constructor(){
        if(existsSync(__dirname+"/database.json")){
            this.database_str = fs.readFileSync(__dirname+"/database.json", "utf8");
            this.database_dat = JSON.parse(this.database_str);
        }
        else{
            this.database_str = "";
            this.database_dat = {};
        }
    }

    addDataset(id: string, content: string): Promise<InsightResponse>{
        var that = this;
        return new Promise<InsightResponse>(function (fulfill, reject) {
            if (!(id === 'rooms' || id === 'courses')){
                reject({
                    code: 400,
                    body: {
                        error: "Cannot process this file!"
                    }
                })
            }
            else {
                try {
                    var binfoParser = new BuildingInfoParser();
                    var helper = new Helpers();
                    var promiseArray: Array<Promise<any>> = [];
                    var jsonArray: Array<JSON> = [];
                    var zip = new JSZip();
                    var index_dat: any;
                    var htmArray: Array<any> = [];
                    if (that.database_str.length > 0) {
                        var database_str = that.database_str;
                        var database_dat = that.database_dat;
                        try {
                            zip.loadAsync(content, {base64: true}).then(function (zipDat: JSZip) {
                                var cxx = zipDat.file(/index.htm/);
                                if (cxx.length > 0) {
                                    var file = cxx[0];
                                    var index_path: string = file['name'];
                                    /*var zipKeys = Object.keys(zipDat.files);
                                    for (var zipKey of zipKeys) {
                                        if (zipKey.endsWith(index_path_base)) {
                                            index_path = zipKey;
                                            break;
                                        }
                                    }*/
                                    zip.files[index_path].async('string')
                                        .then(function (dat: any) {
                                            index_dat = parse5.parse(dat);
                                            //console.log(index_dat);
                                            var x: Array<string> = helper.processP5(index_dat);
                                            x = x.filter(function (item, index, inputArray) {
                                                return inputArray.indexOf(item) == index;
                                            });
                                            var zipKeys = Object.keys(zipDat.files);
                                            var root: string = '';
                                            x = helper.augmentPaths(x, root);
                                            zipKeys.map(function (key: any) {
                                                for (var x_i of x) {
                                                    if (key.endsWith(x_i)) {
                                                        promiseArray.push(zip.files[key].async('string'));
                                                    }
                                                }
                                            });
                                            Promise.all(promiseArray)
                                                .then(function (result: any) {
                                                    for (var i = 0; i < result.length; i++) {
                                                        var htmx = result[i];
                                                        try {
                                                            var htm = parse5.parse(htmx);
                                                            htmArray.push(htm);
                                                        } catch (e) {

                                                        }
                                                    }
                                                    ;
                                                    var hash = new HashIt(id);
                                                    binfoParser.parseDat(htmArray)
                                                        .then(function (result: any) {
                                                            if (Array.isArray(result)) {
                                                                hash.dr_array = result;
                                                            }
                                                            if (hash.isNoData()) {
                                                                reject({
                                                                    code: 400,
                                                                    body: {
                                                                        error: "No data present in file 1!"
                                                                    }
                                                                })
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
                                                        .catch(function (err: any) {
                                                            //console.log(err);
                                                        });

                                                })
                                                .catch(function (err: any) {
                                                    reject({
                                                        code: 400,
                                                        body: {
                                                            error: "Not a zip file!"
                                                        }
                                                    });
                                                });
                                        })
                                        .catch(function (err: any) {
                                            //console.log(err);
                                        });
                                }
                                else {
                                    Object.keys(zipDat.files).map(function (key: any) {
                                        promiseArray.push(zip.files[key].async('string'));
                                    });
                                    Promise.all(promiseArray)
                                        .then(function (result: any) {
                                            for (var i = 1; i < result.length; i++) {
                                                var json = result[i]
                                                try {
                                                    var jsonX = JSON.parse(json);
                                                    jsonArray.push(jsonX);
                                                } catch (e) {
                                                    console.log(e)
                                                }
                                            }
                                            var hash = new HashIt(id);
                                            hash.jsonInstantiate(jsonArray);
                                            if (hash.isNoData()) {
                                                reject({
                                                    code: 400,
                                                    body: {
                                                        error: "Data could not be parsed2!"
                                                    }
                                                })
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
                                        .catch(function (err: any) {
                                            reject({
                                                code: 400,
                                                body: {
                                                    error: "Error occurred!"
                                                }
                                            });
                                        });
                                }
                            })
                                .catch(function (err: any) {
                                    reject({
                                        code: 400,
                                        body: {
                                            error: "Not a zip file!"
                                        }
                                    });
                                });
                        } catch (e) {
                            reject({
                                code: 400,
                                body: {
                                    error: "Not a zip file!"
                                }
                            });
                        }
                    }
                    else {
                        var hashits: Array<HashIt> = [];
                        try {
                            zip.loadAsync(content, {base64: true}).then(function (zipDat: JSZip) {
                                var index_path_base = '/index.htm';
                                var cxx = zipDat.file(/index.htm/);
                                if (cxx.length > 0) {
                                    var file = cxx[0];
                                    var index_path: string = file['name'];
                                    var zipKeys = Object.keys(zipDat.files);
                                    /*for (var zipKey of zipKeys) {
                                        if (zipKey.endsWith(index_path_base)) {
                                            index_path = zipKey;
                                            break;
                                        }
                                    }*/
                                    zip.files[index_path].async('string')
                                        .then(function (dat: any) {
                                            index_dat = parse5.parse(dat);
                                            //console.log(index_dat);
                                            var x: Array<string> = helper.processP5(index_dat);
                                            x = x.filter(function (item, index, inputArray) {
                                                return inputArray.indexOf(item) == index;
                                            });
                                            var root: string = '';
                                            x = helper.augmentPaths(x, root);
                                            zipKeys.map(function (key: any) {
                                                for (var x_i of x) {
                                                    if (key.endsWith(x_i)) {
                                                        promiseArray.push(zip.files[key].async('string'));
                                                    }
                                                }
                                            });
                                            Promise.all(promiseArray)
                                                .then(function (result: any) {
                                                    for (var i = 0; i < result.length; i++) {
                                                        var htmx = result[i];
                                                        try {
                                                            var htm = parse5.parse(htmx);
                                                            htmArray.push(htm);
                                                        } catch (e) {

                                                        }
                                                    }
                                                    ;
                                                    var hash = new HashIt(id);
                                                    binfoParser.parseDat(htmArray)
                                                        .then(function (result: any) {
                                                            //console.log(result);
                                                            if (Array.isArray(result)) {
                                                                hash.dr_array = result;
                                                            }
                                                            if (hash.isNoData()) {
                                                                reject({
                                                                    code: 400,
                                                                    body: {
                                                                        error: "Data could not be parsed3!"
                                                                    }
                                                                })
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
                                                        .catch(function (err: any) {
                                                            //console.log(err);
                                                        });

                                                })
                                                .catch(function (err: any) {
                                                    reject({
                                                        code: 400,
                                                        body: {
                                                            error: "Not a zip file!"
                                                        }
                                                    });
                                                });
                                        })
                                        .catch(function (err: any) {
                                            //console.log(err);
                                        });
                                }
                                else {
                                    Object.keys(zipDat.files).map(function (key: any) {
                                        promiseArray.push(zip.files[key].async('string'));
                                    });
                                    Promise.all(promiseArray)
                                        .then(function (result: any) {
                                            for (var i = 1; i < result.length; i++) {
                                                var json = result[i]
                                                try {
                                                    var jsonX = JSON.parse(json);
                                                    jsonArray.push(jsonX);
                                                } catch (e) {
                                                    console.log(e)
                                                }
                                            }
                                            var hash = new HashIt(id);
                                            hash.jsonInstantiate(jsonArray);
                                            if (hash.isNoData()) {
                                                reject({
                                                    code: 400,
                                                    body: {
                                                        error: "Data could not be parsed4!"
                                                    }
                                                })
                                            }
                                            else {
                                                hashits.push(hash);
                                                fs.writeFileSync(__dirname + "/database.json", JSON.stringify(hashits));
                                                //update mem
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
                                        .catch(function (err: any) {
                                            reject({
                                                code: 400,
                                                body: {
                                                    error: "Not a zip file!"
                                                }
                                            });
                                        });
                                }
                            })
                                .catch(function (err: any) {
                                    reject({
                                        code: 400,
                                        body: {
                                            error: "Not a zip file!"
                                        }
                                    });
                                });

                        } catch (e) {
                            reject({
                                code: 400,
                                body: {
                                    error: "Not a zip file!"
                                }
                            });
                        }
                    }
                } catch (e) {
                    reject({
                        code: 400,
                        body: {
                            error: "Not a zip file!"
                        }
                    });
                }
            }
            }
        );
    }



    removeDataset(id: string): Promise<InsightResponse>{
        var that = this;
            return new Promise<InsightResponse>(function (fulfill, reject) {
                if (that.database_str.length>0){
                    var helpers = new Helpers();
                    var database_str = that.database_str;
                    var database_dat = that.database_dat;
                    helpers.containsDataset(database_dat, id);
                    if(helpers.contains) {
                        helpers.removeHelper(database_dat, id);
                        if (helpers.contains_rem === true) {
                            fulfill({
                                code:204,
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
                    else{
                        reject({
                            code: 404,
                            body: {
                                error: "Dataset does not exist in database!"
                            }
                        });
                    }
                }
                else{
                    reject({
                        code: 404,
                        body: {
                            error: "Database does not exist!"
                        }
                    });
                }
            });
        }

    performQuery(query: any): Promise<InsightResponse>{
        var that = this;
        return new Promise<InsightResponse>(function (fulfill, reject) {
            var q = new QuerySyntaxChecker();
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
                    var helper: Helpers = new Helpers();
                    helper.datasetID = q.indicator_key;
                    var x: any = {};
                    var dbExists: boolean = false;
                    var hash_dr_arr: Array<any> = [];
                    for(var i = 0; i<data_keys.length; i++){
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
                    if(dbExists){
                        var result: Array<any> = helper.goThroughData(hash_dr_arr, query);
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
                        })
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
    }
}