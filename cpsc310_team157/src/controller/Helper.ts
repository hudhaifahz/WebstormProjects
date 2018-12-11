let fs = require("fs")
import {HashIt} from "./HashIt";
let Decimal = require('decimal.js');

export class Helpers{
    contains: boolean = false;
    contains_rem: boolean = false;
    subResultRecur: Array<any> = [];
    grLen: number = 0;
    datasetID: string = "";
    constructor(){}

    public containsDataset(database: any, id: string){
        var that = this;
        var keys = Object.keys(database);
        var exists: boolean;
        keys.map(function (key: any) {
            var exists1: boolean;
            var x = database[key];
            if (x["id"] === id) {
                exists1 = true;
            }
            else {
                exists1 = false
            }
            exists = exists1;
            if(exists){
                that.contains = exists;
            }
        });
    }

    public addToDatabase(hash: HashIt, databaseD: any, dataStr: string){
        if(!(dataStr.length === 0)) {
            var database = databaseD;
            if (Array.isArray(database)) {
                database.push(hash);
                fs.writeFileSync(__dirname+"/database.json", JSON.stringify(database));
            }
        }
        else{
            var hashArray: Array<any> = [];
            hashArray.push(hash);
            fs.writeFileSync(__dirname+"/database.json", JSON.stringify(hashArray));
        }
    }


    public removeHelper(database: any, id: string){
        var that = this;
        var hashArray: Array<any> = [];
        var keys = Object.keys(database);
        hashArray = database;
        var exists: boolean;
        for(var i = 0; i<hashArray.length;i++){
            var x = hashArray[i];
            if (x["id"] === id) {
                hashArray.splice(i, 1);
                that.contains_rem = true;
            }
        }
        fs.writeFileSync(__dirname+"/database.json", JSON.stringify(hashArray));
    }

