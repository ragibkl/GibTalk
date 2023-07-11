import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import IconButton from '../../components/IconButton';
import { Word } from '../../types';
import { speakWord, stopSpeech } from '../../service/speech';
import WordsGrid from './WordsGrid';
import WordsHistoryList from './WordsHistoryList';

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

export default function MainScreen() {
  const [words, setWords] = useState(SAMPLE_WORDS);
  const [wordsHistory, setHistoryItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const onPressClear = () => {
    setHistoryItems([]);
    stopSpeech();
  }

  const onPressPlay = () => {
    wordsHistory.forEach(speakWord);
  }

  const addWordToHistory = (item: Word) => {
    setHistoryItems([...wordsHistory, item]);
  }

  const onPressEdit = () => {
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

  const moveWordLeft = (word: Word) => {
    let i = words.findIndex(w => w.id === word.id)
    if (i === 0) {
      return;
    }

    let start = words.slice(0, i - 1);
    let left = words[i - 1];
    let end = words.slice(i + 1);

    setWords([...start, word, left, ...end])
  }

  const moveWordRight = (word: Word) => {
    let i = words.findIndex(w => w.id === word.id)

    let start = words.slice(0, i);
    let right = words[i + 1];
    let end = words.slice(i + 2);

    setWords([...start, right, word, ...end])
  }

  return (
    <View style={styles.body}>
      <View style={styles.bodyTop}>
        <View style={styles.historyContainer}>
          <Text style={styles.currentText}>Drag downward to remove</Text>
          <WordsHistoryList words={wordsHistory} />
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
          <WordsGrid
            addWordToHistory={addWordToHistory}
            isEditing={isEditing}
            removeWord={removeWord}
            words={words}
            moveWordLeft={moveWordLeft}
            moveWordRight={moveWordRight}
          />
        </View>

        <View style={styles.sideControls}>
          {isEditing ? (
            <IconButton label="Save" icon="save" onPress={onPressSave} />
          ) : (
            <IconButton label="Edit" icon="edit" onPress={onPressEdit} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
