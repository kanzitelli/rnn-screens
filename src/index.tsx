import * as React from 'react';
import {ComponentProvider} from 'react-native';
import pipe from 'lodash/flowRight';
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
  NavigationFunctionComponent,
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

// ==============
// | Navigation |
// ==============

type PVoid = Promise<void>;
type ScreenInfo = {
  component: NavigationFunctionComponent;
  options: Options;
};
type ScreenLayouts<ScreenName extends string = string> = {
  [key in ScreenName]: ScreenInfo;
};

class Nav<ScreenName extends string = string> {
  private N = Navigation;
  private screens: ScreenLayouts<ScreenName>;
  C: NavigationConstants = Constants.getSync();

  constructor(screens: ScreenLayouts<ScreenName>, withWrappers: ComponentProvider[] = []) {
    this.screens = screens;

    this.registerScreens(screens, withWrappers);
    this.registerListeners();
  }

  private registerScreens(
    screens: ScreenLayouts<ScreenName>,
    withWrappers: ComponentProvider[] = [],
  ) {
    this.screens = screens;

    for (const [key, value] of Object.entries(screens)) {
      const {component} = value as ScreenInfo;

      this.N.registerComponent(
        key,
        pipe(withWrappers, () => component),
        () => component,
      );
    }
  }

  async push<T>(cId: string, name: ScreenName, passProps?: T, options?: Options): PVoid {
    const s = this.screens[name];

    await this.N.push(
      cId,
      Component({
        name,
        ...s,
        passProps,
        options: {
          ...s.options,
          ...options,
        },
      }),
    );
  }

  pop = async (cId: string): PVoid => {
    await this.N.pop(cId);
  };

  async show<T>(name: ScreenName, passProps?: T, options?: Options): PVoid {
    const sl = this.screens[name];

    this.N.showModal(
      Stack(
        Component({
          name,
          ...sl,
          passProps,
          options: {
            ...sl.options,
            ...options,
          },
        }),
      ),
    );
  }

  private registerListeners() {
    this.N.events().registerComponentWillAppearListener(() => {
      this.getConstants();
    });
  }

  private getConstants() {
    this.C = Constants.getSync();
  }
}

export {Nav, Root, BottomTabs, Stack, StackMany, Component};
