"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
exports.cachePath = __dirname + '/data.json';
exports.keyRegex = '^([A-Za-z0-9]+)_[A-Za-z0-9]+$';
exports.geoUrlPrefix = 'http://skaha.cs.ubc.ca:11316/api/v1/team37/';
var http = require("http");
var Rooms_1 = require("./Rooms");
var util_2 = require("util");
var util_3 = require("util");
exports.dataSetDefinitions = {
    rooms: {
        processZip: Rooms_1.parseRoomsZip,
        keys: {
            rooms_fullname: 'string',
            rooms_shortname: 'string',
            rooms_name: 'string',
            rooms_number: 'string',
            rooms_address: 'string',
            rooms_lat: 'number',
            rooms_lon: 'number',
            rooms_seats: 'number',
            rooms_type: 'string',
            rooms_furniture: 'string',
            rooms_href: 'string'
        }
    },
    courses: {
        processZip: parseCoursesZip,
        keys: {
            courses_dept: 'string',
            courses_id: 'string',
            courses_avg: 'number',
            courses_instructor: 'string',
            courses_title: 'string',
            courses_pass: 'number',
            courses_fail: 'number',
            courses_audit: 'number',
            courses_uuid: 'string',
            courses_year: 'number'
        }
    }
};
function requestPromise(url) {
    return new Promise(function (resolve, reject) {
        http.get(url, function (response) {
            if (response.statusCode === 200 && /^application\/json/.test(response.headers['content-type'])) {
                response.setEncoding('utf8');
                var rawData_1 = '';
                response.on('data', function (chunk) { return rawData_1 += chunk; });
                response.on('error', function (e) { return reject(e); });
                response.on('end', function () {
                    try {
                        resolve(JSON.parse(rawData_1));
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            }
            else {
                var error = new Error("Request failed: Status Code: " + response.statusCode);
                response.resume();
                reject(error);
            }
        }).on('error', function (e) { return reject(e); });
    });
}
exports.requestPromise = requestPromise;
function getElementsByAttrs(node, attributes) {
    var matchingElements = [];
    var element = node;
    if (element.attrs !== undefined) {
        if (hasMatchingAttributes(element, attributes)) {
            return [element];
        }
    }
    if (node.childNodes !== undefined) {
        for (var _i = 0, _a = node.childNodes; _i < _a.length; _i++) {
            var child = _a[_i];
            var matchingChildElements = getElementsByAttrs(child, attributes);
            matchingElements.push.apply(matchingElements, matchingChildElements);
        }
    }
    return matchingElements;
}
exports.getElementsByAttrs = getElementsByAttrs;
function isUnknownDataset(id) {
    return !(id in exports.dataSetDefinitions);
}
exports.isUnknownDataset = isUnknownDataset;
function isObject(item) {
    return item !== null && typeof item === 'object' && item.constructor === Object;
}
exports.isObject = isObject;
function isEmptyObject(item) {
    if (!isObject(item))
        return false;
    return Object.keys(item).length === 0;
}
exports.isEmptyObject = isEmptyObject;
function flattenData(data) {
    return data.reduce(function (allItems, item) {
        allItems.push.apply(allItems, item);
        return allItems;
    }, []);
}
exports.flattenData = flattenData;
function filterObjectProperties(object, keys) {
    var filteredObject = {};
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        filteredObject[key] = object[key];
    }
    return filteredObject;
}
exports.filterObjectProperties = filterObjectProperties;
function parseCoursesZip(zip) {
    var files = [];
    zip.forEach(function (path, file) {
        if (file.dir == true) {
            return;
        }
        files.push(file.async('string').then(function (data) {
            return JSON.parse(data).result.map(createCoursesEntry).filter(function (item) { return item !== null; });
        }));
    });
    return Promise.all(files).then(flattenData);
}
function createCoursesEntry(entry) {
    if (!util_1.isString(entry.Subject))
        return null;
    if (!isStringOrNumber(entry.Course))
        return null;
    if (!isAcceptableNumber(entry.Avg))
        return null;
    if (!util_1.isString(entry.Professor))
        return null;
    if (!util_1.isString(entry.Title))
        return null;
    if (!isAcceptableNumber(entry.Pass))
        return null;
    if (!isAcceptableNumber(entry.Fail))
        return null;
    if (!isAcceptableNumber(entry.Audit))
        return null;
    if (!isStringOrNumber(entry.id))
        return null;
    if (!isAcceptableNumber(entry.Year) && (!util_3.isUndefined(entry.Year) || entry.Section !== 'overall'))
        return null;
    return {
        courses_dept: String(entry.Subject),
        courses_id: String(entry.Course),
        courses_avg: Number(entry.Avg),
        courses_instructor: String(entry.Professor),
        courses_title: String(entry.Title),
        courses_pass: Number(entry.Pass),
        courses_fail: Number(entry.Fail),
        courses_audit: Number(entry.Audit),
        courses_uuid: String(entry.id),
        courses_year: entry.Section === "overall" ? 1900 : Number(entry.Year)
    };
}
function isAcceptableNumber(item) {
    if (!isStringOrNumber(item))
        return false;
    return !isNaN(Number(item));
}
function isStringOrNumber(item) {
    return util_1.isString(item) || util_2.isNumber(item);
}
function hasMatchingAttributes(element, attributes) {
    return attributes.every(function (attribute) {
        return element.attrs.some(function (elementAttribute) { return isMatchingAttribute(attribute, elementAttribute); });
    });
}
function isMatchingAttribute(attribute, elementAttribute) {
    return attribute.name === elementAttribute.name && elementAttribute.value.search(attribute.value) != -1;
}
//# sourceMappingURL=IInsightFacade.js.map