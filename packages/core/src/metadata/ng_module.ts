/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef} from '../application_ref';
import {Provider} from '../di/provider';
import {R3_COMPILE_NGMODULE} from '../ivy_switch';
import {Type} from '../type';
import {TypeDecorator, makeDecorator} from '../util/decorators';

/**
 * Represents the expansion of an `NgModule` into its scopes.
 *
 * A scope is a set of directives and pipes that are visible in a particular context. Each
 * `NgModule` has two scopes. The `compilation` scope is the set of directives and pipes that will
 * be recognized in the templates of components declared by the module. The `exported` scope is the
 * set of directives and pipes exported by a module (that is, module B's exported scope gets added
 * to module A's compilation scope when module A imports B).
 */
export interface NgModuleTransitiveScopes {
  compilation: {directives: Set<any>; pipes: Set<any>;};
  exported: {directives: Set<any>; pipes: Set<any>;};
}

/**
 * A version of {@link NgModuleDef} that represents the runtime type shape only, and excludes
 * metadata parameters.
 */
export type NgModuleDefInternal<T> = NgModuleDef<T, any, any, any>;

/**
 * Runtime link information for NgModules.
 *
 * This is the internal data structure used by the runtime to assemble components, directives,
 * pipes, and injectors.
 *
 * NOTE: Always use `defineNgModule` function to create this object,
 * never create the object directly since the shape of this object
 * can change between versions.
 */
export interface NgModuleDef<T, Declarations, Imports, Exports> {
  /** Token representing the module. Used by DI. */
  type: T;

  /** List of components to bootstrap. */
  bootstrap: Type<any>[];

  /** List of components, directives, and pipes declared by this module. */
  declarations: Type<any>[];

  /** List of modules or `ModuleWithProviders` imported by this module. */
  imports: Type<any>[];

  /**
   * List of modules, `ModuleWithProviders`, components, directives, or pipes exported by this
   * module.
   */
  exports: Type<any>[];

  /**
   * Cached value of computed `transitiveCompileScopes` for this module.
   *
   * This should never be read directly, but accessed via `transitiveScopesFor`.
   */
  transitiveCompileScopes: NgModuleTransitiveScopes|null;
}

/**
 * A wrapper around an NgModule that associates it with the providers.
 *
 * @param T the module type. In Ivy applications, this must be explicitly
 * provided.
 */
export interface ModuleWithProviders<T = any> {
  ngModule: Type<T>;
  providers?: Provider[];
}

/**
 * A schema definition associated with an NgModule.
 * 
 * @see `@NgModule`, `CUSTOM_ELEMENTS_SCHEMA`, `NO_ERRORS_SCHEMA`
 * 
 * @param name The name of a defined schema.
 *
 * @experimental
 */
export interface SchemaMetadata { name: string; }

/**
 * Defines a schema that allows an NgModule to contain the following:
 * - Non-Angular elements named with dash case (`-`).
 * - Element properties named with dash case (`-`).
 * Dash case is the naming convention for custom elements.
 *
 *
 */
export const CUSTOM_ELEMENTS_SCHEMA: SchemaMetadata = {
  name: 'custom-elements'
};

/**
 * Defines a schema that allows any property on any element.
 *
 * @experimental
 */
export const NO_ERRORS_SCHEMA: SchemaMetadata = {
  name: 'no-errors-schema'
};


/**
 * Type of the NgModule decorator / constructor function.
 *
 *
 */
export interface NgModuleDecorator {
  /**
   * Marks a class as an NgModule and supplies configuration metadata.
   */
  (obj?: NgModule): TypeDecorator;
  new (obj?: NgModule): NgModule;
}

/**
 * Type of the NgModule metadata.
 *
 * NgModule元数据的类型
 */
export interface NgModule {
  /**
   * The set of injectable objects that are available in the injector
   * of this module.
   * 
   * 在模块的注入器中可用的可注入对象的集合
   * 
   * @see [Dependency Injection guide](guide/dependency-injection)
   * @see [NgModule guide](guide/providers)
   * 
   * 参考依赖注入、NuModule指导
   *
   * @usageNotes
   *
   * Dependencies whose providers are listed here become available for injection
   * into any component, directive, pipe or service that is a child of this injector.
   * The NgModule used for bootstrapping uses the root injector, and can provide dependencies
   * to any part of the app.
   * 
   * 被依赖项的提供者列举在这里。对于此注入器的所有孩子，包括组件、指令、管道和服务，这些被依赖项
   * 都可以作为注入项而可用。
   * 
   * A lazy-loaded module has its own injector, typically a child of the app root injector.
   * Lazy-loaded services are scoped to the lazy-loaded module's injector.
   * If a lazy-loaded module also provides the `UserService`, any component created
   * within that module's context (such as by router navigation) gets the local instance
   * of the service, not the instance in the root injector. 
   * Components in external modules continue to receive the instance provided by their injectors.
   * 
   * 懒加载模块有自己的注入器，通常是应用根注入器的孩子。懒加载服务被scoped to懒加载模块的注入器。
   * 如果懒加载模块提供了UserService，在本模块上下文语境（例如路由导航）内创建的任何组件会得到这个服务的本地实例，
   * 而不是在根注入器的实例。外部模块的组件继续获得由他们的注入器所提供的实例。
   * 
   * ### Example
   *
   * The following example defines a class that is injected in
   * the HelloWorld NgModule:
   *
   * ```
   * class Greeter {
   *    greet(name:string) {
   *      return 'Hello ' + name + '!';
   *    }
   * }
   *
   * @NgModule({
   *   providers: [
   *     Greeter
   *   ]
   * })
   * class HelloWorld {
   *   greeter:Greeter;
   *
   *   constructor(greeter:Greeter) {
   *     this.greeter = greeter;
   *   }
   * }
   * ```
   */
  providers?: Provider[];

