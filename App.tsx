import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>GibTalk - Alpha</Text>
      </View>
      
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'black',
    height: '6%',
    alignSelf: 'stretch',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  headerText: {
    color: 'white'
  },
});
