"use strict";
var appName = 'app';
var module = function (moduleOrName) {
    return typeof moduleOrName === "string"
        ? angular.module(moduleOrName)
        : moduleOrName;
};
function Component(options, moduleOrName) {
    if (moduleOrName === void 0) { moduleOrName = appName + ".components"; }
    return function (Class) {
        var selector = toCamelCase(options.selector);
        delete options.selector;
        delete options.pipes;
        if (options.providers && options.providers.length > 0) {
            Class.$inject = options.providers;
        }
        delete options.providers;
        options.controllerAs = options.controllerAs || 'vm';
        Class.selector = selector;
        module(moduleOrName).component(selector, angular.extend(options, { controller: Class }));
    };
}
exports.Component = Component;
function Directive(options, moduleOrName) {
    if (moduleOrName === void 0) { moduleOrName = appName + ".components"; }
    return function (Class) {
        var selector = toCamelCase(options.selector);
        delete options.selector;
        if (options.bindings) {
            options['bindToController'] = options.bindings;
        }
        delete options.bindings;
        options.controllerAs = options.controllerAs || 'vm';
        delete options.pipes;
        if (options.providers && options.providers.length > 0) {
            Class.$inject = options.providers;
        }
        delete options.providers;
        Class.selector = selector;
        module(moduleOrName).directive(selector, angular.extend(options, { controller: Class }));
    };
}
exports.Directive = Directive;
function Injectable(options, moduleOrName) {
    if (moduleOrName === void 0) { moduleOrName = appName + ".services"; }
    return function (Class) {
        var name = options.name || Class.name;
        if (options.providers && options.providers.length > 0) {
            Class.$inject = options.providers;
        }
        module(moduleOrName).service(name, Class);
    };
}
exports.Injectable = Injectable;
function Pipe(options, moduleOrName) {
    if (moduleOrName === void 0) { moduleOrName = appName + ".pipes"; }
    return function (Pipe) {
        if (options.providers && options.providers.length > 0) {
            Pipe.$inject = options.providers;
        }
        var name = options.name || Pipe.name;
        var filter = function () {
            var $injector = angular.injector(['ng']);
            var instance = $injector.instantiate(Pipe);
            return instance.transform.bind(instance);
        };
        module(moduleOrName).filter(name, filter);
    };
}
exports.Pipe = Pipe;
function toCamelCase(str) {
    // Lower cases the string
    return str.toLowerCase()
        .replace(/[-_]+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/ (.)/g, function ($1) { return $1.toUpperCase(); })
        .replace(/ /g, '');
}
