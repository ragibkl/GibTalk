import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';

import HistoryItem from './components/HistoryItem';
import WordItem from './components/WordItem';
import IconButton from './components/IconButton';

export type Word = {
  label: string,
  uri: string,
};

const words: Word[] = [
  { label: 'Yes', uri: 'https://www.senteacher.org/fullsymbol/arasaac/5584/' },
  { label: 'No', uri: 'https://www.senteacher.org/fullsymbol/arasaac/5526/' },
  { label: 'Up', uri: 'https://www.senteacher.org/fullsymbol/mulberry/up.png/' },
  { label: 'Down', uri: 'https://www.senteacher.org/fullsymbol/mulberry/down.png/' },
  { label: 'Good Job', uri: 'https://www.senteacher.org/fullsymbol/mulberry/good.png/' },
  { label: 'Stop', uri: 'https://www.senteacher.org/fullsymbol/arasaac/8289/' },
  { label: 'Go', uri: 'https://www.senteacher.org/fullsymbol/arasaac/21395/' },
  { label: 'Wait', uri: 'https://www.senteacher.org/fullsymbol/arasaac/16697/' },
  { label: 'Run', uri: 'https://www.senteacher.org/fullsymbol/mulberry/run_,_to.png/' },
  { label: 'Walk', uri: 'https://www.senteacher.org/fullsymbol/arasaac/3251/' },
  { label: 'Jump', uri: 'https://www.senteacher.org/fullsymbol/arasaac/28443/' },
  { label: 'Turn around', uri: 'https://www.senteacher.org/fullsymbol/mulberry/around.png/' },
  { label: 'Go Up', uri: 'https://www.senteacher.org/fullsymbol/arasaac/6617/' },
];

function renderHistoryItem(item: Word, i: number) {
  return (
    <HistoryItem key={i} label={item.label} uri={item.uri} />
  )
}

function renderWordItem(item: Word, onPress: (item: Word) => void) {
  return (
    <WordItem key={item.label} label={item.label} uri={item.uri} onPress={() => onPress(item)} />
  )
}

export default function App() {
  const [historyItems, setHistoryItems] = useState([]);

  const onPressClear = () => {
    setHistoryItems([]);
  }

  const onPressPlay = () => {
    historyItems.forEach(item => {
      Speech.speak(item.label);
    })
  }

  const onPressWord = (item: Word) => {
    setHistoryItems([...historyItems, item]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>GibTalk - Alpha</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <View style={styles.current}>
            <Text style={styles.currentText}>Drag downward to remove</Text>
            <ScrollView horizontal contentContainerStyle={styles.historyContent}>
              {historyItems.map(renderHistoryItem)}
            </ScrollView>
          </View>

          <View style={styles.controls}>
            <IconButton label="Play" icon="play" onPress={onPressPlay}/>
            <IconButton style={{ marginLeft: 5 }} label="Clear All" icon="trash" onPress={onPressClear} />
          </View>
        </View>

        <View style={styles.bodyBottom}>
          <ScrollView contentContainerStyle={styles.scrollFlexWrap}>
            {words.map(item => renderWordItem(item, onPressWord))}
          </ScrollView>
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
  historyContent: {
    alignItems: 'center',
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
    alignItems: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    flexDirection: 'row',
    marginLeft: 5,
  },
  bodyBottom: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    flex: 1,
    marginTop: 5,
    alignItems: 'stretch'
  },
  scrollFlexWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