  /**
   * The set of components, directives, and pipes ([declarables](guide/glossary#declarable))
   * that belong to this module.
   * 
   * 归属于该模块的组件、指令和管道集合。参考declarable
   *
   * @usageNotes
   *
   * The set of selectors that are available to a template include those declared here, and
   * those that are exported from imported NgModules.
   * 
   * 对一个模块可用的选择器集合，包括在这里生命的那些，以及从所导入NgModule而导出的那些。
   *
   * Declarables must belong to exactly one module.
   * The compiler emits an error if you try to declare the same class in more than one module.
   * Be careful not to declare a class that is imported from another module.
   * 
   * 声明项必须严格的归属于一个模块。
   * 如果你视图在多余一个的模块中生命相同的类，编译器会报错。
   * 注意不要声明从其他模块所导入的类。
   *
   * ### Example
   *
   * The following example allows the CommonModule to use the `NgFor`
   * directive.
   *
   * ```javascript
   * @NgModule({
   *   declarations: [NgFor]
   * })
   * class CommonModule {
   * }
   * ```
   */
  declarations?: Array<Type<any>|any[]>;

  /**
   * The set of NgModules whose exported [declarables](guide/glossary#declarable)
   * are available to templates in this module.
   *
   * 此处所列举的NgModule集合，它所导出的声明项对于该模块中的模板都是可用的。
   * 
   * @usageNotes
   *
   * A template can use exported declarables from any
   * imported module, including those from modules that are imported indirectly
   * and re-exported.
   * For example, `ModuleA` imports `ModuleB`, and also exports
   * it, which makes the declarables from `ModuleB` available
   * wherever `ModuleA` is imported.
   * 
   * 模板可以使用任何导入的模块所导出的声明项，包括那些被模块间接导入并再次导出的。
   *
   * ### Example
   *
   * The following example allows MainModule to use anthing exported by
   * `CommonModule`:
   *
   * ```javascript
   * @NgModule({
   *   imports: [CommonModule]
   * })
   * class MainModule {
   * }
   * ```
   *
   */
  imports?: Array<Type<any>|ModuleWithProviders|any[]>;

  /**
   * The set of components, directives, and pipes declared in this
   * NgModule that can be used in the template of any component that is part of an
   * NgModule that imports this NgModule. Exported declarations are the module's public API.
   *
   * 当前NgModule所声明的组件、指令和管道集合，该NgMudule被另一个NgModule导入，
   * 后者所包含的任意组件的模块都可以实现这些声明项。导出的声明项是模块的公共API。
   * 
   * A declarable belongs to one and only one NgModule.
   * A module can list another module among its exports, in which case all of that module's
   * public declaration are exported.
   * 
   * 一个声明项属于并且仅属于一个NgModule。模块可以在其输出集合中什么另一个模块，在这种情况，后一个模块
   * 的所有公共声明都被导出。
   *
   * @usageNotes
   *
   * Declarations are private by default.
   * If this ModuleA does not export UserComponent, then only the components within this
   * ModuleA can use UserComponent.
   *
   * 声明项在默认情况下是私有的。如果ModuleA没有导出UserComponeng，则只有ModuleA内部的组件可以使用
   * UserComponent。
   * 
   * ModuleA can import ModuleB and also export it, making exports from ModuleB
   * available to an NgModule that imports ModuleA.
   * 
   * ModuleA可以导入ModuleB，也可以导出它，这样来自Moduleb的导出物对于将ModuleA导入的NgModule也是可用的。
   *
   * ### Example
   *
   * The following example exports the `NgFor` directive from CommonModule.
   *
   * ```javascript
   * @NgModule({
   *   exports: [NgFor]
   * })
   * class CommonModule {
   * }
   * ```
   */
  exports?: Array<Type<any>|any[]>;

