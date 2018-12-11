export class DataRow{
    courses_id: string = "";
    courses_title: string = "";
    courses_uuid: string = "";
    courses_instructor: string = "";
    courses_audit: number = 0;
    courses_pass: number = 0;
    courses_fail: number = 0;
    courses_avg: number = 0;
    courses_dept: string = "";
    courses_year: number = 0;

    constructor(){
    }
}

export class Room {
    rooms_fullname: string = "";
    rooms_shortname: string = "";
    rooms_number: string = "";
    rooms_name: string = "";
    rooms_address: string = "";
    rooms_lat: number = 0;
    rooms_lon: number = 0;
    rooms_seats: number = 0;
    rooms_type: string = "";
    rooms_furniture: string = "";
    rooms_href: string = "";

    constructor(){
    }
}
