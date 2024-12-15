import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import HomeScreen from './src/screens/HomeScreen';
import BoardScreen from './src/screens/BoardScreen';
import { BoardsProvider } from './src/context/BoardsContext';


const Stack = createStackNavigator();

export default function App() {
  return (
    <BoardsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Board" component={BoardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </BoardsProvider>
  );
}
