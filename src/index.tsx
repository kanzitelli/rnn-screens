import * as React from 'react';
import {Navigation} from 'react-native-navigation';
import {
  Options,
  Layout,
  LayoutStackChildren,
  LayoutRoot,
  LayoutTabsChildren,
  LayoutComponent,
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
