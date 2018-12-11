"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const http_1 = require("@angular/http");
const forms_1 = require("@angular/forms");
const core_2 = require("angular2-google-maps/core");
const app_component_1 = require("./app.component");
const modal_component_1 = require("./modal/modal.component");
const result_component_1 = require("./view_components/result.component");
const column_selector_component_1 = require("./view_components/column_selector.component");
const order_selector_component_1 = require("./view_components/order_selector.component");
const filter_selector_component_1 = require("./view_components/filter_selector.component");
const timetable_component_1 = require("./view_components/timetable.component");
const rooms_map_component_1 = require("./view_components/rooms_map.component");
const courses_component_1 = require("./views/courses.component");
const rooms_component_1 = require("./views/rooms.component");
const schedule_component_1 = require("./views/schedule.component");
const courses_pane_component_1 = require("./views/courses_pane.component");
const section_pane_component_1 = require("./views/section_pane.component");
const query_service_1 = require("./query.service");
const routing_module_1 = require("./routing.module");
const modal_service_1 = require("./modal/modal.service");
const modal_placeholder_component_1 = require("./modal/modal-placeholder.component");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            routing_module_1.RoutingModule,
            core_2.AgmCoreModule.forRoot({
                apiKey: 'AIzaSyDcKrCx76jtmQSmRooS2o8HLwhS0arNOZU'
            })
        ],
        declarations: [
            app_component_1.AppComponent,
            modal_placeholder_component_1.ModalPlaceholderComponent,
            modal_component_1.ModalComponent,
            result_component_1.ResultComponent,
            column_selector_component_1.ColumnSelectorComponent,
            order_selector_component_1.OrderSelectorComponent,
            filter_selector_component_1.FilterSelectorComponent,
            timetable_component_1.TimetableComponent,
            rooms_map_component_1.RoomsMapComponent,
            courses_pane_component_1.CoursesPaneComponent,
            section_pane_component_1.SectionPaneComponent,
            courses_component_1.CoursesComponent,
            rooms_component_1.RoomsComponent,
            schedule_component_1.ScheduleComponent
        ],
        entryComponents: [
            modal_component_1.ModalComponent
        ],
        bootstrap: [
            app_component_1.AppComponent
        ],
        providers: [
            query_service_1.QueryService,
            modal_service_1.ModalService
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map