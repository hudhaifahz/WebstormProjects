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
const modal_service_1 = require("./modal.service");
let ModalPlaceholderComponent = class ModalPlaceholderComponent {
    constructor(modalService) {
        this.modalService = modalService;
    }
    ngOnInit() {
        this.modalService.registerViewContainer(this.viewContainerRef);
    }
};
__decorate([
    core_1.ViewChild("placeholder", { read: core_1.ViewContainerRef }),
    __metadata("design:type", typeof (_a = typeof core_1.ViewContainerRef !== "undefined" && core_1.ViewContainerRef) === "function" && _a || Object)
], ModalPlaceholderComponent.prototype, "viewContainerRef", void 0);
ModalPlaceholderComponent = __decorate([
    core_1.Component({
        selector: "modal-placeholder",
        template: `<template #placeholder></template>`
    }),
    __metadata("design:paramtypes", [modal_service_1.ModalService])
], ModalPlaceholderComponent);
exports.ModalPlaceholderComponent = ModalPlaceholderComponent;
var _a;
//# sourceMappingURL=modal-placeholder.component.js.map