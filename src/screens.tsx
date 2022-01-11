import {ComponentProvider, StyleProp, ViewStyle} from 'react-native';
import {
  Navigation,
  NavigationConstants,
  Constants,
  Options,
  NavigationFunctionComponent,
  NavigationComponentProps,
  LayoutComponent,
  LayoutRoot,
} from 'react-native-navigation';
import {Stack} from '.';
import {Component} from './layouts';
import pipe from 'lodash/flowRight';
import omit from 'lodash/omit';
import merge from 'lodash/merge';

type PVoid = Promise<void>;

type RegisterRootComponentEvents = {
  beforeStart?: () => PVoid;
};

export type ScreenComponent<Props = any> = NavigationFunctionComponent<Props>;

type ScreenInfo = {
  component: ScreenComponent<any>; // <any> is not 100% correct, can be done better
  options?: Options;
};
type ScreenInfo__MaybeFunc = ScreenInfo | (() => ScreenInfo);
type ScreenInfoWithName<ScreenName extends string = string> = ScreenInfo & {
  name: ScreenName;
};

type ScreenLayoutsWithName<ScreenName extends string = string> = {
  [key in ScreenName]: ScreenInfoWithName<ScreenName>;
};
export type ScreenLayouts<ScreenName extends string = string> = {
  [key in ScreenName]: ScreenInfo__MaybeFunc;
};

// not sure about this type 🤔
type Provider =
  | ((Component: ScreenComponent) => (props: NavigationComponentProps) => React.ReactElement)
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
  private Constants: NavigationConstants = DEFAULT_CONSTANTS;

  private Screens: ScreenLayoutsWithName<ScreenName>;
  private Providers: Provider[] = [];

  constructor(screens: ScreenLayouts<ScreenName>, withProviders: Provider[] = []) {
    this.Screens = screens as ScreenLayoutsWithName<ScreenName>; // a bit stupid logic as ScreenLayouts (from args) can contain function but it's taken care in registerScreens()
    this.Providers = withProviders;

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
        options: merge(s.options, options),
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
          options: merge(s.options, options),
        }),
      ),
    );
  }

  // Get methods
  get(name: ScreenName): LayoutComponent {
    if (!this.Screens[name]) {
      console.warn('[rnn-screens] Screen "name" was not registered');
    }

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
  private async registerScreens() {
    // setting `name` for screens based on provided keys
    Object.keys(this.Screens).forEach(key => {
      const name = key as ScreenName;

      // screen info can be function (in case we need to rely on translate service)
      const s = this.Screens[name] as ScreenInfo__MaybeFunc;
      const sWithName = typeof s === 'function' ? s() : s;

      this.Screens[name] = {
        ...sWithName,
        name,
      };
    });

    // registering screen components
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

// Similar to "register component" functions from react-native and Expo
export function registerRootComponent(
  root: () => LayoutRoot,
  events: RegisterRootComponentEvents = {},
) {
  Navigation.events().registerAppLaunchedListener(async () => {
    if (events.beforeStart) await events.beforeStart();

    await Navigation.setRoot(root());
  });
}
