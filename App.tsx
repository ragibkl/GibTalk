import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>GibTalk - Alpha</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <View style={styles.current}>
            <Text style={styles.currentText}>Drag downward to remove</Text>
          </View>

          <View style={styles.controls}>
            <Text>Play</Text>
            <Text>Clear</Text>
          </View>

        </View>

        <View style={styles.bodyBottom}>
          <Text>Body</Text>
        </View>
      </View>

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
    height: '6%',
    paddingHorizontal: 5,
  },
  headerText: {
    color: 'white'
  },
  body: {
    backgroundColor: 'orange',
    flex: 1,
    padding: 5,
  },
  bodyTop: {
    flexDirection: 'row',
    height: '15%',
  },
  current: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    flex: 1,
  },
  currentText: {
    alignSelf: 'center',
    marginTop: '2%',
    position: 'absolute',
  },
  controls: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    flexDirection: 'row',
    marginLeft: 5,
  },
  bodyBottom: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    flex: 1,
    marginTop: 5,
  },
});
