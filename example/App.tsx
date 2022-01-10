import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {generateRNNScreens, Root, Screen, ScreenComponent} from 'rnn-screens';

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const textStyle = {color: isDarkMode ? '#fff' : '#000'};
  return (
    <View style={S.sectionContainer}>
      <Text style={[S.sectionTitle, textStyle]}>{title}</Text>
      <View>{children}</View>
    </View>
  );
};

const Main: ScreenComponent = ({componentId}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {backgroundColor: isDarkMode ? '#000' : '#fff'};
  const container = [S.f1, backgroundStyle];

  const push = () =>
    screens.push<SettingsProps>(componentId, 'Settings', {type: 'push'});
  const show = () => screens.show<SettingsProps>('Settings', {type: 'show'});

  return (
    <SafeAreaView style={container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={container}>
        <Section title="Navigation">
          <Button title="Push Settings" onPress={push} />
          <Button title="Show Settings" onPress={show} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

type SettingsProps = {
  type: 'push' | 'show';
};
const Settings: ScreenComponent<SettingsProps> = ({componentId, type}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {backgroundColor: isDarkMode ? '#000' : '#fff'};
  const container = [S.f1, backgroundStyle];

  const goBack = async () => {
    if (type === 'push') {
      screens.pop(componentId);
    }
    if (type === 'show') {
      screens.N.dismissAllModals();
    }
  };

  return (
    <SafeAreaView style={container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={container}>
        <Section title={`Navigation (type = "${type}")`}>
          <Button title="Go back" onPress={goBack} />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const S = StyleSheet.create({
  f1: {flex: 1},
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
});

// ==============
// | Navigation |
// ==============
const screens = generateRNNScreens({
  Main: {
    component: Main,
    options: {
      topBar: {
        title: {text: 'Main'},
      },
    },
  },
  Settings: {
    component: Settings,
    options: {
      topBar: {
        title: {text: 'Settings'},
      },
    },
  },
});
const App = () => Root(Screen(screens.get('Main')));

export default App;
