<p align="center">
  <img src="https://xxx-files.ggc.team/oss/rnn-screens/cover.png" width="80%" title="Logo">
</p>

☣️ `Experiment` <i>This is an experimental library and may have breaking changes in the future.</i>

## Goal

The goal of [RNN Screens](https://github.com/kanzitelli/rnn-screens) is to provide React Native developers with more simplified and predictable Navigation. It's built on top of [React Native Navigation](https://github.com/wix/react-native-navigation).

## Quick start

### Starters

1. [starters-dev/rnn-with-expo](https://github.com/starters-dev/rnn-with-expo) - minimalistic starter with React Native Navigation, Expo Modules and **RNN Screens**.

2. [rnn-starter](https://github.com/kanzitelli/rnn-starter) - more advanced starter that is powered by cli-rn, React Native Navigation, Expo Modules, **RNN Screens**, RN UI lib, MMKV, Mobx, Reanimated 2, Dark Mode, Localization, Notifications, Permissions, and much more.

### Bare RNN

#### 1. Install [React Native Navigation](https://github.com/wix/react-native-navigation) and RNN Screens

```
> yarn add react-native-navigation rnn-screens
> npx rnn-link
> npx pod-install
```

If you had problems installing RNN, please follow more [detailed tutorial](https://wix.github.io/react-native-navigation/docs/installing)

#### 2. Build screen components

```tsx
import {generateRNNScreens, Root, BottomTabs, Screen, ScreenComponent} from 'rnn-screens';

// src/screens/main.tsx
export const Main: ScreenComponent = ({componentId}) => {
  return <>...</>;
};

// src/screens/settings.tsx
type SettingsProps = {type: 'push' | 'show'};
export const Settings: ScreenComponent<SettingsProps> = ({componentId, type}) => {
  return <>...</>;
};
```

#### 3. Describe screens

```tsx
// src/screens/index.tsx

import {generateRNNScreens} from 'rnn-screens';
import {Main} from './main';
import {Settings} from './settings';

export const screens = generateRNNScreens({
  Main: {
    component: Main,
    options: {
      topBar: {title: {text: 'Home'}},
    },
  },
  Settings: {
    component: Settings,
    options: {
      topBar: {title: {text: 'Settings'}},
    },
  },
});
```

#### 4. Build root component

```tsx
// App.tsx

// single screen app
export const App = () => Root(Screen(screens.get('Main')));

// tab based app
export const TabsApp = () =>
  Root(
    BottomTabs([
      Screen(screens.get('Main')),
      Screen(screens.get('Settings'))
    ])
  );
```

#### 5. Update `index.js`

```tsx
// index.js

import {registerRootComponent} from 'rnn-screens';
import {App} from './App';

registerRootComponent(App);
```

#### 6. Navigate with predictability

```tsx
// navigate from any screen

// push screen
screens.push(componentId, 'Settings');

// show modal
screens.show('Settings');

// push screen with passProps
screens.push<SettingsProps>(componentId, 'Settings', {type: 'push'});

// use RNN Navigation instance
screens.N.dismissAllModals();
```

## Enhancements

Feel free to open an issue for suggestions.

## Credits

Thanks to the [React Native Navigation](https://github.com/wix/react-native-navigation) team @ Wix!

## License

This project is [MIT licensed](https://github.com/kanzitelli/rnn-screens/blob/master/LICENSE.md)
