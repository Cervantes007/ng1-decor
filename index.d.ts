/// <reference types="angular" />
import 'reflect-metadata';
export declare const metadataKeys: {
    bindings: string;
    declaration: string;
    reactions: string;
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
interface IComponent {
    selector?: string;
    render?: string;
    transclude?: boolean | object;
    providers?: string[];
    restrict?: string;
    replace?: boolean;
}
export declare const component: ({ selector, render, providers, transclude, restrict, replace }: IComponent) => (Class: any) => any;
interface IDirective {
    selector?: string;
    providers?: string[];
    restrict?: string;
}
export declare const directive: ({ selector, providers, }: IDirective) => (Class: any) => void;
export declare function Injectable(options?: {
    name?: string;
    providers?: Array<string>;
}, moduleOrName?: string | ng.IModule): (Class: any) => void;
export declare function injectable(options?: {
    name?: string;
    providers?: Array<string>;
}, moduleOrName?: string | ng.IModule): (Class: any) => void;
export declare function Routes(moduleOrName?: string | ng.IModule): (Class: any) => void;
export declare function routes(moduleOrName?: string | ng.IModule): (Class: any) => void;
export interface PipeTransform {
    transform(value: any, ...args: any[]): any;
}
export declare function Pipe(options: {
    name: string;
    providers?: Array<string>;
}, moduleOrName?: string | ng.IModule): any;
export declare function pipe(options: {
    name: string;
    providers?: Array<string>;
}, moduleOrName?: string | ng.IModule): any;
export declare function Input(alias?: string): (target: any, key: string) => void;
export declare function Output(alias?: string): (target: any, key: string) => void;
export declare function input(alias?: string): (target: any, key: string) => void;
export declare function output(alias?: string): (target: any, key: string) => void;
export declare function reaction(observedProp: string): (target: any, key: string) => void;
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
export declare function html(strings: string[], ...values: any[]): string;
export {};
