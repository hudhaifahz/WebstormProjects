"use strict";
/**
 * Created by jerome on 2017-03-30.
 */
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
let TimetableComponent = class TimetableComponent {
    getScheduleBlocks() {
        return [...this.schedule.keys()];
    }
    describeScheduleBlock(block) {
        switch (block) {
            case 0:
                return "MWF 8:00 - 9:00";
            case 1:
                return "MWF 9:00 - 10:00";
            case 2:
                return "MWF 10:00 - 11:00";
            case 3:
                return "MWF 11:00 - 12:00";
            case 4:
                return "MWF 12:00 - 13:00";
            case 5:
                return "MWF 13:00 - 14:00";
            case 6:
                return "MWF 14:00 - 15:00";
            case 7:
                return "MWF 15:00 - 16:00";
            case 8:
                return "MWF 16:00 - 17:00";
            case 9:
                return "TT 8:00 - 8:30";
            case 10:
                return "TT 8:30 - 10:00";
            case 11:
                return "TT 10:00 - 11:30";
            case 12:
                return "TT 11:30 - 13:00";
            case 13:
                return "TT 13:00 - 14:30";
            case 14:
                return "TT 14:30 - 16:00";
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Map)
], TimetableComponent.prototype, "schedule", void 0);
TimetableComponent = __decorate([
    core_1.Component({
        selector: 'timetable',
        template: `
<table class="table table-hover">
    <thead>
        <tr>
            <th>Block</th>
            <th>Course</th>
            <th>Seats</th>
        </tr>
    </thead>
    <tbody>
        <tr *ngFor="let block of getScheduleBlocks();">
            <td>{{ describeScheduleBlock(block) }}</td>
            <td>{{ schedule.get(block).name }}</td>
            <td>{{ schedule.get(block).seats }}</td>
        </tr>
    </tbody>
</table>`
    })
], TimetableComponent);
exports.TimetableComponent = TimetableComponent;
//# sourceMappingURL=timetable.component.js.map