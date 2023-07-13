import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {}

export default function CreateWordScreen({ }: Props) {
  const [language, setLanguage] = useState('en')

  const onLanguageValueChange = (value, _index) => {
    setLanguage(value)
  }

  return (
    <View style={styles.container}>
      <View style={styles.rowInput}>
        <Text style={styles.inputTitle}>Label</Text>
        <TextInput style={styles.labelInput} placeholder='abc123' />
      </View>

      <View style={styles.rowInput}>
        <Text style={styles.inputTitle}>Language</Text>

        <Picker
          selectedValue={language}
          onValueChange={onLanguageValueChange}
          style={styles.labelInput}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Bahasa" value="ms" />
          <Picker.Item label="Chinese" value="zh" />
        </Picker>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 10,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputTitle: {
    width: 100,
  },
  labelInput: {
    height: 40,
    width: 200,
    padding: 5,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
  }
})
