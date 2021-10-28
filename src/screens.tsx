import {ComponentProvider} from 'react-native';
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
import merge from 'lodash/merge';

type PVoid = Promise<void>;

export type ScreenInfoWithoutName = Omit<LayoutComponent, 'name'> & {
  component: NavigationFunctionComponent;
};
export type ScreenInfo<ScreenName extends string = string> = ScreenInfoWithoutName & {
  name: ScreenName;
};

export type ScreenLayouts<ScreenName extends string = string> = {
  [key in ScreenName]: ScreenInfo<ScreenName>;
};
export type ScreenLayoutsWithoutName<ScreenName extends string = string> = {
  [key in ScreenName]: ScreenInfoWithoutName;
};

export type Provider =
  | ((C: NavigationFunctionComponent) => (props: NavigationComponentProps) => React.ReactElement)
  | ComponentProvider;

export class Screens<ScreenName extends string = string> {
  N = Navigation;
  private Screens: ScreenLayouts<ScreenName>;
  private Constants: NavigationConstants = Constants.getSync();

  constructor(screens: ScreenLayoutsWithoutName<ScreenName>, withProviders: Provider[] = []) {
    this.Screens = screens as any;

    // setting `name` for screens based on provided keys
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
  get() {
    return this.Screens;
  }

  getOne(name: ScreenName) {
    return this.Screens[name];
  }

  getConstants() {
    this.Constants = Constants.getSync();

    return this.Constants;
  }

  // Private methods
  private registerScreens(withProviders: Provider[] = []) {
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
}
