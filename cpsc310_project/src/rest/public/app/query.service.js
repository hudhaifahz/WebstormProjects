"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Jnani on 3/17/17.
 */
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
let QueryService = class QueryService {
    constructor(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.queryEndpoint = "query";
    }
    compose(filters, filterJunction, columns, order) {
        let innerFilter = filters.filter((filter) => {
            return filter.value.length !== 0;
        }).map((filter) => {
            let value = filter.value;
            if (filter.type === "number") {
                value = parseFloat(filter.value);
                if (isNaN(value)) {
                    throw "Invalid data type for " + filter.name;
                }
            }
            if (filter.template) {
                return filter.template(filter);
            }
            return {
                [filter.comparator]: {
                    [filter.name]: value
                }
            };
        });
        let innerWhere = innerFilter.length === 0 ? {} : {
            [filterJunction]: innerFilter
        };
        return {
            "WHERE": innerWhere,
            "OPTIONS": {
                "COLUMNS": columns.filter((item) => {
                    return item.value;
                }).map((item) => {
                    return item.name;
                }),
                "ORDER": {
                    "dir": order.dir,
                    "keys": order.keys.filter((item) => {
                        return item.value;
                    }).map((item) => {
                        return item.name;
                    })
                },
                "FORM": "TABLE"
            }
        };
    }
    search(query) {
        return this.http
            .post(this.queryEndpoint, query, this.headers)
            .toPromise()
            .then(response => {
            return response.json();
        })
            .catch(this.handleError);
    }
    ;
    handleError(error) {
        return Promise.reject(error.message || error);
    }
};
QueryService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" && _a || Object])
], QueryService);
exports.QueryService = QueryService;
var _a;
//# sourceMappingURL=query.service.js.map