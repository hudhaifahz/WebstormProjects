import {Room} from "./DataRow";
import * as parse5 from 'parse5';
var http = require('http');

export class BuildingInfoParser{
    private bInfo: Room;
    private bFields: Array<any> = [];
    private x:any;
    private content: string = "";
    private rooms: Array<Room> = [];
    private tbody: any = {}
    private roomDetsArr: Array<RoomDets> = [];
    private shortname: string;
    private lat: number;
    private lon: number;
    private promiseArray: Array<Promise<any>> = [];
    constructor(){
        this.bInfo = new Room;
    }

    public parseDat(htmArr: Array<any>){
        var that = this;
        return new Promise(function(fulfill, reject){
            var bInfo: Array<any> = [];
            var bfields: any;
            for(var htm_x of htmArr) {
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
                if(!(tbody==null)) {
                    var pn = tbody['parentNode'];
                    if(!(that.roomDetsArr.length === 0)){
                        that.roomDetsArr = [];
                        that.processTbody(pn);
                    }
                    else {
                        that.processTbody(pn);
                    }
                    var roomDet_x = new RoomDets();
                    for (var roomDet_i in that.roomDetsArr) {
                        roomDet_x = that.roomDetsArr[roomDet_i];
                        if(rShortName === 'MCML'){
                           //console.log('MCML');
                        }
                        that.bInfo.rooms_shortname = rShortName;
                        that.bInfo.rooms_address = rAddress;
                        that.bInfo.rooms_fullname = rFullName;
                        that.bInfo.rooms_number = roomDet_x.room_number;
                        that.bInfo.rooms_furniture = roomDet_x.room_furn;
                        that.bInfo.rooms_href = roomDet_x.room_link;
                        that.bInfo.rooms_seats = roomDet_x.room_cap;
                        that.bInfo.rooms_type = roomDet_x.room_type;
                        that.bInfo.rooms_name = that.bInfo.rooms_shortname+"_"+that.bInfo.rooms_number;
                        var latlonp = that.getLatLon(rAddress, '157');
                        that.promiseArray.push(latlonp);
                        that.rooms.push(that.bInfo);
                        that.bInfo = new Room;
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
                .then(function (results: any) {
                    for(var i = 0; i<that.rooms.length; i++){
                        var result = results[i];
                        if(Object.keys(result).includes('lat')) {
                            that.rooms[i].rooms_lat = result['lat'];
                            that.rooms[i].rooms_lon = result['lon'];
                           //console.log(result + "\n");
                        }
                    }
                    fulfill(that.rooms);
                })
                .catch(function(err: any){
                   //console.log(err);
                    reject(err);
                });
        })


    }

    private getBuilingInfo(node: any){
        var keys = Object.keys(node);
        if(keys.includes('childNodes')) {
            var childnodes = node['childNodes']
            for(var node_x of childnodes){
                this.getBuilingInfo(node_x);
            }
        }
        if(keys.includes('attrs')){
            var attributes = node['attrs'];
            for(var attribute_x of attributes){
                if(attribute_x['name'] === 'id'){
                    if(attribute_x['value'] === 'buildings-wrapper'){
                        this.x = node;
                    }
                }
            }
        }
        return this.x;
    }

    private getBuildingFields(node:any){
        var keys = Object.keys(node);
        if(keys.includes('childNodes')) {
            var childnodes = node['childNodes']
            for(var node_x of childnodes){
                this.getBuildingFields(node_x);
            }
        }
        if(keys.includes('attrs')){
            var attributes = node['attrs'];
            for(var attribute_x of attributes){
                if(attribute_x['name'] === 'class'){
                    if(attribute_x['value'] === 'building-field'){
                        this.bFields.push(node);
                    }
                }
            }
        }
        return this.bFields;
    }

    private getFieldContent(node: any){
        var keys = Object.keys(node);
        var content: string;
        if(keys.includes('childNodes')) {
            var childnodes = node['childNodes']
            for(var node_x of childnodes){
                this.getFieldContent(node_x);
            }
        }
        if(keys.includes('nodeName')){
            if(keys.includes('value') && (node['nodeName'] === '#text')){
                content = node['value']
                this.content += content;
            }
        }
        return this.content;
    }

    private getBuildingNameHelper(node:any){
        var keys = Object.keys(node);
        if(keys.includes('childNodes')) {
            var childnodes = node['childNodes']
            for(var node_x of childnodes){
                this.getBuildingNameHelper(node_x);
            }
        }
        if(keys.includes('attrs')){
            var attributes = node['attrs'];
            for(var attribute_x of attributes){
                if(attribute_x['name'] === 'class'){
                    if(attribute_x['value'] === 'field-content'){
                        this.bFields.push(node);
                    }
                }
            }
        }
        return this.bFields;
    }

    private retrieveTbody(node:any){
        var keys = Object.keys(node);
        if(keys.includes('childNodes')) {
            var childnodes = node['childNodes']
            for(var node_x of childnodes){
                this.retrieveTbody(node_x);
            }
        }
        if(keys.includes('nodeName')){
            if(node['nodeName'] === 'tbody') {
                this.tbody = node['childNodes'];
            }
        }
        return this.tbody[1];
    }

    private getShortName(node:any){
        var keys = Object.keys(node);
        if(keys.includes('childNodes')) {
            var childnodes = node['childNodes']
            for(var node_x of childnodes){
                this.getShortName(node_x);
            }
        }
        if(keys.includes('nodeName')){
            if(node['nodeName'] == 'link'){
                if(keys.includes('attrs')){
                    var attributes = node['attrs'];
                    for(var attribute_x of attributes){
                        if(attribute_x['name'] === 'rel'){
                            if(attribute_x['value'] === 'canonical'){
                                for(var attr_i of attributes){
                                    if(attr_i['name'] === 'href'){
                                        this.shortname = attr_i['value'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private processTbody(tbody: any){
        var keys = Object.keys(tbody);
        if(keys.includes('childNodes')) {
            var childnodes = tbody['childNodes']
            for(var node_x of childnodes){
                this.processTbody(node_x);
            }
        }
        if(keys.includes('nodeName') && tbody['nodeName'] === 'tr') {
            if (keys.includes('attrs')) {
                var attributes = tbody['attrs'];
                for (var attr_x of attributes) {
                    if (attr_x['name'] === 'class') {
                        if(keys.includes('childNodes')) {
                            var childNodes = tbody['childNodes'];
                            var rd: RoomDets = new RoomDets;
                            for(var childNode_x of childNodes) {
                                var keys_sub = Object.keys(childNode_x);
                                if(keys_sub.includes('attrs')) {
                                    var attributesSub = childNode_x['attrs'];
                                    for (var attr_i of attributesSub) {
                                        if (attr_i['name'] === 'class') {
                                            if(attr_i['value'] === 'views-field views-field-field-room-number'){
                                                var chnArr = childNode_x['childNodes'];
                                                for(var chnx of chnArr){
                                                    var keys_chn = Object.keys(chnx);
                                                    if(keys_chn.includes('attrs')){
                                                        var attchn = chnx['attrs'];
                                                        for(var attchn_x of attchn){
                                                            if(attchn_x['name'] === 'href'){
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
    }

    public getLatLon(address: string, teamNo: string): Promise<any>{
        var that = this
        var urliRepl = '%20';
        var address_urli = address.replace(/ /g, urliRepl);
        var urli = 'http://skaha.cs.ubc.ca:11316/api/v1/team'+teamNo+'/'+address_urli;
        return new Promise(function (fulfill, reject) {
            http.get(urli, (response: any) => {
                if (response.statusCode === 200 && /^application\/json/.test(response.headers['content-type'])) {
                    response.setEncoding('utf8');
                    let rawData = '';

                    response.on('data', (chunk:any) => rawData += chunk);
                    response.on('error', (e:any) => reject(e));
                    response.on('end', () => {
                        try {
                            fulfill(JSON.parse(rawData))
                        } catch (e) {
                            reject(e)
                        }
                    });
                } else {
                    const error = new Error(`Request failed: Status Code: ${response.statusCode}`);
                    response.resume();
                    reject(error)
                }
            }).on('error', (e: any) => reject(e))
        });
    }
}

class RoomDets{
    room_number: string;
    room_cap: number;
    room_furn: string;
    room_type: string;
    room_link: string;
    constructor(){
        this.room_cap = 0;
        this.room_furn = "";
        this.room_link = "";
        this.room_number = "";
        this.room_type = "";
    }
}
