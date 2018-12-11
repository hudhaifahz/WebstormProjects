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
let FilterSelectorComponent = class FilterSelectorComponent extends core_1.OnInit {
    ngOnInit() {
        // <option *ngFor> doesn't like to cooperate during the initial render
        this.filters.forEach((filter) => {
            filter.comparator = this.comparators(filter.type)[0];
        });
    }
    comparators(type) {
        if (type === "string") {
            return ["IS"];
        }
        else if (type === "location") {
            return ["IN", "OUT"];
        }
        return ["LT", "EQ", "GT"];
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], FilterSelectorComponent.prototype, "filterJunction", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], FilterSelectorComponent.prototype, "filters", void 0);
FilterSelectorComponent = __decorate([
    core_1.Component({
        selector: 'filter-selector',
        template: `
<select class="form-control" [(ngModel)]="filterJunction">
    <option>AND</option>
    <option>OR</option>
</select>
<div *ngFor="let filter of filters;"class="form-group">
    <label>{{filter.name}}</label>
    <div class="row">
        <div class="col-md-8">
            <input class="form-control" [(ngModel)]="filter.value">
        </div>
        <div class="col-md-4">
            <select class="form-control" [(ngModel)]="filter.comparator">
            <option *ngFor="let comparator of comparators(filter.type);">{{comparator}}</option>
            </select>
        </div>
    </div>
</div>
`
    })
], FilterSelectorComponent);
exports.FilterSelectorComponent = FilterSelectorComponent;
//# sourceMappingURL=filter_selector.component.js.map