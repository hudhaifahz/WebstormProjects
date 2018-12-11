import {DataRow} from "./DataRow";

export class HashIt{
    id: string;
    dr_array: Array<any>;

    constructor(id: string){
        this.id = id;
    }

    public isNoData(){
        if(this.dr_array.length === 0){
            return true;
        }
        return false;
    }

    public jsonInstantiate(jsonArray: Array<any>) {
        var that = this;
        that.dr_array = []
        for(var json_i of jsonArray) {
            var jsonArr_ij = json_i["result"];
            for (var json_x of jsonArr_ij) {
                var keys_ij = Object.keys(json_x);
                var dr = new DataRow();
                keys_ij.map(function (key: any) {
                    if (key === "Title") {
                        dr.courses_title = json_x[key];
                    }
                    else if (key === "id") {
                        dr.courses_uuid = json_x[key].toString();
                    }
                    else if (key === "Professor") {
                        dr.courses_instructor = json_x[key];
                    }
                    else if (key === "Audit") {
                        dr.courses_audit = json_x[key];
                    }
                    else if (key === "Course") {
                        dr.courses_id = json_x[key];
                    }
                    else if (key === "Pass") {
                        dr.courses_pass = json_x[key];
                    }
                    else if (key === "Fail") {
                        dr.courses_fail = json_x[key];
                    }
                    else if (key === "Avg") {
                        dr.courses_avg = json_x[key];
                    }
                    else if (key === "Subject") {
                        dr.courses_dept = json_x[key];
                    }
                    else if (key === "Year"){
                        if(json_x['Section'] === 'overall'){
                            dr.courses_year = 1900;
                        }
                        else {
                            var str: string = json_x[key];
                            dr.courses_year = parseInt(str);
                        }
                    }
                });
                that.dr_array.push(dr);
            }
            dr = null;
        }
    }
}