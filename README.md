<p align="center">
  <img src="https://xxx-files.ggc.team/oss/rnn-screens/rnn-screens-logo.png" width="80%" title="Logo">
</p>

Purpose of [RNN Screens](https://github.com/kanzitelli/rnn-screens) is to simplify and accelerate the process of React Native App development with [React Native Navigation](https://github.com/wix/react-native-navigation). It is not a replacement for RNN but a good addition!

### Quick start

Make sure you have [react-native-navigation](https://github.com/wix/react-native-navigation) installed in your project.

```
yarn add rnn-screens
```

### Usage

#### 1. Describe app's screens

```tsx
import {generateRNNScreens, Root, Stack, Component, BottomTabs} from 'rnn-screens';

export const screens = generateRNNScreens<'Main' | 'Settings'>({
  Main: {
    component: Main,
    options: {
      topBar: {
        title: {
          text: 'Home',
        },
      },
    },
  },
  Settings: {
    component: Settings,
    options: {
      topBar: {
        title: {
          text: 'Settings',
        },
      },
    },
  },
});
```

#### 2. Set app's navigation root

```tsx
// One screen app
screens.N.setRoot(Root(Stack(Component(screens.get('Main')))));

// Tab based app
screens.N.setRoot(
  Root(
    BottomTabs([
      Stack(Component(screens.get('Main'))),
      Stack(Component(screens.get('Settings'))),
    ]),
  ),
);
```

#### 3. Navigate with predictability

```tsx
// push screen
screens.push(componentId, 'Example');

// show modal
screens.show('Example');

// push screen with passProps
screens.push<ExampleScreenProps>(
  componentId,
  'Example',
  { value: randomNum() },
)
```

An integration example could be found at [kanzitelli/rnn-starter](https://github.com/kanzitelli/rnn-starter).

### Credits

Thanks to the team @ Wix behind [React Native Navigation](https://github.com/wix/react-native-navigation)!

### License

This project is [MIT licensed](https://github.com/kanzitelli/rnn-screens/blob/master/LICENSE.md)