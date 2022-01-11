<p align="center">
  <img src="https://xxx-files.ggc.team/oss/rnn-screens/cover.png" width="80%" title="Logo">
</p>

☣️ `Experiment` <i>This is an experimental library and may have breaking changes in the future.</i>

## Goal

The goal of [RNN Screens](https://github.com/kanzitelli/rnn-screens) is to provide React Native developers with more simplified and predictable Navigation. It's built on top of [React Native Navigation](https://github.com/wix/react-native-navigation).

## Quick start

#### 1. Install RNN Screens

```
> yarn add rnn-screens
```

#### 2. Install and link [React Native Navigation](https://github.com/wix/react-native-navigation)

```
> yarn add react-native-navigation
> npx rnn-link
> npx pod-install
```

If you had problems installing RNN, please follow more [detailed tutorial](https://wix.github.io/react-native-navigation/docs/installing)

## Usage

#### 1. Update `index.js`

```tsx
import {registerRootComponent} from 'rnn-screens';
import App from './App';

registerRootComponent(App);
```

#### 2. Build components (ex., in `App.tsx`)

```tsx
import {generateRNNScreens, Root, BottomTabs, Screen, ScreenComponent} from 'rnn-screens';

const Main: ScreenComponent = ({componentId}) => {
  return <>...</>;
};

type SettingsProps = {type: 'push' | 'show'};
const Settings: ScreenComponent<SettingsProps> = ({componentId, type}) => {
  return <>...</>;
};
```

#### 3. Describe screens

```tsx
const screens = generateRNNScreens({
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
// single screen app
const App = () => Root(Screen(screens.get('Main')));

// tab based app
const TabsApp = () =>
  Root(
    BottomTabs([
      Screen(screens.get('Main')),
      Screen(screens.get('Settings')),
    ]),
  );
```

#### 5. Navigate with predictability

```tsx
// push screen
screens.push(componentId, 'Settings');

// show modal
screens.show('Settings');

// push screen with passProps
screens.push<SettingsProps>(componentId, 'Settings', {type: 'push'});

// use RNN Navigation instance
screens.N.dismissAllModals();
```

A simple example of RNN Screens integration is located under `example/` folder.

If you'd like to see more advanced example with translation service and other stuff, check out [kanzitelli/rnn-starter](https://github.com/kanzitelli/rnn-starter).

## Enhancements

- [ ] Better documentation
- [ ] Build an OSS React Native app with RNN Screens.

Feel free to open an issue for suggestions.

## Credits

Thanks to the team @ Wix behind [React Native Navigation](https://github.com/wix/react-native-navigation)!

## License

This project is [MIT licensed](https://github.com/kanzitelli/rnn-screens/blob/master/LICENSE.md)
