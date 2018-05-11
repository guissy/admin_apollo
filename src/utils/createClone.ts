import React from 'react';

type CloneProps = { canClone: boolean; isCloned: boolean };

/**
 * 用于跨组件复制指定组件
 *
 * @example
 * // 可复制的组件
 * const { withClone, cloneElement } = createClone();
 * export const clonedMyComponent = cloneElement;
 * withClone(class MyComponent() {})
 *
 * // 容器组件A
 * <MyComponent canClone={true} />
 *
 * // 容器组件B（复制 组件A 的 MyComponent 到 组件B）
 * <div> {clonedMyComponent()} </div>
 *
 */
export default function createClone() {
  const buttonBarRef = React.createRef();
  return {
    /** 导出方法：在容器组件B里调用 */
    cloneElement<P>() {
      let newer = null;
      if (buttonBarRef && buttonBarRef.current) {
        const component = buttonBarRef.current as React.PureComponent<CloneProps & P>;
        const element = component.render() as React.ReactElement<CloneProps & P>;
        if (element && component.props.canClone) {
          newer = React.cloneElement(element, { ...(component.props as any), isCloned: true }); // tslint:disable-line
        }
      }
      return newer;
    },
    /** 高阶组件：用于可复制的组件 */
    withClone<P>(WrappedComponent: React.ComponentClass<P>) {
      class WrapButtonBar extends React.PureComponent<P> {
        render() {
          const { children, ...props } = this.props as object & { children: React.ReactNode };
          let ref = {};
          if (WrappedComponent.prototype.hasOwnProperty('render')) {
            ref = { ref: buttonBarRef };
          }
          const propsOk = { ...ref, ...props } as any; // tslint:disable-line
          return React.createElement(WrappedComponent, propsOk, children);
        }
      }
      return WrapButtonBar as React.ComponentClass<P>;
    }
  };
}
