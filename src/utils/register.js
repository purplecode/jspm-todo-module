'use strict';
import angular from 'angular';
/**
 * A helper class to simplify registering Angular components and provide a consistent syntax for doing so.
 */
export default function register(appName, dependencies) {

  var app = safeRegister(appName, dependencies);

  return {
    name: appName,
    directive: directive,
    controller: controller,
    service: service,
    provider: provider,
    factory: factory
  };

  function safeRegister(appName, dependencies) {
    try {
      return angular.module(appName);
    } catch (e) {
      return angular.module(appName, dependencies || []);
    }
  }

  function directive(name, constructorFn) {
    /*jshint validthis: true */
    constructorFn = _normalizeConstructor(constructorFn);

    if (!constructorFn.prototype.compile) {
      // create an empty compile function if none was defined.
      constructorFn.prototype.compile = () => {
      };
    }

    var originalCompileFn = _cloneFunction(constructorFn.prototype.compile);

    // Decorate the compile method to automatically return the link method (if it exists)
    // and bind it to the context of the constructor (so `this` works correctly).
    // This gets around the problem of a non-lexical "this" which occurs when the directive class itself
    // returns `this.link` from within the compile function.
    _override(constructorFn.prototype, 'compile', function () {
      return function () {
        originalCompileFn.apply(this, arguments);

        if (constructorFn.prototype.link) {
          return constructorFn.prototype.link.bind(this);
        }
      };
    });

    var factoryArray = _createFactoryArray(constructorFn);

    app.directive(name, factoryArray);
    return this;
  }

  function controller(name, contructorFn) {
    /*jshint validthis: true */
    app.controller(name, contructorFn);
    return this;
  }

  function service(name, contructorFn) {
    /*jshint validthis: true */
    app.service(name, contructorFn);
    return this;
  }

  function provider(name, constructorFn) {
    /*jshint validthis: true */
    app.provider(name, constructorFn);
    return this;
  }

  function factory(name, constructorFn) {
    /*jshint validthis: true */
    constructorFn = _normalizeConstructor(constructorFn);
    var factoryArray = _createFactoryArray(constructorFn);
    app.factory(name, factoryArray);
    return this;
  }

  /**
   * If the constructorFn is an array of type ['dep1', 'dep2', ..., constructor() {}]
   * we need to pull out the array of dependencies and add it as an $inject property of the
   * actual constructor function.
   * @param input
   * @returns {*}
   * @private
   */
  function _normalizeConstructor(input) {
    var constructorFn;

    if (input.constructor === Array) {
      //
      var injected = input.slice(0, input.length - 1);
      constructorFn = input[input.length - 1];
      constructorFn.$inject = injected;
    } else {
      constructorFn = input;
    }

    return constructorFn;
  }

  /**
   * Convert a constructor function into a factory function which returns a new instance of that
   * constructor, with the correct dependencies automatically injected as arguments.
   *
   * In order to inject the dependencies, they must be attached to the constructor function with the
   * `$inject` property annotation.
   *
   * @param ConstructorFn
   * @returns {Array.<T>}
   * @private
   */
  function _createFactoryArray(ConstructorFn) {
    // get the array of dependencies that are needed by this component (as contained in the `$inject` array)
    var args = ConstructorFn.$inject || [];
    var factoryArray = args.slice(); // create a copy of the array
    // The factoryArray uses Angular's array notation whereby each element of the array is the name of a
    // dependency, and the final item is the factory function itself.
    factoryArray.push((...args) => {
      return new ConstructorFn(...args);
    });

    return factoryArray;
  }

  /**
   * Clone a function
   * @param original
   * @returns {Function}
   */
  function _cloneFunction(original) {
    return function () {
      return original.apply(this, arguments);
    };
  }

  /**
   * Override an object's method with a new one specified by `callback`.
   * @param object
   * @param methodName
   * @param callback
   */
  function _override(object, methodName, callback) {
    object[methodName] = callback(object[methodName]);
  }

}