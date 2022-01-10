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
export const Stack = (component: LayoutStackChildren, options?: Options): Layout =>
  StackMany([component], options);
export const Component = <P,>(component: LayoutComponent<P>): Layout => ({component});
export const Screen = <P,>(component: LayoutComponent<P>): Layout => Stack(Component(component));
export const RootScreen = <P,>(component: LayoutComponent<P>): LayoutRoot =>
  Root(Stack(Component(component)));
