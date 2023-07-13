import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';

import MainScreen from './src/screens/main/MainScreen';
import CreateWordScreen from './src/screens/addWord/CreateWordScreen';

const Stack = createStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  createWord: undefined,
};

export default function App() {
  const screenOptions = {
    headerStyle: {
      height: 60,
    },
    headerTitleStyle: {
      fontSize: 16,
      bottom: 5,
    },
    headerBackTitleStyle: {
      marginBottom: 15,
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name="Home"
            component={MainScreen}
            options={{ title: 'GibTalk - Development' }}
          />
          <Stack.Screen
            name="createWord"
            component={CreateWordScreen}
            options={{ title: 'Add New Word' }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'black',
    flexDirection: 'row',
    height: 25,
    paddingHorizontal: 5,
  },
  headerText: {
    color: 'white'
  },
});
