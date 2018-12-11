"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Jnani on 3/18/17.
 */
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const courses_component_1 = require("./views/courses.component");
const rooms_component_1 = require("./views/rooms.component");
const schedule_component_1 = require("./views/schedule.component");
const routes = [
    { path: '', redirectTo: '/courses', pathMatch: 'full' },
    { path: 'courses', component: courses_component_1.CoursesComponent },
    { path: 'rooms', component: rooms_component_1.RoomsComponent },
    { path: 'schedule', component: schedule_component_1.ScheduleComponent }
];
let RoutingModule = class RoutingModule {
};
RoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], RoutingModule);
exports.RoutingModule = RoutingModule;
//# sourceMappingURL=routing.module.js.map