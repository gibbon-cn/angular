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
 * Represents an instance of a Component created via a {@link ComponentFactory}.
 *
 * `ComponentRef` provides access to the Component Instance as well other objects related to this
 * Component Instance and allows you to destroy the Component Instance via the {@link #destroy}
 * method.
 * 
 * ComponentRef代表了由ComponentFactory创建的Component实例
 *
 */
export abstract class ComponentRef<C> {
  /**
   * Location of the Host Element of this Component Instance.
   * Component实例的宿主元素的位置
   */
  abstract get location(): ElementRef;

  /**
   * The injector on which the component instance exists.
   * Component实例存在的注入器
   */
  abstract get injector(): Injector;

  /**
   * The instance of the Component.
   * Component实例
   */
  abstract get instance(): C;

  /**
   * The {@link ViewRef} of the Host View of this Component instance.
   * Component实例的宿主视图
   */
  abstract get hostView(): ViewRef;

  /**
   * The {@link ChangeDetectorRef} of the Component instance.
   * Component实例的ChangeDetector更改监测
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
   * Allows to register a callback that will be called when the component is destroyed.
   * 注册回到函数，当Component注销时，函数被调用
   */
  abstract onDestroy(callback: Function): void;
}

export abstract class ComponentFactory<C> {
  abstract get selector(): string;
  abstract get componentType(): Type<any>;
  /**
   * selector for all <ng-content> elements in the component.
   */
  abstract get ngContentSelectors(): string[];
  /**
   * the inputs of the component.
   */
  abstract get inputs(): {propName: string, templateName: string}[];
  /**
   * the outputs of the component.
   */
  abstract get outputs(): {propName: string, templateName: string}[];
  /**
   * Creates a new component.
   */
  abstract create(
      injector: Injector, projectableNodes?: any[][], rootSelectorOrNode?: string|any,
      ngModule?: NgModuleRef<any>): ComponentRef<C>;
}
