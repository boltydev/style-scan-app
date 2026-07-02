import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { RootNavigator } from './navigation/RootNavigator';
import { Colors } from './constants/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <RootNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
