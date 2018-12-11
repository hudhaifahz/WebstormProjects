import {InsightResponse} from "./IInsightFacade";

export class InsightResponseC implements InsightResponse{
    code: number;
    body: {};
    constructor(code: number, body: string){
        this.code = code;
        this.body = body;
    }
}

