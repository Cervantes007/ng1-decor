/// <reference types="@types/angular" />
import 'reflect-metadata';
export declare const metadataKeys: {
    bindings: string;
    declaration: string;
    name: string;
    options: string;
};
export declare function getMetadata(metadataKey: any, target: any): any;
export declare function defineMetadata(metadataKey: any, metadataValue: any, target: any): void;
export declare function Component(options: {
    selector: string;
    controllerAs?: string;
    template?: string;
    templateUrl?: string;
    bindings?: any;
    transclude?: any;
    replace?: boolean;
    require?: any;
    pipes?: any[];
    providers?: any[];
}, moduleOrName?: string | ng.IModule): (Class: any) => void;
export declare function Directive(options: {
    selector: string;
    controllerAs?: string;
    bindings?: any;
    require?: any;
    pipes?: any[];
    providers?: any[];
    scope: {};
}, moduleOrName?: string | ng.IModule): (Class: any) => void;
export declare function Injectable(options?: {
    name?: string;
    providers?: Array<string>;
}, moduleOrName?: string | ng.IModule): (Class: any) => void;
export declare function Routes(moduleOrName?: string | ng.IModule): (Class: any) => void;
export interface PipeTransform {
    transform(value: any, ...args: any[]): any;
}
export declare function Pipe(options: {
    name: string;
    providers?: Array<string>;
}, moduleOrName?: string | ng.IModule): any;
export declare function Input(alias?: string): (target: any, key: string) => void;
export declare function Output(alias?: string): (target: any, key: string) => void;
export interface OnInit {
    $onInit(): any;
}
export interface OnChanges {
    $onChanges(changes?: any): any;
}
export interface PostLink {
    $postLink(): any;
}
export interface OnDestroy {
    $onDestroy(): any;
}
