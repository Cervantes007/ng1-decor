module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var angular = __webpack_require__(1);
__webpack_require__(2);
var appName = 'app';
var module = function (moduleOrName) {
    return typeof moduleOrName === "string"
        ? angular.module(moduleOrName)
        : moduleOrName;
};
exports.metadataKeys = {
    bindings: 'custom:bindings',
    declaration: 'custom:declaration',
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
function Directive(options, moduleOrName) {
    if (moduleOrName === void 0) { moduleOrName = appName + ".components"; }
    return function (Class) {
        var selector = toCamelCase(options.selector);
        delete options.selector;
        var bindings = getMetadata(exports.metadataKeys.bindings, Class);
        if (options.bindings) {
            options['bindToController'] = angular.extend({}, bindings, options.bindings);
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
function Routes(moduleOrName) {
    if (moduleOrName === void 0) { moduleOrName = appName + ".components"; }
    return function (Class) {
        module(moduleOrName).config(['$stateProvider', function ($stateProvider) {
                return new Class($stateProvider);
            }]);
    };
}
exports.Routes = Routes;
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
function Input(alias) {
    return function (target, key) { return addBindingToMetadata(target, key, '<', alias); };
}
exports.Input = Input;
function Output(alias) {
    return function (target, key) { return addBindingToMetadata(target, key, '&', alias); };
}
exports.Output = Output;
function toCamelCase(str) {
    return str.toLowerCase()
        .replace(/[-_]+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/ (.)/g, function ($1) { return $1.toUpperCase(); })
        .replace(/ /g, '');
}
function addBindingToMetadata(target, key, direction, alias) {
    var targetConstructor = target.constructor;
    var bindings = getMetadata(exports.metadataKeys.bindings, targetConstructor) || {};
    bindings[key] = alias || direction;
    defineMetadata(exports.metadataKeys.bindings, bindings, targetConstructor);
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("angular");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("reflect-metadata");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);