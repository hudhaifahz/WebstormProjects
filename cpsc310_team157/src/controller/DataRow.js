"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataRow = (function () {
    function DataRow() {
        this.courses_id = "";
        this.courses_title = "";
        this.courses_uuid = "";
        this.courses_instructor = "";
        this.courses_audit = 0;
        this.courses_pass = 0;
        this.courses_fail = 0;
        this.courses_avg = 0;
        this.courses_dept = "";
        this.courses_year = 0;
    }
    return DataRow;
}());
exports.DataRow = DataRow;
var Room = (function () {
    function Room() {
        this.rooms_fullname = "";
        this.rooms_shortname = "";
        this.rooms_number = "";
        this.rooms_name = "";
        this.rooms_address = "";
        this.rooms_lat = 0;
        this.rooms_lon = 0;
        this.rooms_seats = 0;
        this.rooms_type = "";
        this.rooms_furniture = "";
        this.rooms_href = "";
    }
    return Room;
}());
exports.Room = Room;
//# sourceMappingURL=DataRow.js.map