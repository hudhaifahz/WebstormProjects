let fs = require("fs");
var JSZip = require("jszip");
export class Unpack{

    constructor(){}

    getFromZip(path: string){
        var datArray: Array<JSON> = [];
        var zip = new JSZip();
        var x = "";
        var fileArr: Array<string> = [];
        var file_contentx: Buffer;
        var zipContent = fs.readFileSync(path);
        //console.log(zipContent);
        return zipContent;
    }
}