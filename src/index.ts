import * as angular from 'angular';
import 'reflect-metadata';
const appName = 'app';

const module = (moduleOrName: any) => {
    return typeof moduleOrName === "string"
        ? angular.module(moduleOrName)
        : moduleOrName;
};

export const metadataKeys = {
    bindings: 'custom:bindings',
    declaration: 'custom:declaration',
    name: 'custom:name',
    options: 'custom:options',
};

export function getMetadata(metadataKey: any, target: any): any {
    return Reflect.getMetadata(metadataKey, target);
}

export function defineMetadata(metadataKey: any, metadataValue: any, target: any): void {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
}

export function Component(options: {
    selector: string,
    controllerAs?: string,
    template?: string,
    templateUrl?: string,
    bindings?: any,
    transclude?: any,
    replace?: boolean,
    require?: any,
    pipes?: any[],
    providers?: any[]
}, moduleOrName: string | ng.IModule = `${appName}.components`) {
    return (Class: any) => {
        const selector = toCamelCase(options.selector);
        delete options.selector;
        delete options.pipes;
        delete options.transclude;
        if(options.providers && options.providers.length > 0){ Class.$inject = options.providers; }
        delete options.providers;
        const bindings = getMetadata(metadataKeys.bindings, Class);
        if (bindings) {
            options.bindings = angular.extend({}, options.bindings, bindings);
        }
        options.controllerAs = options.controllerAs || 'vm';
        Class.selector = selector;
        const resultOptions = angular.extend(options, { controller: Class });
        
        module(moduleOrName).component(selector, resultOptions);
    };
}

export function Directive(options: {
    selector: string,
    controllerAs?: string,
    bindings?: any,
    require?: any,
    pipes?: any[],
    providers?: any[],
    scope: {}
}, moduleOrName: string | ng.IModule = `${appName}.components`) {
    return (Class: any) => {
        const selector = toCamelCase(options.selector);
        delete options.selector;
        const bindings = getMetadata(metadataKeys.bindings, Class);
        if(options.bindings){ options['bindToController'] = angular.extend({},bindings, options.bindings);}
        delete options.bindings;
        options.controllerAs = options.controllerAs || 'vm';
        delete options.pipes;
        if(options.providers && options.providers.length > 0){ Class.$inject = options.providers; }
        delete options.providers;
        Class.selector = selector;
        module(moduleOrName).directive(selector, angular.extend(options, { controller: Class }));
    };
}

export function Injectable(options?: {
    name?: string,
    providers?: Array<string>
},moduleOrName: string | ng.IModule = `${appName}.services`) {
    return (Class: any) => {
        const name = options.name || Class.name;
        if(options.providers && options.providers.length > 0){ Class.$inject = options.providers; }
        module(moduleOrName).service(name, Class);
    };
}

export function Routes(moduleOrName: string | ng.IModule = `${appName}.components`) {
    return (Class: any) => {
        module(moduleOrName).config(['$stateProvider', ($stateProvider: any)=>{
            return new Class($stateProvider);
        }]);
    };
}

interface PipeTransformStatic {
    new(...args: any[]): PipeTransform;
}

export interface PipeTransform {
    transform(value: any, ...args: any[]): any;
}

export function Pipe(options: {name: string, providers?: Array<string>}, moduleOrName: string | ng.IModule = `${appName}.pipes`): any {
    return (Pipe: PipeTransformStatic) => {
        if(options.providers && options.providers.length > 0){ Pipe.$inject = options.providers;}
        const name = options.name || Pipe.name;
        const filter = () => {
            const $injector = angular.injector(['ng']);
            const instance:any = $injector.instantiate(Pipe);
            return instance.transform.bind(instance);
        };
        module(moduleOrName).filter(name, filter);
    };
}

export function Input(alias?: string) {
    return (target: any, key: string) => addBindingToMetadata(target, key, '<', alias);
}

export function Output(alias?: string) {
    return (target: any, key: string) => addBindingToMetadata(target, key, '&', alias);
}

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

function toCamelCase(str: any) {
    // Lower cases the string
    return str.toLowerCase()
    // Replaces any - or _ characters with a space
    .replace( /[-_]+/g, ' ')
    // Removes any non alphanumeric characters
    .replace( /[^\w\s]/g, '')
    // Uppercases the first character in each group immediately following a space
    // (delimited by spaces)
    .replace( / (.)/g, function($1: any) { return $1.toUpperCase(); })
    // Removes spaces
    .replace( / /g, '' );
}

function addBindingToMetadata(target: any, key: string, direction: string, alias?: string) {
    const targetConstructor = target.constructor;
    const bindings = getMetadata(metadataKeys.bindings, targetConstructor) || {};
    bindings[key] = alias || direction;
    defineMetadata(metadataKeys.bindings, bindings, targetConstructor);
}