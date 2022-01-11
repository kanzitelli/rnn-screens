<p align="center">
  <img src="https://xxx-files.ggc.team/oss/rnn-screens/cover.png" width="80%" title="Logo">
</p>

## Goal

The goal of [RNN Screens](https://github.com/kanzitelli/rnn-screens) is to provide React Native developers with more simplified and predictable way of Navigation. It's build on top of [React Native Navigation](https://github.com/wix/react-native-navigation).

☣️ `Experiment`. This library is an experiment and may have breaking changes in the future.

## Quick start

Make sure you have [react-native-navigation](https://github.com/wix/react-native-navigation) installed in your project.

#### 1. Install RNN Screens

```
> yarn add rnn-screens
```

#### 2. Install and link [React Native Navigation](https://github.com/wix/react-native-navigation)

```
> yarn add react-native-navigation
> npx rnn-link
```

#### 3. Install pods

```
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
import {generateRNNScreens, Root, Screen, ScreenComponent} from 'rnn-screens';

const Main: ScreenComponent = ({componentId}) => {
  return <>...</>;
};

type SettingsProps = {
  type: 'push' | 'show';
};
const Settings: ScreenComponent<SettingsProps> = ({componentId, type}) => {
  return <>...</>;
};
```

#### 3. Describe screens

```tsx
import {generateRNNScreens, Root, Stack, Component, BottomTabs} from 'rnn-screens';

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

#### 4. Build `App` component

```tsx
const App = () => Root(Screen(screens.get('Main')));
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
