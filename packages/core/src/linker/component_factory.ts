/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectorRef} from '../change_detection/change_detection';
import {Injector} from '../di/injector';
import {Type} from '../type';

import {ElementRef} from './element_ref';
import {NgModuleRef} from './ng_module_factory';
import {ViewRef} from './view_ref';

/**
<<<<<<< HEAD
 * Represents an instance of a Component created via a {@link ComponentFactory}.
 *
 * `ComponentRef` provides access to the Component Instance as well other objects related to this
 * Component Instance and allows you to destroy the Component Instance via the {@link #destroy}
 * method.
 * 
 * ComponentRef代表了由ComponentFactory创建的Component实例
=======
 * Represents a component created by a `ComponentFactory`.
 * Provides access to the component instance and related objects,
 * and provides the means of destroying the instance.
>>>>>>> upstream/master
 *
 */
export abstract class ComponentRef<C> {
  /**
<<<<<<< HEAD
   * Location of the Host Element of this Component Instance.
   * Component实例的宿主元素的位置
=======
   * The host or anchor [element](guide/glossary#element) for this component instance.
>>>>>>> upstream/master
   */
  abstract get location(): ElementRef;

  /**
<<<<<<< HEAD
   * The injector on which the component instance exists.
   * Component实例存在的注入器
=======
   * The [dependency injector](guide/glossary#injector) for this component instance.
>>>>>>> upstream/master
   */
  abstract get injector(): Injector;

  /**
<<<<<<< HEAD
   * The instance of the Component.
   * Component实例
=======
   * This component instance.
>>>>>>> upstream/master
   */
  abstract get instance(): C;

  /**
<<<<<<< HEAD
   * The {@link ViewRef} of the Host View of this Component instance.
   * Component实例的宿主视图
=======
   * The [host view](guide/glossary#view-tree) defined by the template
   * for this component instance.
>>>>>>> upstream/master
   */
  abstract get hostView(): ViewRef;

  /**
<<<<<<< HEAD
   * The {@link ChangeDetectorRef} of the Component instance.
   * Component实例的ChangeDetector更改监测
=======
   * The change detector for this component instance.
>>>>>>> upstream/master
   */
  abstract get changeDetectorRef(): ChangeDetectorRef;

  /**
   * The component type.
   * 组件类型
   */
  abstract get componentType(): Type<any>;

  /**
   * Destroys the component instance and all of the data structures associated with it.
   * 注销Component实例以及和它关联的所有数据结构
   */
  abstract destroy(): void;

  /**
<<<<<<< HEAD
   * Allows to register a callback that will be called when the component is destroyed.
   * 注册回到函数，当Component注销时，函数被调用
=======
   * A lifecycle hook that provides additional developer-defined cleanup
   * functionality for the component.
   * @param callback A handler function that cleans up developer-defined data
   * associated with this component. Called when the `destroy()` method is invoked.
>>>>>>> upstream/master
   */
  abstract onDestroy(callback: Function): void;
}

export abstract class ComponentFactory<C> {
  /**
   * The comonent's HTML selector.
   */
  abstract get selector(): string;
  /**
   * The component's type
   */
  abstract get componentType(): Type<any>;
  /**
   * Selector for all <ng-content> elements in the component.
   */
  abstract get ngContentSelectors(): string[];
  /**
   * The inputs of the component.
   */
  abstract get inputs(): {propName: string, templateName: string}[];
  /**
   * The outputs of the component.
   */
  abstract get outputs(): {propName: string, templateName: string}[];
  /**
   * Creates a new component.
   */
  abstract create(
      injector: Injector, projectableNodes?: any[][], rootSelectorOrNode?: string|any,
      ngModule?: NgModuleRef<any>): ComponentRef<C>;
}
