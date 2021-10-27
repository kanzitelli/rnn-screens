import * as React from 'react';
import {
  Options,
  Layout,
  LayoutStackChildren,
  LayoutRoot,
  LayoutTabsChildren,
  LayoutComponent,
  Constants,
  Navigation,
  NavigationConstants,
} from 'react-native-navigation';

// ==========
// | Layout |
// ==========

const Root = (root: Layout): LayoutRoot => ({root});
const BottomTabs = (children?: LayoutTabsChildren[], options?: Options): Layout => ({
  bottomTabs: {children, options},
});
const StackMany = (children?: LayoutStackChildren[], options?: Options): Layout => ({
  stack: {children, options},
});
const Stack = (c: LayoutStackChildren, options?: Options): Layout => StackMany([c], options);
const Component = <P,>(component: LayoutComponent<P>): Layout => ({component});
export {Root, BottomTabs, Stack, StackMany, Component};

// ==============
// | Navigation |
// ==============

class Nav {
  private inited = false;
  private N = Navigation;
  C: NavigationConstants = Constants.getSync();

  init = (): void => {
    if (!this.inited) {
      this.registerListeners();

      this.inited = true;
    }
  };

  private registerListeners = () => {
    this.N.events().registerComponentWillAppearListener(() => {
      this.getConstants();
    });
  };

  private getConstants = async () => {
    this.C = Constants.getSync();
  };
}

export default new Nav();
