import * as React from 'react';
import {ComponentProvider} from 'react-native';
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
import pipe from 'lodash/flowRight';
import omit from 'lodash/omit';
import merge from 'lodash/merge';

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

type ScreenInfoWithoutName = Omit<LayoutComponent, 'name'> & {
  component: NavigationFunctionComponent;
};
type ScreenInfo<ScreenName extends string = string> = ScreenInfoWithoutName & {
  name: ScreenName;
};

type ScreenLayouts<ScreenName extends string = string> = {
  [key in ScreenName]: ScreenInfo<ScreenName>;
};
type ScreenLayoutsWithoutName<ScreenName extends string = string> = {
  [key in ScreenName]: ScreenInfoWithoutName;
};

class Nav<ScreenName extends string = string> {
  private N = Navigation;
  Screens: ScreenLayouts<ScreenName>;
  Constants: NavigationConstants = Constants.getSync();

  constructor(
    screens: ScreenLayoutsWithoutName<ScreenName>,
    withProviders: ComponentProvider[] = [],
  ) {
    this.Screens = screens as any;
    // setting `name` for screens
    Object.keys(screens).forEach(key => {
      const snKey = key as ScreenName;
      this.Screens[snKey] = {
        ...screens[snKey],
        name: snKey,
      };
    });

    this.registerScreens(withProviders);
    this.registerListeners();
  }

  async push<T>(cId: string, name: ScreenName, passProps?: T, options?: Options): PVoid {
    const s = omit(this.Screens[name], 'component');

    await this.N.push(
      cId,
      Component({
        ...s,
        passProps,
        options: merge(s.options, options),
      }),
    );
  }

  pop = async (cId: string): PVoid => {
    await this.N.pop(cId);
  };

  async show<T>(name: ScreenName, passProps?: T, options?: Options): PVoid {
    const s = omit(this.Screens[name], 'component');

    this.N.showModal(
      Stack(
        Component({
          ...s,
          passProps,
          options: merge(s.options, options),
        }),
      ),
    );
  }

  private registerScreens(withProviders: ComponentProvider[] = []) {
    for (const [, info] of Object.entries(this.Screens)) {
      const {name, component} = info as ScreenInfo;

      this.N.registerComponent(
        name,
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
    this.Constants = Constants.getSync();
  }
}

// const n = new Nav<'one' | 'two'>({
//   one: {
//     component: () => <></>,
//   },
//   two: {
//     component: () => <></>,
//   },
// });

export {Nav, Root, BottomTabs, Stack, StackMany, Component};
