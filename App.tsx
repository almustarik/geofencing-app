import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import EditGeoFenceScreen from './src/screens/EditGeoFenceScreen';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import SplashScreen from './src/screens/SplashScreen';
import ViewMapScreen from './src/screens/ViewMapScreen';
import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => (
  <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="ViewMapScreen" component={ViewMapScreen} />
        <Stack.Screen
          name="EditGeoFenceScreen"
          component={EditGeoFenceScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>
);

export default App;
