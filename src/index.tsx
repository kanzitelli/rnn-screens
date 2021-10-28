import * as React from 'react';

import {Provider, ScreenLayoutsWithoutName, Screens} from './screens';
import {BottomTabs, Component, Root, Stack, StackMany} from './layouts';

function generateRNNScreens<ScreenName extends string = string>(
  screens: ScreenLayoutsWithoutName<ScreenName>,
  withProviders: Provider[] = [],
) {
  return new Screens<ScreenName>(screens, withProviders);
}

export {generateRNNScreens, Root, BottomTabs, Stack, StackMany, Component};
