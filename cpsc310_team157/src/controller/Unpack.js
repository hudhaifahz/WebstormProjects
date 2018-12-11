"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var JSZip = require("jszip");
var Unpack = (function () {
    function Unpack() {
    }
    Unpack.prototype.getFromZip = function (path) {
        var datArray = [];
        var zip = new JSZip();
        var x = "";
        var fileArr = [];
        var file_contentx;
        var zipContent = fs.readFileSync(path);
        return zipContent;
    };
    return Unpack;
}());
exports.Unpack = Unpack;
//# sourceMappingURL=Unpack.js.map