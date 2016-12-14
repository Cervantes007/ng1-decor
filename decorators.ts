const appName = 'app';

const module = function(moduleOrName) {
    return typeof moduleOrName === "string"
        ? angular.module(moduleOrName)
        : moduleOrName;
};

export function Component(options: {
    selector: string,
    controllerAs?: string,
    template?: string,
    templateUrl?: string,
    bindings?: any,
    transclude?: any,
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
        options.controllerAs = options.controllerAs || 'vm';
        Class.selector = selector;
        module(moduleOrName).component(selector, angular.extend(options, { controller: Class }));
    }
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
        if(options.bindings){ options['bindToController'] = options.bindings;}
        delete options.bindings;
        options.controllerAs = options.controllerAs || 'vm';
        delete options.pipes;
        if(options.providers && options.providers.length > 0){ Class.$inject = options.providers; }
        delete options.providers;
        Class.selector = selector;
        module(moduleOrName).directive(selector, angular.extend(options, { controller: Class }));
    }
}

export function Injectable(options?: {
    name?: string,
    providers?: Array<string>
},moduleOrName: string | ng.IModule = `${appName}.services`) {
    return (Class: any) => {
        const name = options.name || Class.name;
        if(options.providers && options.providers.length > 0){ Class.$inject = options.providers; }
        module(moduleOrName).service(name, Class);
    }
}

export function Routes(moduleOrName: string | ng.IModule = `${appName}.components`) {
    return (Class: any) => {
        module(moduleOrName).config(['$stateProvider', ($stateProvider)=>{
            return new Class($stateProvider);
        }]);
    }
}

interface PipeTransformStatic {
    new(...args: any[]): PipeTransform;
}

export interface PipeTransform {
    transform(value: any, ...args: any[]): any;
}

export function Pipe(options: {name: string, providers?: Array<string>}, moduleOrName: string | ng.IModule = `${appName}.pipes`) {
    return (Pipe: PipeTransformStatic) => {
        if(options.providers && options.providers.length > 0){ Pipe.$inject = options.providers;}
        const name = options.name || Pipe.name;
        const filter = () => {
            const $injector = angular.injector(['ng']);
            const instance:any = $injector.instantiate(Pipe);
            return instance.transform.bind(instance);
        };
        module(moduleOrName).filter(name, filter);
    }
}

function toCamelCase(str) {
    // Lower cases the string
    return str.toLowerCase()
    // Replaces any - or _ characters with a space
        .replace( /[-_]+/g, ' ')
        // Removes any non alphanumeric characters
        .replace( /[^\w\s]/g, '')
        // Uppercases the first character in each group immediately following a space
        // (delimited by spaces)
        .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
        // Removes spaces
        .replace( / /g, '' );
}

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
