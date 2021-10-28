import {
  Layout,
  LayoutRoot,
  LayoutTabsChildren,
  Options,
  LayoutStackChildren,
  LayoutComponent,
} from 'react-native-navigation';

export const Root = (root: Layout): LayoutRoot => ({root});
export const BottomTabs = (children?: LayoutTabsChildren[], options?: Options): Layout => ({
  bottomTabs: {children, options},
});
export const StackMany = (children?: LayoutStackChildren[], options?: Options): Layout => ({
  stack: {children, options},
});
export const Stack = (c: LayoutStackChildren, options?: Options): Layout => StackMany([c], options);
export const Component = <P,>(component: LayoutComponent<P>): Layout => ({component});
