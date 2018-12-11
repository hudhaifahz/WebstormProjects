"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IInsightFacade_1 = require("./IInsightFacade");
var parse5 = require("parse5");
var INDEX_PATH = 'index.htm';
function isGeoResponseError(response) {
    return typeof response.error === 'string';
}
function parseRoomsZip(zip) {
    var roomsIndex = zip.file(INDEX_PATH);
    return roomsIndex.async('string').then(function (index) {
        var buildings = extractBuildings(index);
        var promises = buildings.map(function (buildingLink) { return readAndParseBuilding(zip, buildingLink); });
        return Promise.all(promises).then(IInsightFacade_1.flattenData);
    });
}
exports.parseRoomsZip = parseRoomsZip;
function parseBuilding(building) {
    var buildingDocument = parse5.parse(building);
    var canonicalName = IInsightFacade_1.getElementsByAttrs(buildingDocument, [
        {
            name: "rel",
            value: "canonical"
        }
    ]);
    var rooms = IInsightFacade_1.getElementsByAttrs(buildingDocument, [
        {
            name: "id",
            value: "^buildings-wrapper$"
        }
    ]);
    var roomsInfo = IInsightFacade_1.getElementsByAttrs(rooms[0], [
        {
            name: "class",
            value: "^field-content$"
        }
    ]);
    var rooms_shortname = canonicalName[0].attrs[1].value;
    var rooms_address = roomsInfo[1].childNodes[0].value;
    var rooms_fullname = roomsInfo[0].childNodes[0].value;
    var url = IInsightFacade_1.geoUrlPrefix + encodeURI(rooms_address);
    return Promise.resolve(IInsightFacade_1.requestPromise(url)).then(function (responseObject) {
        var geoResponse = responseObject;
        if (isGeoResponseError(geoResponse)) {
            throw new Error(geoResponse.error);
        }
        return getRoomEntries(buildingDocument).map(function (room) {
            var fields = IInsightFacade_1.getElementsByAttrs(room, [
                {
                    name: "class",
                    value: "^views-field .*"
                }
            ]);
            return createRoomEntry(fields, geoResponse, { rooms_shortname: rooms_shortname, rooms_fullname: rooms_fullname, rooms_address: rooms_address });
        }).filter(function (entry) {
            return Object.keys(entry)
                .map(function (key) { return entry[key]; })
                .every(function (value) { return value !== undefined; });
        });
    });
}
exports.parseBuilding = parseBuilding;
function extractBuildings(index) {
    var document = parse5.parse(index);
    var buildings = IInsightFacade_1.getElementsByAttrs(document, [
        {
            name: "class",
            value: "^(odd|even).*"
        }
    ]);
    return buildings.map(function (child) {
        var linkAttributes = IInsightFacade_1.getElementsByAttrs(child, [
            {
                name: "href",
                value: ".*"
            }
        ]);
        return extractHREF(linkAttributes[0]);
    });
}
function readAndParseBuilding(zip, buildingLink) {
    return zip.file(linkToZipPath(buildingLink)).async('string').then(parseBuilding);
}
function getRoomEntries(buildingDocument) {
    var classrooms = IInsightFacade_1.getElementsByAttrs(buildingDocument, [
        {
            name: "class",
            value: "^view view-buildings-and-classrooms view-id-buildings_and_classrooms .*"
        }
    ]);
    return IInsightFacade_1.getElementsByAttrs(classrooms[0], [
        {
            name: "class",
            value: "^(odd|even).*"
        }
    ]);
}
function createRoomEntry(fields, geoResponse, rooms_info) {
    var rooms_shortname = rooms_info.rooms_shortname, rooms_fullname = rooms_info.rooms_fullname, rooms_address = rooms_info.rooms_address;
    var rooms_number = fields[0].childNodes[1].childNodes[0].value.trim();
    var rooms_seats = parseInt(fields[1].childNodes[0].value.trim());
    var rooms_name = rooms_shortname + "_" + rooms_number;
    var rooms_type = fields[3].childNodes[0].value.trim();
    var rooms_furniture = fields[2].childNodes[0].value.trim();
    var rooms_href = fields[0].childNodes[1].attrs[0].value;
    var rooms_lat = geoResponse.lat;
    var rooms_lon = geoResponse.lon;
    return {
        rooms_fullname: rooms_fullname,
        rooms_shortname: rooms_shortname,
        rooms_name: rooms_name,
        rooms_number: rooms_number,
        rooms_address: rooms_address,
        rooms_lat: rooms_lat,
        rooms_lon: rooms_lon,
        rooms_seats: rooms_seats,
        rooms_type: rooms_type,
        rooms_furniture: rooms_furniture,
        rooms_href: rooms_href
    };
}
function extractHREF(node) {
    for (var _i = 0, _a = node.attrs; _i < _a.length; _i++) {
        var attr = _a[_i];
        if (attr.name === 'href') {
            return attr.value;
        }
    }
    throw new Error("Failed to find href");
}
function linkToZipPath(link) {
    return link.substring(2);
}
//# sourceMappingURL=Rooms.js.map