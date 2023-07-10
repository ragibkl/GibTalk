import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';

import HistoryItem from './src/components/HistoryItem';
import WordItem from './src/components/WordItem';
import IconButton from './src/components/IconButton';
import { Word } from './src/types';
import { speakWord, stopSpeech } from './src/service/speech';

const SAMPLE_WORDS: Word[] = [
  { id: '1', label: 'Yes', uri: 'https://www.senteacher.org/fullsymbol/arasaac/5584/' },
  { id: '2', label: 'No', uri: 'https://www.senteacher.org/fullsymbol/arasaac/5526/' },
  { id: '3', label: 'Up', uri: 'https://www.senteacher.org/fullsymbol/mulberry/up.png/' },
  { id: '4', label: 'Down', uri: 'https://www.senteacher.org/fullsymbol/mulberry/down.png/' },
  { id: '5', label: 'Good Job', uri: 'https://www.senteacher.org/fullsymbol/mulberry/good.png/' },
  { id: '6', label: 'Makan', uri: 'https://www.senteacher.org/fullsymbol/arasaac/6456/', language: 'ms' },
  { id: '7', label: 'Stop', uri: 'https://www.senteacher.org/fullsymbol/arasaac/8289/' },
  { id: '8', label: 'Go', uri: 'https://www.senteacher.org/fullsymbol/arasaac/21395/' },
  { id: '9', label: 'Wait', uri: 'https://www.senteacher.org/fullsymbol/arasaac/16697/' },
  { id: '10', label: 'Tunggu', uri: 'https://www.senteacher.org/fullsymbol/arasaac/16697/', language: 'ms' },
  { id: '11', label: 'Run', uri: 'https://www.senteacher.org/fullsymbol/mulberry/run_,_to.png/' },
  { id: '12', label: 'Walk', uri: 'https://www.senteacher.org/fullsymbol/arasaac/3251/' },
  { id: '13', label: 'Jump', uri: 'https://www.senteacher.org/fullsymbol/arasaac/28443/' },
  { id: '14', label: 'Turn around', uri: 'https://www.senteacher.org/fullsymbol/mulberry/around.png/' },
  { id: '15', label: 'Go Up', uri: 'https://www.senteacher.org/fullsymbol/arasaac/6617/' },
  { id: '16', label: 'Panjat', uri: 'https://www.senteacher.org/fullsymbol/arasaac/28255/', language: 'ms' },
  { id: '17', label: '喝水', uri: 'https://www.senteacher.org/fullsymbol/mulberry/drink_,_to.png/', language: 'zh' },
  { id: '18', label: '吃米饭', uri: 'https://www.senteacher.org/fullsymbol/arasaac/4609/', language: 'zh' }
];

export default function App() {
  const [words, setWords] = useState(SAMPLE_WORDS);
  const [historyItems, setHistoryItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const onPressClear = () => {
    setHistoryItems([]);
    stopSpeech();
  }

  const onPressPlay = () => {
    historyItems.forEach(speakWord);
  }

  const onPressWord = (item: Word) => {
    setHistoryItems([...historyItems, item]);
  }

  const onLongPressWord = () => {
    setIsEditing(true);
    setHistoryItems([]);
  }

  const removeWord = (word: Word) => {
    const newWords = words.filter(w => w.id !== word.id);
    setWords(newWords);
  }

  const onPressSave = () => {
    setIsEditing(false);
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
        onPressRemove={() => removeWord(word)}
        isEditing={isEditing}
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

          {!isEditing && (
            <View style={styles.controls}>
              <IconButton label="Play" icon="play" onPress={onPressPlay} />
              <IconButton style={{ marginLeft: 5 }} label="Clear All" icon="trash" onPress={onPressClear} />
            </View>
          )}
        </View>

        <View style={styles.bodyBottom}>
          <View style={styles.gridContainer}>
            <ScrollView contentContainerStyle={styles.scrollFlexWrap}>
              {words.map(renderWordItem)}
            </ScrollView>
          </View>

          <View style={styles.sideControls}>
            {isEditing && <IconButton label="Save" icon="save" onPress={onPressSave} />}
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
