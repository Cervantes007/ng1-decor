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
	  reactions: 'custom:reactions',
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

interface IComponent {
	selector?: string;
	render?: string;
	transclude?: boolean | object;
	providers?: string[];
	restrict?: string;
	replace?: boolean;
}

export const component = ({ selector, render, providers, transclude, restrict, replace }: IComponent) => (Class: any) => {
	const original = Class;
	const reactions = getMetadata(metadataKeys.reactions, Class);
	// the new constructor behavior
	const f: any = function(...args: any[]) {
		if (reactions) {
			if (providers) {
				const index = providers.indexOf('$scope');
				if (index === -1) {
					console.error(`${Class.name} must have $scope as provider to use watch decorator`);
				} else {
					for (const key in reactions) {
						if (reactions.hasOwnProperty(key)) {
							// $scope.$watch('vm.someProperty', () => console.log('change'));
							args[index].$watch(reactions[key], original.prototype[key].bind(this));
						}
					}
				}
			}
		}
		return original.apply(this, args);
	};
	// copy prototype so intanceof operator still works
	f.prototype = original.prototype;
	const camelCaseSelector = selector ? toCamelCase(selector) : getSelectorFromClassName(Class.name);
	if (providers && providers.length > 0) {
		f.$inject = providers;
	}
	
	const bindings = getMetadata(metadataKeys.bindings, Class);
	
	const config = {
		restrict: restrict || 'E',
		replace: replace !== undefined ? replace : true,
		transclude: transclude !== undefined ? transclude : true,
		scope: {},
		bindToController: bindings || {},
		template: render,
		controller: f,
		controllerAs: 'vm',
	};
	module(`${appName}.components`).directive(camelCaseSelector, () => config as any);
	
	return f;
};

interface IDirective {
	selector?: string;
	providers?: string[];
	restrict?: string;
}

export const directive = ({ selector, providers, }: IDirective) => (Class: any) => {
	const camelCaseSelector = selector ? toCamelCase(selector) : getSelectorFromClassName(Class.name);
	const bindings = getMetadata(metadataKeys.bindings, Class);
	if(providers && providers.length > 0){ Class.$inject = providers; }
	
	const config = {
		restrict: 'A',
		scope: {},
		bindToController: bindings || {},
		controller: Class,
		controllerAs: 'vm',
	};
	module(`${appName}.components`).directive(camelCaseSelector, () => config as any);
};

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

export function injectable(options?: {
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

export function routes(moduleOrName: string | ng.IModule = `${appName}.components`) {
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

export function pipe(options: {name: string, providers?: Array<string>}, moduleOrName: string | ng.IModule = `${appName}.pipes`): any {
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

export function input(alias?: string) {
	return (target: any, key: string) => addBindingToMetadata(target, key, '<', alias);
}

export function output(alias?: string) {
	return (target: any, key: string) => addBindingToMetadata(target, key, '&', alias);
}

export function reaction(observedProp: string) {
	return (target: any, key: string) => addReactionToMetadata(target, key, observedProp);
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

// <example prop="abc"/> = <example prop="abc"></example>
// @.x = {{vm.x}}
// #.x = {{vm.css.x}}
// {{@.x && #.x?}} = {{vm.x && vm.css.x?}}
// ng-model="@.x" = ng-model="vm.x"
export function html(strings: string[], ...values: any[]) {
	let str = '';
	
	for (const i in strings) {
		if (strings.hasOwnProperty(i)) {
			let buildHtml = strings[i];
			// Transclude Pending - To check real use
			// string = string.replace(/<children\*\s?\/>/g, '<ng-transclude></ng-transclude>');
			// string = string.replace(/<children\*=?([\w\d]*)?\s\/>/g, '<div ng-transclude="$1">abc</div>');
			
			// <example prop="abc"/> = <example prop="abc"></example>
			buildHtml = buildHtml.replace(/<(?:(?!<).)*\/>/g, match =>
				match.replace(/<([\w\d-]*)\s?(.*)?\/>/gi, '<$1 $2></$1>'),
			);
			
			// Allow to use expressions {{}} with @. and #. inside Ex: <h1 class="{{@.name && #.h2}}">Headline</h1>
			buildHtml = buildHtml.replace(/\{{(?:(?!{).)*}}/g, matchGlobal =>
				matchGlobal.replace(/\{{(.*)}}/, (match, selection) => {
					let aux = selection.replace(/@./g, 'vm.');
					aux = aux.replace(/#/g, 'vm.css');
					return `{{${aux}}}`;
				}),
			);
			
			// allow to use ng-model="@.name"
			// string = string.replace(/ng-[\w]*="@.*"/gi, match => match.replace(/@\./g, 'vm.'));
			// allow to use ="@.x"
			buildHtml = buildHtml.replace(/="@.*"/gi, match => match.replace(/@\./g, 'vm.'));
			
			// Shortcut for bind {{vm.*}} to @.*
			buildHtml = buildHtml.replace(/@\.([\w\d\.]*)/gi, '{{vm.$1}}');
			
			// Shortcut for styles {{vm.style.*}} to #.*
			buildHtml = buildHtml.replace(/class="(.*)"/, (match, selection) => {
				const aux = selection.replace(/#(\.[\w\d\.]*)?/gi, ' {{vm.css$1}}');
				return `class="${aux}"`;
			});
			
			str += buildHtml + (values[i] || '');
		}
	}
	return str;
}

function getSelectorFromClassName(s: string) {
	return s && `${s[0].toLowerCase()}${s.slice(1)}`;
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

function addReactionToMetadata(target: any, key: string, observedValue: string) {
	const targetConstructor = target.constructor;
	const reactions = getMetadata(metadataKeys.reactions, targetConstructor) || {};
	reactions[key] = `vm.${observedValue}`;
	defineMetadata(metadataKeys.reactions, reactions, targetConstructor);
}

function addBindingToMetadata(target: any, key: string, direction: string, alias?: string) {
    const targetConstructor = target.constructor;
    const bindings = getMetadata(metadataKeys.bindings, targetConstructor) || {};
    bindings[key] = alias || direction;
    defineMetadata(metadataKeys.bindings, bindings, targetConstructor);
}