  /**
   * The set of components to compile when this NgModule is defined,
   * so that they can be dynamically loaded into the view.
   * 
   * 当NgModule定义时需要编译的组件集合，这样这些组件就可以动态的导入到视图。
   *
   * For each component listed here, Angular creates a `ComponentFactory`
   * and stores it in the `ComponentFactoryResolver`.
   * 
   * 对于在这里列出的每一个组件，Angular都会创建一个ComponentFactory，
   * 将将其存储在ComponenentFactoryResolver。
   *
   * Angular automatically adds components in the module's bootstrap
   * and route definitions into the `entryComponents` list. Use this
   * option to add components that are bootstrapped
   * using one of the imperative techniques, such as `ViewContainerRef.createComponent()`.
   * 
   * Angular自动地将模块的启动和路由定义中的组件增加到entryComponent列表。
   * 使用这一选项用于增加通过imperative技术启动的组件，举个imperative技术的例子：ViewContainerRef.createComponent()
   * 
   * @see [Entry Components](guide/entry-components)
   */
  entryComponents?: Array<Type<any>|any[]>;

  /**
   * The set of components that are bootstrapped when
   * this module is bootstrapped. The components listed here
   * are automatically added to `entryComponents`.
   * 
   * 当Module启动时，需要启动的组件集合。
   * 这里所列举的组件会自动添加到entryComponents。
   * 
   */
  bootstrap?: Array<Type<any>|any[]>;

  /**
   * The set of schemas that declare elements to be allowed in the NgModule.
   * Elements and properties that are neither Angular components nor directives
   * must be declared in a schema.
   * 
   * 模式集合，描述在当前NgModule所允许的元素。
   * 那些既非Angular组件，也不是指令的元素和属性，必须在凡事中声明。
   *
   * Allowed value are `NO_ERRORS_SCHEMA` and `CUSTOM_ELEMENTS_SCHEMA`.
   * 
   * 允许NO_ERRORS_SCHEMA和CUSTOM_ELEMENTS_SCHEMA
   *
   * @security When using one of `NO_ERRORS_SCHEMA` or `CUSTOM_ELEMENTS_SCHEMA`
   * you must ensure that allowed elements and properties securely escape inputs.
   * 
   * 当使用NO_ERRORS_SCHEMA或CUSTOM_ELEMENTS_SCHEMA时，你必须保证所允许的元素和属性
   * 能够安全的escape输入。
   */
  schemas?: Array<SchemaMetadata|any[]>;

  /**
   * A name or path that uniquely identifies this NgModule in `getModuleFactory`.
   * If left `undefined`, the NgModule is not registered with
   * `getModuleFactory`.
   * 
   * 在getModuleFactory中为唯一标识这个NgModule的名字或者路径。
   * 如果为undefined，NgModule则未被getModuleFactory所注册。
   * 
   */
  id?: string;

  /**
   * If true, this module will be skipped by the AOT compiler and so will always be compiled
   * using JIT.
   *
   * 如果为真，则被AOT编译器所湖绿，并总是由JIT编译。
   * 
   * This exists to support future Ivy work and has no effect currently.
   * 
   * 用于支持未来的Ivy工作，当前没有任何作用
   */
  jit?: true;
}

/**
 * @Annotation
 */
export const NgModule: NgModuleDecorator = makeDecorator(
    'NgModule', (ngModule: NgModule) => ngModule, undefined, undefined,
    /**
     * Decorator that marks the following class as an NgModule, and supplies
     * configuration metadata for it.
     * 
     * 将随后定义的类修饰为NgModule，并提供配置元数据。
     *
     * * The `declarations` and `entryComponents` options configure the compiler
     * with information about what belongs to the NgModule.
     * * The `providers` options configures the NgModule's injector to provide
     * dependencies the NgModule members.
     * * The `imports` and `exports` options bring in members from other modules, and make
     * this module's members available to others.
     * 
     * * declarations和entryComponents选项为编译器配置那些属于这个NgModule。
     * * providers选项配置NgModule的注入器，为这个NgModule的成员提供依赖项。
     * * imports选项将其他模块的成员带入，exports将本模块的成员对外公开。
     */
    (type: Type<any>, meta: NgModule) => R3_COMPILE_NGMODULE(type, meta));

/**
 * @description
 * Hook for manual bootstrapping of the application instead of using bootstrap array in @NgModule
 * annotation.
 * 
 * 手动启动应用的钩子。不是使用@NgModule注解中的启动数组。
 *
 * Reference to the current application is provided as a parameter.
 * 
 * 当前应用的引用作为参数。
 *
 * See ["Bootstrapping"](guide/bootstrapping) and ["Entry components"](guide/entry-components).
 *
 * @usageNotes
 * ```typescript
 * class AppModule implements DoBootstrap {
 *   ngDoBootstrap(appRef: ApplicationRef) {
 *     appRef.bootstrap(AppComponent); // Or some other component
 *   }
 * }
 * ```
 *
 */
export interface DoBootstrap { ngDoBootstrap(appRef: ApplicationRef): void; }
