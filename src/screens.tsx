import {ComponentProvider, StyleProp, ViewStyle} from 'react-native';
import {
  Navigation,
  NavigationConstants,
  Constants,
  Options,
  NavigationFunctionComponent,
  NavigationComponentProps,
  LayoutComponent,
} from 'react-native-navigation';
import {Stack} from '.';
import {Component} from './layouts';
import pipe from 'lodash/flowRight';
import omit from 'lodash/omit';

type PVoid = Promise<void>;

type ScreenInfo = Omit<LayoutComponent, 'name'> & {
  component: NavigationFunctionComponent;
};
type ScreenInfoWithName<ScreenName extends string = string> = ScreenInfo & {
  name: ScreenName;
};

type ScreenLayoutsWithName<ScreenName extends string = string> = {
  [key in ScreenName]: ScreenInfoWithName<ScreenName>;
};
export type ScreenLayouts<ScreenName extends string = string> = {
  [key in ScreenName]: ScreenInfo;
};

// not sure about this type 🤔
type Provider =
  | ((
      Component: NavigationFunctionComponent,
    ) => (props: NavigationComponentProps) => React.ReactElement)
  | (<P = any>(
      Component: React.ComponentType<P>,
      containerStyles?: StyleProp<ViewStyle>,
    ) => React.ComponentType<P>)
  | ComponentProvider;

const DEFAULT_CONSTANTS: NavigationConstants = {
  statusBarHeight: 0,
  backButtonId: 'back',
  topBarHeight: 0,
  bottomTabsHeight: 0,
};

export class Screens<ScreenName extends string = string> {
  N = Navigation;
  private Screens: ScreenLayoutsWithName<ScreenName>;
  private Constants: NavigationConstants = DEFAULT_CONSTANTS;
  private Providers: Provider[] = [];

  constructor(screens: ScreenLayouts<ScreenName>, withProviders: Provider[] = []) {
    this.Screens = screens as any;
    this.Providers = withProviders;

    // setting `name` for screens based on provided keys
    Object.keys(screens).forEach(key => {
      const snKey = key as ScreenName;

      this.Screens[snKey] = {
        ...screens[snKey],
        name: snKey,
      };
    });

    this.registerScreens();
    this.registerListeners();
  }

  // Navigation methods
  async push<T>(cId: string, name: ScreenName, passProps?: T, options?: Options): PVoid {
    const s = omit(this.Screens[name], 'component');

    await this.N.push(
      cId,
      Component({
        ...s,
        passProps,
        options: {...s.options, ...options},
      }),
    );
  }

  async pop(cId: string): PVoid {
    await this.N.pop(cId);
  }

  async show<T>(name: ScreenName, passProps?: T, options?: Options): PVoid {
    const s = omit(this.Screens[name], 'component');

    this.N.showModal(
      Stack(
        Component({
          ...s,
          passProps,
          options: {...s.options, ...options},
        }),
      ),
    );
  }

  // Get methods
  get(name: ScreenName) {
    return this.Screens[name];
  }

  getAll() {
    return this.Screens;
  }

  getConstants() {
    this.Constants = Constants.getSync();

    return this.Constants;
  }

  // Private methods
  private registerScreens() {
    for (const [, info] of Object.entries(this.Screens)) {
      const {name, component} = info as ScreenInfoWithName;

      this.N.registerComponent(
        name,
        pipe(this.Providers, () => component),
        () => component,
      );
    }
  }

  private registerListeners() {
    this.N.events().registerComponentWillAppearListener(() => {
      this.getConstants();
    });
  }
}

export function generateRNNScreens<ScreenName extends string = string>(
  screens: ScreenLayouts<ScreenName>,
  withProviders: Provider[] = [],
) {
  return new Screens<ScreenName>(screens, withProviders);
}
