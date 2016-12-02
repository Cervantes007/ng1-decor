export declare function Component(options: {
    selector: string;
    controllerAs?: string;
    template?: string;
    templateUrl?: string;
    transclude?:boolean;
    bindings?: any;
    require?: any;
    pipes?: any[];
    providers?: any[];
}, moduleOrName?: string | ng.IModule): (Class: any) => void;
export declare function Directive(options: {
    selector: string;
    controllerAs?: string;
    template?: string;
    templateUrl?: string;
    bindings?: any;
    transclude?:boolean;
    require?: any;
    pipes?: any[];
    providers?: any[];
    scope: {};
}, moduleOrName?: string | ng.IModule): (Class: any) => void;
export declare function Injectable(options?: {
    name?: string;
    providers?: Array<string>;
}, moduleOrName?: string | ng.IModule): (Class: any) => void;
export interface PipeTransformStatic {
    new (...args: any[]): PipeTransform;
}
export interface PipeTransform {
    transform(value: any, ...args: any[]): any;
}
export declare function Pipe(options: {
    name: string;
    providers?: Array<string>;
}, moduleOrName?: string | ng.IModule): (Pipe: PipeTransformStatic) => void;
export interface OnInit {
    $onInit(): any;
}
export interface OnChange {
    $onChanges(): any;
}
export interface PostLink {
    $postLink(): any;
}
export interface OnDestroy {
    $onDestroy(): any;
}
