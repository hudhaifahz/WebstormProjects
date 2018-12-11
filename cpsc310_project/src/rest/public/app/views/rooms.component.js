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
const core_1 = require("@angular/core");
const query_service_1 = require("../query.service");
const modal_service_1 = require("../modal/modal.service");
const modal_component_1 = require("../modal/modal.component");
const GeoPoint_1 = require("../models/GeoPoint");
let RoomsComponent = class RoomsComponent {
    constructor(queryService, modalService) {
        this.queryService = queryService;
        this.modalService = modalService;
        this.order = {
            dir: "UP",
            keys: [
                {
                    name: "rooms_lat",
                    value: true
                },
                {
                    name: "rooms_lon",
                    value: true
                },
                {
                    name: "rooms_seats",
                    value: true
                },
                {
                    name: "rooms_name",
                    value: false
                }
            ]
        };
        this.columns = [
            {
                name: "rooms_fullname",
                value: true
            },
            {
                name: "rooms_shortname",
                value: true
            },
            {
                name: "rooms_name",
                value: true
            },
            {
                name: "rooms_number",
                value: true
            },
            {
                name: "rooms_address",
                value: true
            },
            {
                name: "rooms_lat",
                value: true
            },
            {
                name: "rooms_lon",
                value: true
            },
            {
                name: "rooms_seats",
                value: true
            },
            {
                name: "rooms_type",
                value: true
            },
            {
                name: "rooms_furniture",
                value: true
            },
            {
                name: "rooms_href",
                value: true
            }
        ];
        this.filterJunction = "AND";
        this.filters = [
            {
                name: "rooms_fullname",
                type: "string",
                comparator: "",
                value: ""
            },
            {
                name: "rooms_shortname",
                type: "string",
                comparator: "",
                value: ""
            },
            {
                name: "rooms_seats",
                type: "number",
                comparator: "",
                value: ""
            },
            {
                name: "rooms_furniture",
                type: "string",
                comparator: "",
                value: ""
            },
            {
                name: "location_distance (lat,lon,dist)",
                type: "location",
                comparator: "",
                value: "",
                template: (self) => {
                    if (self.value.split(',').length !== 3) {
                        throw "Invalid data format for " + self.name;
                    }
                    let lat = parseFloat(self.value.split(',')[0]);
                    let lon = parseFloat(self.value.split(',')[1]);
                    let dist = parseFloat(self.value.split(',')[2]) / 1000;
                    if (isNaN(lat) || isNaN(lon) || isNaN(dist)) {
                        throw "Invalid data type for " + self.name;
                    }
                    let point = new GeoPoint_1.GeoPoint(lat, lon, false);
                    let boundingBox = point.boundingCoordinates(dist, 0, true);
                    let boxQuery = {
                        "AND": [
                            {
                                "GT": {
                                    "rooms_lat": boundingBox[0].degLat
                                }
                            },
                            {
                                "LT": {
                                    "rooms_lat": boundingBox[1].degLat
                                }
                            },
                            {
                                "LT": {
                                    "rooms_lon": boundingBox[1].degLon
                                }
                            },
                            {
                                "GT": {
                                    "rooms_lon": boundingBox[0].degLon
                                }
                            }
                        ]
                    };
                    if (self.comparator === "OUT") {
                        boxQuery = {
                            "NOT": boxQuery
                        };
                    }
                    return boxQuery;
                }
            }
        ];
        this.results = [];
    }
    showMap() {
        return this.columns.reduce((show, column) => {
            return show && ((column.name === 'rooms_lat' || column.name === 'rooms_lon') ? column.value : true);
        }, true);
    }
    query() {
        let query;
        try {
            query = this.queryService.compose(this.filters, this.filterJunction, this.columns, this.order);
        }
        catch (error) {
            this.modalService.create(modal_component_1.ModalComponent, {
                title: "Query Error",
                body: error
            });
            return;
        }
        this.queryService
            .search(query)
            .then(results => {
            this.results = results.result;
            if (this.results.length === 0) {
                this.modalService.create(modal_component_1.ModalComponent, {
                    title: "Query Error",
                    body: "No results found"
                });
            }
        })
            .catch(error => {
            this.modalService.create(modal_component_1.ModalComponent, {
                title: "Query Error",
                body: error._body
            });
        });
    }
};
RoomsComponent = __decorate([
    core_1.Component({
        selector: 'rooms',
        template: `
<div class="row">
    <div class="col-md-4">
        <h3>Select Columns</h3>
        <column-selector [columns]="columns"></column-selector>
    </div>

    <div class="col-md-4">
        <h3>Order By</h3>
        <order-selector [order]="order"></order-selector>
    </div>

    <div class="col-md-4">
        <h3>Filters</h3>
        <filter-selector [filterJunction]="filterJunction" [filters]="filters"></filter-selector>
    </div>
</div>

<div class="row">
    <button type="button" class="btn btn-primary btn-lg btn-block" (click)="query()">Query</button>
</div>

<hr>

<div [hidden]="!showMap()" class="row">
    <rooms-map [rooms]="results"></rooms-map>
</div>

<query-results [columns]="columns" [results]="results"></query-results>
`
    }),
    __metadata("design:paramtypes", [query_service_1.QueryService, modal_service_1.ModalService])
], RoomsComponent);
exports.RoomsComponent = RoomsComponent;
//# sourceMappingURL=rooms.component.js.map