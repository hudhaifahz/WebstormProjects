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
require("rxjs/add/operator/toPromise");
let ModalService = class ModalService {
    constructor(resolver) {
        this.resolver = resolver;
    }
    registerViewContainer(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    create(component, parameters) {
        // Inject
        let factory = this.resolver.resolveComponentFactory(component);
        // Allow DI
        const injector = core_1.ReflectiveInjector.fromResolvedProviders([], this.viewContainerRef.parentInjector);
        let componentRef = this.viewContainerRef.createComponent(factory, 0, injector, []);
        // Assign parameters to the new component
        Object.assign(componentRef.instance, parameters);
        this.instances++;
        // Destroy the component when destroy() is invoked
        componentRef.instance["destroy"] = () => {
            this.instances--;
            componentRef.destroy();
        };
        return componentRef;
    }
    ;
};
ModalService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.ComponentFactoryResolver !== "undefined" && core_1.ComponentFactoryResolver) === "function" && _a || Object])
], ModalService);
exports.ModalService = ModalService;
var _a;
//# sourceMappingURL=modal.service.js.map