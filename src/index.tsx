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
type ScreenInfo<ScreenName extends string = string> = Omit<LayoutComponent, 'name'> & {
  name?: ScreenName;
  component: NavigationFunctionComponent;
};
type ScreenLayouts<ScreenName extends string = string> = {
  [key in ScreenName]: ScreenInfo<ScreenName>;
};

class Nav<ScreenName extends string = string> {
  private N = Navigation;
  private screens: ScreenLayouts<ScreenName>;
  C: NavigationConstants = Constants.getSync();

  constructor(screens: ScreenLayouts<ScreenName>, withProviders: ComponentProvider[] = []) {
    this.screens = screens;

    this.registerScreens(withProviders);
    this.registerListeners();
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

  private registerScreens(withProviders: ComponentProvider[] = []) {
    for (const [key, info] of Object.entries(this.screens)) {
      const {component} = info as ScreenInfo;

      // writing name as key
      const sName = key as ScreenName;
      this.screens[sName].name = sName;

      this.N.registerComponent(
        sName,
        pipe(withProviders, () => component),
        () => component,
      );
    }
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

const n = new Nav<'one' | 'two'>({
  one: {
    component: () => <></>,
  },
  two: {
    component: () => <></>,
  },
});

export {Nav, Root, BottomTabs, Stack, StackMany, Component};
