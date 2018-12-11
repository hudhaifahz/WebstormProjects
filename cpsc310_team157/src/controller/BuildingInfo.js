"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataRow_1 = require("./DataRow");
var http = require('http');
var BuildingInfoParser = (function () {
    function BuildingInfoParser() {
        this.bFields = [];
        this.content = "";
        this.rooms = [];
        this.tbody = {};
        this.roomDetsArr = [];
        this.promiseArray = [];
        this.bInfo = new DataRow_1.Room;
    }
    BuildingInfoParser.prototype.parseDat = function (htmArr) {
        var that = this;
        return new Promise(function (fulfill, reject) {
            var bInfo = [];
            var bfields;
            for (var _i = 0, htmArr_1 = htmArr; _i < htmArr_1.length; _i++) {
                var htm_x = htmArr_1[_i];
                that.roomDetsArr = [];
                bInfo = that.getBuilingInfo(htm_x);
                bfields = that.getBuildingFields(bInfo);
                that.bFields = [];
                var node_sub = bfields[0];
                var rAddress = that.getFieldContent(node_sub);
                that.content = "";
                bfields = that.getBuildingNameHelper(bInfo);
                that.bFields = [];
                node_sub = bfields[0];
                var rFullName = that.getFieldContent(node_sub);
                that.content = "";
                that.getShortName(htm_x);
                var rShortName = that.shortname;
                that.shortname = "";
                var tbody = that.retrieveTbody(htm_x);
                that.tbody = new Object();
                if (!(tbody == null)) {
                    var pn = tbody['parentNode'];
                    if (!(that.roomDetsArr.length === 0)) {
                        that.roomDetsArr = [];
                        that.processTbody(pn);
                    }
                    else {
                        that.processTbody(pn);
                    }
                    var roomDet_x = new RoomDets();
                    for (var roomDet_i in that.roomDetsArr) {
                        roomDet_x = that.roomDetsArr[roomDet_i];
                        if (rShortName === 'MCML') {
                        }
                        that.bInfo.rooms_shortname = rShortName;
                        that.bInfo.rooms_address = rAddress;
                        that.bInfo.rooms_fullname = rFullName;
                        that.bInfo.rooms_number = roomDet_x.room_number;
                        that.bInfo.rooms_furniture = roomDet_x.room_furn;
                        that.bInfo.rooms_href = roomDet_x.room_link;
                        that.bInfo.rooms_seats = roomDet_x.room_cap;
                        that.bInfo.rooms_type = roomDet_x.room_type;
                        that.bInfo.rooms_name = that.bInfo.rooms_shortname + "_" + that.bInfo.rooms_number;
                        var latlonp = that.getLatLon(rAddress, '157');
                        that.promiseArray.push(latlonp);
                        that.rooms.push(that.bInfo);
                        that.bInfo = new DataRow_1.Room;
                        roomDet_x = new RoomDets();
                    }
                    that.roomDetsArr = [];
                }
                node_sub = new Object();
                bInfo = [];
                bfields = new Object();
                rAddress = "";
                rFullName = "";
                rShortName = "";
                tbody = new Object();
            }
            Promise.all(that.promiseArray)
                .then(function (results) {
                for (var i = 0; i < that.rooms.length; i++) {
                    var result = results[i];
                    if (Object.keys(result).includes('lat')) {
                        that.rooms[i].rooms_lat = result['lat'];
                        that.rooms[i].rooms_lon = result['lon'];
                    }
                }
                fulfill(that.rooms);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    BuildingInfoParser.prototype.getBuilingInfo = function (node) {
        var keys = Object.keys(node);
        if (keys.includes('childNodes')) {
            var childnodes = node['childNodes'];
            for (var _i = 0, childnodes_1 = childnodes; _i < childnodes_1.length; _i++) {
                var node_x = childnodes_1[_i];
                this.getBuilingInfo(node_x);
            }
        }
        if (keys.includes('attrs')) {
            var attributes = node['attrs'];
            for (var _a = 0, attributes_1 = attributes; _a < attributes_1.length; _a++) {
                var attribute_x = attributes_1[_a];
                if (attribute_x['name'] === 'id') {
                    if (attribute_x['value'] === 'buildings-wrapper') {
                        this.x = node;
                    }
                }
            }
        }
        return this.x;
    };
    BuildingInfoParser.prototype.getBuildingFields = function (node) {
        var keys = Object.keys(node);
        if (keys.includes('childNodes')) {
            var childnodes = node['childNodes'];
            for (var _i = 0, childnodes_2 = childnodes; _i < childnodes_2.length; _i++) {
                var node_x = childnodes_2[_i];
                this.getBuildingFields(node_x);
            }
        }
        if (keys.includes('attrs')) {
            var attributes = node['attrs'];
            for (var _a = 0, attributes_2 = attributes; _a < attributes_2.length; _a++) {
                var attribute_x = attributes_2[_a];
                if (attribute_x['name'] === 'class') {
                    if (attribute_x['value'] === 'building-field') {
                        this.bFields.push(node);
                    }
                }
            }
        }
        return this.bFields;
    };
    BuildingInfoParser.prototype.getFieldContent = function (node) {
        var keys = Object.keys(node);
        var content;
        if (keys.includes('childNodes')) {
            var childnodes = node['childNodes'];
            for (var _i = 0, childnodes_3 = childnodes; _i < childnodes_3.length; _i++) {
                var node_x = childnodes_3[_i];
                this.getFieldContent(node_x);
            }
        }
        if (keys.includes('nodeName')) {
            if (keys.includes('value') && (node['nodeName'] === '#text')) {
                content = node['value'];
                this.content += content;
            }
        }
        return this.content;
    };
    BuildingInfoParser.prototype.getBuildingNameHelper = function (node) {
        var keys = Object.keys(node);
        if (keys.includes('childNodes')) {
            var childnodes = node['childNodes'];
            for (var _i = 0, childnodes_4 = childnodes; _i < childnodes_4.length; _i++) {
                var node_x = childnodes_4[_i];
                this.getBuildingNameHelper(node_x);
            }
        }
        if (keys.includes('attrs')) {
            var attributes = node['attrs'];
            for (var _a = 0, attributes_3 = attributes; _a < attributes_3.length; _a++) {
                var attribute_x = attributes_3[_a];
                if (attribute_x['name'] === 'class') {
                    if (attribute_x['value'] === 'field-content') {
                        this.bFields.push(node);
                    }
                }
            }
        }
        return this.bFields;
    };
    BuildingInfoParser.prototype.retrieveTbody = function (node) {
        var keys = Object.keys(node);
        if (keys.includes('childNodes')) {
            var childnodes = node['childNodes'];
            for (var _i = 0, childnodes_5 = childnodes; _i < childnodes_5.length; _i++) {
                var node_x = childnodes_5[_i];
                this.retrieveTbody(node_x);
            }
        }
        if (keys.includes('nodeName')) {
            if (node['nodeName'] === 'tbody') {
                this.tbody = node['childNodes'];
            }
        }
        return this.tbody[1];
    };
    BuildingInfoParser.prototype.getShortName = function (node) {
        var keys = Object.keys(node);
        if (keys.includes('childNodes')) {
            var childnodes = node['childNodes'];
            for (var _i = 0, childnodes_6 = childnodes; _i < childnodes_6.length; _i++) {
                var node_x = childnodes_6[_i];
                this.getShortName(node_x);
            }
        }
        if (keys.includes('nodeName')) {
            if (node['nodeName'] == 'link') {
                if (keys.includes('attrs')) {
                    var attributes = node['attrs'];
                    for (var _a = 0, attributes_4 = attributes; _a < attributes_4.length; _a++) {
                        var attribute_x = attributes_4[_a];
                        if (attribute_x['name'] === 'rel') {
                            if (attribute_x['value'] === 'canonical') {
                                for (var _b = 0, attributes_5 = attributes; _b < attributes_5.length; _b++) {
                                    var attr_i = attributes_5[_b];
                                    if (attr_i['name'] === 'href') {
                                        this.shortname = attr_i['value'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    BuildingInfoParser.prototype.processTbody = function (tbody) {
        var keys = Object.keys(tbody);
        if (keys.includes('childNodes')) {
            var childnodes = tbody['childNodes'];
            for (var _i = 0, childnodes_7 = childnodes; _i < childnodes_7.length; _i++) {
                var node_x = childnodes_7[_i];
                this.processTbody(node_x);
            }
        }
        if (keys.includes('nodeName') && tbody['nodeName'] === 'tr') {
            if (keys.includes('attrs')) {
                var attributes = tbody['attrs'];
                for (var _a = 0, attributes_6 = attributes; _a < attributes_6.length; _a++) {
                    var attr_x = attributes_6[_a];
                    if (attr_x['name'] === 'class') {
                        if (keys.includes('childNodes')) {
                            var childNodes = tbody['childNodes'];
                            var rd = new RoomDets;
                            for (var _b = 0, childNodes_1 = childNodes; _b < childNodes_1.length; _b++) {
                                var childNode_x = childNodes_1[_b];
                                var keys_sub = Object.keys(childNode_x);
                                if (keys_sub.includes('attrs')) {
                                    var attributesSub = childNode_x['attrs'];
                                    for (var _c = 0, attributesSub_1 = attributesSub; _c < attributesSub_1.length; _c++) {
                                        var attr_i = attributesSub_1[_c];
                                        if (attr_i['name'] === 'class') {
                                            if (attr_i['value'] === 'views-field views-field-field-room-number') {
                                                var chnArr = childNode_x['childNodes'];
                                                for (var _d = 0, chnArr_1 = chnArr; _d < chnArr_1.length; _d++) {
                                                    var chnx = chnArr_1[_d];
                                                    var keys_chn = Object.keys(chnx);
                                                    if (keys_chn.includes('attrs')) {
                                                        var attchn = chnx['attrs'];
                                                        for (var _e = 0, attchn_1 = attchn; _e < attchn_1.length; _e++) {
                                                            var attchn_x = attchn_1[_e];
                                                            if (attchn_x['name'] === 'href') {
                                                                rd.room_link = attchn_x['value'];
                                                                var cns = chnx['childNodes'];
                                                                var cn = cns[0];
                                                                rd.room_number = cn['value'];
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            if (attr_i['value'] === 'views-field views-field-field-room-capacity') {
                                                if (keys_sub.includes('childNodes')) {
                                                    var cns = childNode_x['childNodes'];
                                                    var cn = cns[0];
                                                    rd.room_cap = Number(cn['value'].replace("\n", ""));
                                                }
                                            }
                                            else if (attr_i['value'] === 'views-field views-field-field-room-furniture') {
                                                if (keys_sub.includes('childNodes')) {
                                                    var cns = childNode_x['childNodes'];
                                                    var cn = cns[0];
                                                    rd.room_furn = cn['value'].replace("\n", "").trim();
                                                }
                                            }
                                            else if (attr_i['value'] === 'views-field views-field-field-room-type') {
                                                if (keys_sub.includes('childNodes')) {
                                                    var cns = childNode_x['childNodes'];
                                                    var cn = cns[0];
                                                    rd.room_type = cn['value'].replace("\n", "").trim();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            this.roomDetsArr.push(rd);
                        }
                    }
                }
            }
        }
    };
    BuildingInfoParser.prototype.getLatLon = function (address, teamNo) {
        var that = this;
        var urliRepl = '%20';
        var address_urli = address.replace(/ /g, urliRepl);
        var urli = 'http://skaha.cs.ubc.ca:11316/api/v1/team' + teamNo + '/' + address_urli;
        return new Promise(function (fulfill, reject) {
            http.get(urli, function (response) {
                if (response.statusCode === 200 && /^application\/json/.test(response.headers['content-type'])) {
                    response.setEncoding('utf8');
                    var rawData_1 = '';
                    response.on('data', function (chunk) { return rawData_1 += chunk; });
                    response.on('error', function (e) { return reject(e); });
                    response.on('end', function () {
                        try {
                            fulfill(JSON.parse(rawData_1));
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
    };
    return BuildingInfoParser;
}());
exports.BuildingInfoParser = BuildingInfoParser;
var RoomDets = (function () {
    function RoomDets() {
        this.room_cap = 0;
        this.room_furn = "";
        this.room_link = "";
        this.room_number = "";
        this.room_type = "";
    }
    return RoomDets;
}());
//# sourceMappingURL=BuildingInfo.js.map