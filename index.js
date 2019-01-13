"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
require("reflect-metadata");
var appName = 'app';
var module = function (moduleOrName) {
    return typeof moduleOrName === "string"
        ? angular.module(moduleOrName)
        : moduleOrName;
};
exports.metadataKeys = {
    bindings: 'custom:bindings',
    declaration: 'custom:declaration',
    reactions: 'custom:reactions',
    name: 'custom:name',
    options: 'custom:options',
};
function getMetadata(metadataKey, target) {
    return Reflect.getMetadata(metadataKey, target);
}
exports.getMetadata = getMetadata;
function defineMetadata(metadataKey, metadataValue, target) {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
}
exports.defineMetadata = defineMetadata;
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
        var bindings = getMetadata(exports.metadataKeys.bindings, Class);
        if (bindings) {
            options.bindings = angular.extend({}, options.bindings, bindings);
        }
        options.controllerAs = options.controllerAs || 'vm';
        Class.selector = selector;
        var resultOptions = angular.extend(options, { controller: Class });
        module(moduleOrName).component(selector, resultOptions);
    };
}
exports.Component = Component;
exports.component = function (_a) {
    var selector = _a.selector, render = _a.render, providers = _a.providers, transclude = _a.transclude, restrict = _a.restrict, replace = _a.replace;
    return function (Class) {
        var original = Class;
        var reactions = getMetadata(exports.metadataKeys.reactions, Class);
        var f = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (reactions) {
                if (providers) {
                    var index = providers.indexOf('$scope');
                    if (index === -1) {
                        console.error(Class.name + " must have $scope as provider to use watch decorator");
                    }
                    else {
                        for (var key in reactions) {
                            if (reactions.hasOwnProperty(key)) {
                                args[index].$watch(reactions[key], original.prototype[key].bind(this));
                            }
                        }
                    }
                }
            }
            return original.apply(this, args);
        };
        f.prototype = original.prototype;
        var camelCaseSelector = selector ? toCamelCase(selector) : getSelectorFromClassName(Class.name);
        if (providers && providers.length > 0) {
            f.$inject = providers;
        }
        var bindings = getMetadata(exports.metadataKeys.bindings, Class);
        var config = {
            restrict: restrict || 'E',
            replace: replace !== undefined ? replace : true,
            transclude: transclude !== undefined ? transclude : true,
            scope: {},
            bindToController: bindings || {},
            template: render,
            controller: f,
            controllerAs: 'vm',
        };
        module(appName + ".components").directive(camelCaseSelector, function () { return config; });
        return f;
    };
};
exports.directive = function (_a) {
    var selector = _a.selector, providers = _a.providers;
    return function (Class) {
        var camelCaseSelector = selector ? toCamelCase(selector) : getSelectorFromClassName(Class.name);
        var bindings = getMetadata(exports.metadataKeys.bindings, Class);
        if (providers && providers.length > 0) {
            Class.$inject = providers;
        }
        var config = {
            restrict: 'A',
            scope: {},
            bindToController: bindings || {},
            controller: Class,
            controllerAs: 'vm',
        };
        module(appName + ".components").directive(camelCaseSelector, function () { return config; });
    };
};
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
function injectable(options, moduleOrName) {
    if (moduleOrName === void 0) { moduleOrName = appName + ".services"; }
    return function (Class) {
        var name = options.name || Class.name;
        if (options.providers && options.providers.length > 0) {
            Class.$inject = options.providers;
        }
        module(moduleOrName).service(name, Class);
    };
}
exports.injectable = injectable;
function Routes(moduleOrName) {
    if (moduleOrName === void 0) { moduleOrName = appName + ".components"; }
    return function (Class) {
        module(moduleOrName).config(['$stateProvider', function ($stateProvider) {
                return new Class($stateProvider);
            }]);
    };
}
exports.Routes = Routes;
function routes(moduleOrName) {
    if (moduleOrName === void 0) { moduleOrName = appName + ".components"; }
    return function (Class) {
        module(moduleOrName).config(['$stateProvider', function ($stateProvider) {
                return new Class($stateProvider);
            }]);
    };
}
exports.routes = routes;
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
function pipe(options, moduleOrName) {
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
exports.pipe = pipe;
function Input(alias) {
    return function (target, key) { return addBindingToMetadata(target, key, '<', alias); };
}
exports.Input = Input;
function Output(alias) {
    return function (target, key) { return addBindingToMetadata(target, key, '&', alias); };
}
exports.Output = Output;
function input(alias) {
    return function (target, key) { return addBindingToMetadata(target, key, '<', alias); };
}
exports.input = input;
function output(alias) {
    return function (target, key) { return addBindingToMetadata(target, key, '&', alias); };
}
exports.output = output;
function reaction(observedProp) {
    return function (target, key) { return addReactionToMetadata(target, key, observedProp); };
}
exports.reaction = reaction;
function html(strings) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var str = '';
    for (var i in strings) {
        if (strings.hasOwnProperty(i)) {
            var buildHtml = strings[i];
            buildHtml = buildHtml.replace(/<(?:(?!<).)*\/>/g, function (match) {
                return match.replace(/<([\w\d-]*)\s?(.*)?\/>/gi, '<$1 $2></$1>');
            });
            buildHtml = buildHtml.replace(/\{{(?:(?!{).)*}}/g, function (matchGlobal) {
                return matchGlobal.replace(/\{{(.*)}}/, function (match, selection) {
                    var aux = selection.replace(/@./g, 'vm.');
                    aux = aux.replace(/#/g, 'vm.css');
                    return "{{" + aux + "}}";
                });
            });
            buildHtml = buildHtml.replace(/="@.*"/gi, function (match) { return match.replace(/@\./g, 'vm.'); });
            buildHtml = buildHtml.replace(/@\.([\w\d\.]*)/gi, '{{vm.$1}}');
            buildHtml = buildHtml.replace(/class="(.*)"/, function (match, selection) {
                var aux = selection.replace(/#(\.[\w\d\.]*)?/gi, ' {{vm.css$1}}');
                return "class=\"" + aux + "\"";
            });
            str += buildHtml + (values[i] || '');
        }
    }
    return str;
}
exports.html = html;
function getSelectorFromClassName(s) {
    return s && "" + s[0].toLowerCase() + s.slice(1);
}
function toCamelCase(str) {
    return str.toLowerCase()
        .replace(/[-_]+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/ (.)/g, function ($1) { return $1.toUpperCase(); })
        .replace(/ /g, '');
}
function addReactionToMetadata(target, key, observedValue) {
    var targetConstructor = target.constructor;
    var reactions = getMetadata(exports.metadataKeys.reactions, targetConstructor) || {};
    reactions[key] = "vm." + observedValue;
    defineMetadata(exports.metadataKeys.reactions, reactions, targetConstructor);
}
function addBindingToMetadata(target, key, direction, alias) {
    var targetConstructor = target.constructor;
    var bindings = getMetadata(exports.metadataKeys.bindings, targetConstructor) || {};
    bindings[key] = alias || direction;
    defineMetadata(exports.metadataKeys.bindings, bindings, targetConstructor);
}
