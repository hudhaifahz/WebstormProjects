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
let RoomsMapComponent = class RoomsMapComponent {
    uniqueRooms() {
        var seen = {};
        return this.rooms.filter((room) => {
            let key = JSON.stringify({
                rooms_lat: room.rooms_lat,
                rooms_lon: room.rooms_lon
            });
            return seen.hasOwnProperty(key) ? false : (seen[key] = true);
        });
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], RoomsMapComponent.prototype, "rooms", void 0);
RoomsMapComponent = __decorate([
    core_1.Component({
        selector: 'rooms-map',
        template: `
<sebm-google-map [latitude]="49.2606" [longitude]="-123.2460" [zoom]="14">
    <ng-container *ngFor="let room of uniqueRooms()">
        <sebm-google-map-marker *ngIf="room.rooms_lat && room.rooms_lon" [latitude]="room.rooms_lat" [longitude]="room.rooms_lon">
            <sebm-google-map-info-window>
                <strong *ngIf="room.rooms_fullname && room.rooms_shortname">{{room.rooms_fullname}} ({{room.rooms_shortname}})</strong>
                <p *ngIf="room.rooms_address">{{room.rooms_address}}</p>
                <p>{{room.rooms_lat}}, {{room.rooms_lon}}</p>
            </sebm-google-map-info-window>
        </sebm-google-map-marker>
    </ng-container>
</sebm-google-map>
`
    })
], RoomsMapComponent);
exports.RoomsMapComponent = RoomsMapComponent;
//# sourceMappingURL=rooms_map.component.js.map