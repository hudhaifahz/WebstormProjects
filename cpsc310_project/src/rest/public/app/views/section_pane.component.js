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
let SectionPaneComponent = class SectionPaneComponent {
    constructor(queryService, modalService) {
        this.queryService = queryService;
        this.modalService = modalService;
        this.order = {
            dir: "UP",
            keys: [
                {
                    name: "sections",
                    value: true
                },
                {
                    name: "courses_dept",
                    value: false
                },
                {
                    name: "courses_id",
                    value: false
                }
            ]
        };
        this.columns = [
            {
                name: "courses_dept",
                value: true
            },
            {
                name: "courses_id",
                value: true
            },
            {
                name: "courses_title",
                value: true
            },
            {
                name: "sections",
                value: true
            }
        ];
        this.filterJunction = "AND";
        this.filters = [
            {
                name: "courses_instructor",
                type: "string",
                comparator: "",
                value: ""
            },
            {
                name: "courses_title",
                type: "string",
                comparator: "",
                value: ""
            },
            {
                name: "courses_dept",
                type: "string",
                comparator: "",
                value: ""
            },
            {
                name: "courses_pass",
                type: "number",
                comparator: "",
                value: ""
            },
            {
                name: "courses_fail",
                type: "number",
                comparator: "",
                value: ""
            }
        ];
        this.results = [];
        this.section_results = [];
    }
    query() {
        let query;
        try {
            query = this.queryService.compose(this.filters, this.filterJunction, this.columns, this.order);
            query.TRANSFORMATIONS = {
                "GROUP": this.columns.filter((item) => {
                    debugger;
                    return item.value && item.name.includes("_");
                }).map((item) => {
                    return item.name;
                }),
                "APPLY": [
                    {
                        "sections": {
                            "COUNT": "courses_uuid"
                        }
                    }
                ]
            };
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
                    title: "Query",
                    body: "No results found"
                });
            }
        }).catch(error => {
            this.modalService.create(modal_component_1.ModalComponent, {
                title: "Query Error",
                body: error._body
            });
        });
    }
};
SectionPaneComponent = __decorate([
    core_1.Component({
        selector: 'section-pane',
        template: `
<div class="row">
    <div class="col-md-6">
        <h3>Order By</h3>
        <order-selector [order]="order"></order-selector>
    </div>

    <div class="col-md-6">
        <h3>Filters</h3>
        <filter-selector [filterJunction]="filterJunction" [filters]="filters"></filter-selector>
    </div>
</div>
        
<div class="row">
    <button type="button" class="btn btn-primary btn-lg btn-block" (click)="query()">Query</button>
</div>
        
<hr>

<query-results [columns]="columns" [results]="results"></query-results>
`
    }),
    __metadata("design:paramtypes", [query_service_1.QueryService, modal_service_1.ModalService])
], SectionPaneComponent);
exports.SectionPaneComponent = SectionPaneComponent;
//# sourceMappingURL=section_pane.component.js.map