    public goThroughData(database: Array<any>, query: any){
        var that = this;
        var querykeys = Object.keys(query);
        var subResult: Array<any> = [];
        var result: Array<any> = [];
        var transfResult: Array<any> = [];
        that.subResultRecur = database;
        if(querykeys.length === 2) {
            querykeys.map(function (query_key: any) {
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
        else if(querykeys.length === 3){
            querykeys.map(function (query_key: any) {
                if (query_key === 'WHERE') {
                    var whereObj = query[query_key];
                    if (Object.keys(whereObj).length === 0) {
                        subResult = database;
                    }
                    else {
                        subResult = that.recurseLogic(whereObj, database, "");
                    }
                }
                else if(query_key === 'TRANSFORMATIONS'){
                    var transfObj = query[query_key];
                    transfResult = that.transfTraverser(transfObj, subResult);
                    var optsObj = query['OPTIONS'];
                    result = that.optTraverse(optsObj, transfResult);
                }
            })
        }
        return result;
    }

    private transfTraverser(subQuery: any, subResult: Array<any>){
        var that = this;
        var keys = Object.keys(subQuery);
        var result: Array<any> = [];
        var groups: Array<any> = [];
        var groupsFinal: Array<any> = [];
        var groupObjTop: Array<any> = [];
        keys.map(function (key: any) {
            if(key === 'GROUP'){
                var groupObj = subQuery[key];
                if(Array.isArray(groupObj)){
                    groupObjTop = groupObj;
                    if(groupObj.length === 1) {
                        var uniqueItems: Array<any> = that.getUniqueValues(groupObj[0], subResult);
                        for(var unique of uniqueItems){
                            var group: Array<any> = [];
                            for(var obj of subResult){
                                if(obj[groupObj[0]] === unique){
                                    group.push(obj);
                                }
                            }
                            groups.push(group);
                        }
                    }
                    else if(groupObj.length > 1){
                        that.grLen = groupObj.length;
                        groups = that.groupRecurse(groupObj, subResult, 0);
                        that.grLen = 0;
                    }
                    for(var groupx of groups){
                        var groupRepx: any = {};
                        var groupMember = groupx[0];
                        for(var groupObjx of groupObj){
                            groupRepx[groupObjx] = groupMember[groupObjx];
                        }
                        groupsFinal.push(groupRepx);
                    }
                    //console.log('x');
                }
            }
            else if(key === 'APPLY'){
                var applyObj = subQuery[key];
                if(Array.isArray(applyObj)){
                    for(var group_i in groups){
                        for(var applyx of applyObj){
                            var appKeys = Object.keys(applyx);
                            var applyKey = appKeys[0];
                            var applyOpObj = applyx[applyKey];
                            var applyOpKeys = Object.keys(applyOpObj);
                            var applyOp: any = applyOpKeys[0];
                            var applyOn = applyOpObj[applyOp];
                            var opResult: number = 0;
                            if(applyOp === 'MAX'){
                                var max = 0;
                                var group_x: Array<any> = groups[group_i];
                                for(var obj_n of group_x){
                                    if(obj_n[applyOn]>max){
                                        max = obj_n[applyOn];
                                    }
                                }
                                opResult = max;
                            }
                            else if(applyOp === 'MIN'){
                                var min = 123456;
                                var group_x: Array<any> = groups[group_i];
                                for(var obj_n of group_x){
                                    if(obj_n[applyOn]<min){
                                        min = obj_n[applyOn];
                                    }
                                }
                                opResult = min;
                            }
                            else if(applyOp === 'AVG'){
                                var group_x: Array<any> = groups[group_i];
                                var values: Array<number> = [];
                                for(var obj_n of group_x){
                                    values.push(obj_n[applyOn]);
                                }
                                let avg: number = Number((values.map((val: any) => <any>new Decimal(val)).reduce((a,b) => a.plus(b)).toNumber() / values.length).toFixed(2));
                                opResult = avg;
                            }
                            else if(applyOp === 'COUNT'){
                                var group_x: Array<any> = groups[group_i];
                                var uniqueVals = that.getUniqueValues(applyOn, group_x);
                                opResult = uniqueVals.length;
                            }
                            else if(applyOp === 'SUM'){
                                var group_x: Array<any> = groups[group_i];
                                var values: Array<number> = [];
                                for(var obj_n of group_x){
                                    values.push(obj_n[applyOn]);
                                }
                                let sum = Number(values.map((val: any) => new Decimal(val)).reduce((a,b) => a.plus(b)).toNumber().toFixed(2));
                                opResult = sum;
                            }
                            groupsFinal[group_i][applyKey] = opResult;
                        }
                    }
                }
            }
        });
        return groupsFinal;
    }

    private groupRecurse(groupObj: Array<any>, subResult: Array<any>, i: number): Array<any>{
        var that = this;
        var groups: Array<any> = [];
        var uniqueItems = that.getUniqueValues(groupObj[0], subResult);
        for(var unique of uniqueItems){
            var group: Array<any> = [];
            for(var obj of subResult){
                if(obj[groupObj[0]] === unique){
                    group.push(obj);
                }
            }
            if(i === that.grLen - 1){
                groups.push(group);
            }
            else {
                var groupPopped: Array<any> = [];
                for(var j = 1; j < groupObj.length; j++){
                    groupPopped.push(groupObj[j]);
                }
                groups = that.concatenateArraysBasic(groups, this.groupRecurse(groupPopped, group, i+1));
            }
        }
        return groups;
    }

    private concatenateArraysBasic(a1: Array<any>, a2:Array<any>): Array<any>{
        var x = a1;
        for(var x_x of a2){
            x.push(x_x);
        }
        return x;
    }

    private getUniqueValues(groupKey: any, subResult: Array<any>){
        var uniqueValues: Array<any> = [];
        for(var obj of subResult){
            if(!(uniqueValues.includes(obj[groupKey]))){
                uniqueValues.push(obj[groupKey]);
            }
        }
        return uniqueValues;
    }

    private recurseLogic(subQuery: any, database: Array<any>, baseRecur: string): Array<any> {
        var that = this;
        var keys = Object.keys(subQuery);
        var subResult: Array<any> = [];
        keys.map(function (whereKey) {
            var subQuery1 = subQuery[whereKey];
            if (whereKey === 'OR') {
                if(that.datasetID.includes('rooms')) {
                    if (Array.isArray(subQuery1) && subQuery1.length >= 2) {
                        var datTemp = database;
                        for (var i = 0; i < subQuery1.length; i++) {
                            var sub: Array<any> = [];
                            sub = that.recurseLogic(subQuery1[i], datTemp, 'OR');
                            subResult = that.concatenateArrays(subResult, sub);
                            //console.log(subResult);
                        }
                    }
                }
                else if(that.datasetID.includes('courses')){
                    if (Array.isArray(subQuery1) && subQuery1.length >= 2) {
                        var datTemp = database;
                        for (var i = 0; i < subQuery1.length; i++) {
                            var sub: Array<any> = [];
                            sub = that.recurseLogic(subQuery1[i], datTemp, 'OR');
                            subResult = that.concatenateArraysBasic(subResult, sub);
                            //console.log(subResult);
                        }
                    }
                }
            }
            else if (whereKey === 'AND') {
                subResult = database;
                if (Array.isArray(subQuery1) && subQuery1.length >= 2) {
                    for(var i = 0; i<subQuery1.length-1;i++) {
                        var sub:Array<any> = [];
                        sub = that.recurseLogic(subQuery1[i], that.recurseLogic(subQuery1[i+1], subResult, 'AND'), 'AND');
                        subResult = sub;
                        //console.log(subResult);
                    }
                }
            }
            else if (whereKey === 'LT') {
                var keysx = Object.keys(subQuery1);
                var val_key = keysx[0];
                var val: any = subQuery1[val_key];
                for(var dr_obj_i = 0; dr_obj_i < database.length; dr_obj_i++){
                    var dr_obj = database[dr_obj_i];
                    var subqK = Object.keys(subQuery1);
                    subqK.map(function (sub_key: any) {
                        var drx = dr_obj[sub_key];
                        if(dr_obj[sub_key] < val){
                            subResult.push(dr_obj);
                            /*if(baseRecur === 'OR') {
                                database.splice(dr_obj_i, 1);
                            }*/
                        }
                    });
                }
            }
            else if (whereKey === 'GT') {
                var keysx = Object.keys(subQuery1);
                var val_key = keysx[0];
                var val: any = subQuery1[val_key];
                for(var dr_obj_i = 0; dr_obj_i < database.length; dr_obj_i++){
                    var dr_obj = database[dr_obj_i];
                    var subqK = Object.keys(subQuery1);
                    subqK.map(function (sub_key: any) {
                        var drx = dr_obj[sub_key];
                        if(dr_obj[sub_key] > val){
                            subResult.push(dr_obj);
                            /*if(baseRecur === 'OR') {
                                database.splice(dr_obj_i, 1);
                            }*/
                        }
                    });
                }
            }
            else if (whereKey === 'EQ') {
                var keysx = Object.keys(subQuery1);
                var val_key = keysx[0];
                var val: any = subQuery1[val_key];
                for(var dr_obj_i = 0; dr_obj_i < database.length; dr_obj_i++){
                    var dr_obj = database[dr_obj_i];
                    var subqK = Object.keys(subQuery1);
                    subqK.map(function (sub_key: any) {
                        var drx = dr_obj[sub_key];
                        if(dr_obj[sub_key] === val){
                            subResult.push(dr_obj);
                            /*if(baseRecur === 'OR') {
                                database.splice(dr_obj_i, 1);
                            }*/
                        }
                    });
                }
            }
            else if (whereKey === 'IS') {
                var keysx = Object.keys(subQuery1);
                var val_key = keysx[0];
                var valx: string = subQuery1[val_key];
                for(var dr_obj_i = 0; dr_obj_i < database.length; dr_obj_i++){
                    var dr_obj = database[dr_obj_i];
                    var obj_keys = Object.keys(dr_obj);
                    var subqK = Object.keys(subQuery1);
                    subqK.map(function (sub_key: any) {
                        if(obj_keys.includes(sub_key)) {
                            var drx: string = dr_obj[sub_key];
                            if (valx.startsWith('*')) {
                                if(valx.length === 2 && valx.endsWith('*')){
                                    if(drx.includes("")){
                                        subResult.push(dr_obj);
                                        /*if(baseRecur === 'OR') {
                                database.splice(dr_obj_i, 1);
                            }*/
                                    }
                                }
                                else if(valx.length === 1){
                                    if(drx.includes("")){
                                        subResult.push(dr_obj);
                                        /*if(baseRecur === 'OR') {
                                database.splice(dr_obj_i, 1);
                            }*/
                                    }
                                }
                                else if (valx.substring(1).endsWith('*')) {
                                    if (drx.includes(valx.substring(1, valx.substring(1).indexOf('*') + 1))) {
                                        subResult.push(dr_obj);
                                        /*if(baseRecur === 'OR') {
                                database.splice(dr_obj_i, 1);
                            }*/
                                    }
                                }
                                else {
                                    if (drx.endsWith(valx.substring(1))) {
                                        subResult.push(dr_obj);
                                        /*if(baseRecur === 'OR') {
                                database.splice(dr_obj_i, 1);
                            }*/
                                    }
                                }
                            }
                            else {
                                if (valx.endsWith('*')) {
                                    if (drx.startsWith(valx.substring(0, valx.indexOf('*')))) {
                                        subResult.push(dr_obj);
                                        /*if(baseRecur === 'OR') {
                                database.splice(dr_obj_i, 1);
                            }*/
                                    }
                                }
                                else if(valx.length === 0){
                                    if(drx.includes("")){
                                        subResult.push(dr_obj);
                                        /*if(baseRecur === 'OR') {
                                database.splice(dr_obj_i, 1);
                            }*/
                                    }
                                }
                                else {
                                    if (drx === valx) {
                                        subResult.push(dr_obj);
                                        /*if(baseRecur === 'OR') {
                                database.splice(dr_obj_i, 1);
                            }*/
                                    }
                                }
                            }
                        }
                    });
                }
            }
            else if (whereKey === 'NOT') {
                if(subResult.length === 0){
                    var sub: Array<any> = [];
                    sub = that.recurseLogic(subQuery1, database, 'NOT');
                    subResult = database.filter(function (element: any) {
                        var truth = false;
                        for(var sub_x of sub){
                            if(element === sub_x){
                                truth = true;
                            }
                        }
                        return !truth;
                    })
                }
            }
        });
        return subResult;
    }

    private optTraverse(subQuery: any, subResult: Array<any>){
        var that = this;
        var keys = Object.keys(subQuery);
        var result: Array<any> = [];
        var resultx: Array<any> = [];
        keys.map(function (key: any) {
            var obj = subQuery[key];
            if(key === "COLUMNS"){
                if(Array.isArray(obj)){
                    for(var subres_i of subResult){
                        var rrow_json:any = {};
                        for(var col of obj){
                            rrow_json[col] = subres_i[col];
                        }
                        result.push(rrow_json);
                    }
                }
            }
            else if(key === "ORDER"){
                //var ord = subQuery[key];
                if(typeof obj === 'string') {
                    result.sort(function (a, b) {
                        if (a[obj] < b[obj])
                            return -1;
                        if (a[obj] > b[obj])
                            return 1;
                        return 0;
                    });
                }
                else{
                    var sortKeys = obj['keys'];
                    if(obj['dir'] === 'UP'){
                        for(var sortkey of sortKeys){
                            result.sort(function (a, b) {
                                if (a[sortkey] < b[sortkey])
                                    return -1;
                                if (a[sortkey] > b[sortkey])
                                    return 1;
                                return 0;
                            });
                        }
                    }
                    else if(obj['dir'] === 'DOWN'){
                        for(var sortkey of sortKeys){
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
    }

    x: Array<string> = [];

    public processP5(node: any){
        var keys = Object.keys(node);
        if(keys.includes('childNodes')) {
            var childnodes = node['childNodes']
            for(var node_x of childnodes){
                this.processP5(node_x);
            }
        }
        if(keys.includes('nodeName')) {
            if(node['nodeName'] === 'div') {
                if (keys.includes('attrs')) {
                    var attributes = node['attrs'];
                    for (var attribute_x of attributes) {
                        if (attribute_x['name'] === 'class') {
                            if(attribute_x['value'] === 'view-content') {
                                if(keys.includes('childNodes')) {
                                    var div_childnodes = node['childNodes'];
                                    var tableNode: any = {};
                                    var tbodyNode: any = {};
                                    for(var childNode_i of div_childnodes){
                                        if(Object.keys(childNode_i).includes('nodeName')){
                                            if(childNode_i['nodeName'] === 'table'){
                                                tableNode = childNode_i;
                                                break;
                                            }
                                        }
                                    }
                                    var table_keys = Object.keys(tableNode);
                                    if(table_keys.length > 0){
                                        if(table_keys.includes('childNodes')){
                                            var tableChildNodes = tableNode['childNodes'];
                                            for(var tableChildNodeX of tableChildNodes){
                                                var tableChildNodeXKeys = Object.keys(tableChildNodeX);
                                                if(tableChildNodeXKeys.includes('nodeName')){
                                                    if(tableChildNodeX['nodeName'] === 'tbody'){
                                                        tbodyNode = tableChildNodeX;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    var tbodyKeys = Object.keys(tbodyNode);
                                    if(tbodyKeys.length > 0){
                                        if(tbodyKeys.includes('childNodes')){
                                            var tbodyChildNodes = tbodyNode['childNodes'];
                                            for(var tbodyChildNodeX of tbodyChildNodes){
                                                var tbodyChildKeys = Object.keys(tbodyChildNodeX);
                                                if(tbodyChildKeys.includes('nodeName')){
                                                    var tbChNodeName = tbodyChildNodeX['nodeName'];
                                                    if(tbChNodeName === 'tr'){
                                                        var trNode = tbodyChildNodeX;
                                                        var trNodeKeys = Object.keys(trNode);
                                                        if(trNodeKeys.includes('childNodes')){
                                                            var trChildren = trNode['childNodes'];
                                                            for(var trChildNodeX of trChildren){
                                                                var trChildKeys = Object.keys(trChildNodeX);
                                                                if(trChildKeys.includes('nodeName')){
                                                                    if(trChildNodeX['nodeName'] === 'td'){
                                                                        var tdNode = trChildNodeX;
                                                                        var tdKeys = Object.keys(tdNode);
                                                                        if(tdKeys.includes('childNodes')){
                                                                            var tdChildren = tdNode['childNodes'];
                                                                            for(var tdChild of tdChildren){
                                                                                var tdChildKeys = Object.keys(tdChild);
                                                                                if(tdChildKeys.includes('nodeName')){
                                                                                    if(tdChild['nodeName'] === 'a'){
                                                                                        if(tdChildKeys.includes('attrs')){
                                                                                            var tdAttrs = tdChild['attrs'];
                                                                                            for(var tdAttrx of tdAttrs){
                                                                                                if(tdAttrx['name'] === 'href'){
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
    }

    public augmentPaths(paths: Array<string>, root: string){
        var pathsAugmented: Array<string> = [];
        for(var path of paths){
            pathsAugmented.push(path.replace("./", root));
        }
        return pathsAugmented;
    }

    public existsInZip(zip: JSZip, path: string){
        var truth:boolean = false;
        Object.keys(zip.files).map(function (key: any) {
            var keyx: string = key;
            if(keyx.endsWith(path)){
                truth = true;
            }
        })
        return truth;
    }

    private concatenateArrays(a1: Array<any>, a2:Array<any>): Array<any>{
        var that = this;
        var x = a1;
        for(var x_x of a2){
            if(!this.alreadyContains(x, x_x)) {
                x.push(x_x);
            }
        }
        return x;
    }

    private checkObjectEquality(o: any, thing: any){
        var that = this;
        var truth = true;
        var truthArr:Array<boolean> = [];
        var uniqueKey:any = {};
        if(that.datasetID.includes('courses')){
            uniqueKey = 'courses_uuid';
        }
        else if(that.datasetID.includes('rooms')){
            uniqueKey = 'rooms_name';
        }
        if(!(thing[uniqueKey] === o[uniqueKey])){
            truthArr.push(false);
        }
        else{
            truthArr.push(true);
        }
        if(truthArr.includes(false)){
            truth = false;
        }
        return truth;
    }

    private alreadyContains(arr: Array<any>, obj: any){
        var that = this;
        var alreadyContainsx = false;
        for(var i = 0; i < arr.length; i++){
            if(that.checkObjectEquality(arr[i], obj)){
                alreadyContainsx = true;
                break;
            }
        }
        return alreadyContainsx;
    }
}
