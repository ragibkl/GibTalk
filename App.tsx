import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';

import HistoryItem from './src/components/HistoryItem';
import WordItem from './src/components/WordItem';
import IconButton from './src/components/IconButton';
import { Word } from './src/types';
import { speakWord } from './src/service/speech';

const words: Word[] = [
  { label: 'Yes', uri: 'https://www.senteacher.org/fullsymbol/arasaac/5584/' },
  { label: 'No', uri: 'https://www.senteacher.org/fullsymbol/arasaac/5526/' },
  { label: 'Up', uri: 'https://www.senteacher.org/fullsymbol/mulberry/up.png/' },
  { label: 'Down', uri: 'https://www.senteacher.org/fullsymbol/mulberry/down.png/' },
  { label: 'Good Job', uri: 'https://www.senteacher.org/fullsymbol/mulberry/good.png/' },
  { label: 'Makan', uri: 'https://www.senteacher.org/fullsymbol/arasaac/6456/', language: 'ms' },
  { label: 'Stop', uri: 'https://www.senteacher.org/fullsymbol/arasaac/8289/' },
  { label: 'Go', uri: 'https://www.senteacher.org/fullsymbol/arasaac/21395/' },
  { label: 'Wait', uri: 'https://www.senteacher.org/fullsymbol/arasaac/16697/' },
  { label: 'Tunggu', uri: 'https://www.senteacher.org/fullsymbol/arasaac/16697/', language: 'ms' },
  { label: 'Run', uri: 'https://www.senteacher.org/fullsymbol/mulberry/run_,_to.png/' },
  { label: 'Walk', uri: 'https://www.senteacher.org/fullsymbol/arasaac/3251/' },
  { label: 'Jump', uri: 'https://www.senteacher.org/fullsymbol/arasaac/28443/' },
  { label: 'Turn around', uri: 'https://www.senteacher.org/fullsymbol/mulberry/around.png/' },
  { label: 'Go Up', uri: 'https://www.senteacher.org/fullsymbol/arasaac/6617/' },
  { label: 'Panjat', uri: 'https://www.senteacher.org/fullsymbol/arasaac/28255/', language: 'ms' }
];

export default function App() {
  const [historyItems, setHistoryItems] = useState([]);
  const [showEditor, setShowEditor] = useState(false);

  const onPressClear = () => {
    setHistoryItems([]);
  }

  const onPressPlay = () => {
    historyItems.forEach(speakWord);
  }

  const onPressWord = (item: Word) => {
    setHistoryItems([...historyItems, item]);
  }

  const onLongPressWord = () => {
    setShowEditor(true);
    setHistoryItems([]);
  }

  const onPressSave = () => {
    setShowEditor(false);
  }

  const renderHistoryItem = (word: Word, i: number) => {
    return (
      <HistoryItem key={i} word={word} />
    )
  }

  const renderWordItem = (word: Word) => {
    return (
      <WordItem
        key={word.label}
        word={word}
        onPress={() => onPressWord(word)}
        onLongPress={onLongPressWord}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>GibTalk - Alpha</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <View style={styles.historyContainer}>
            <Text style={styles.currentText}>Drag downward to remove</Text>
            <ScrollView horizontal contentContainerStyle={styles.historyContentContainer}>
              {historyItems.map(renderHistoryItem)}
            </ScrollView>
          </View>

          <View style={styles.controls}>
            <IconButton label="Play" icon="play" onPress={onPressPlay} />
            <IconButton style={{ marginLeft: 5 }} label="Clear All" icon="trash" onPress={onPressClear} />
          </View>
        </View>

        <View style={styles.bodyBottom}>
          <View style={styles.gridContainer}>
            <ScrollView contentContainerStyle={styles.scrollFlexWrap}>
              {words.map(renderWordItem)}
            </ScrollView>
          </View>

          <View style={styles.sideControls}>
            {showEditor && <IconButton label="Save" icon="save" onPress={onPressSave} />}
          </View>
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
    height: 25,
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
    height: 75,
  },
  historyContainer: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    flex: 1,
  },
  historyContentContainer: {
    alignItems: 'center',
  },
  currentText: {
    alignSelf: 'center',
    marginTop: 25,
    position: 'absolute',
  },
  controls: {
    alignItems: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    flexDirection: 'row',
    marginLeft: 5,
  },
  bodyBottom: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
  },
  gridContainer: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    flex: 1,
  },
  sideControls: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
    marginLeft: 5,
    width: 60,
  },
  scrollFlexWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
