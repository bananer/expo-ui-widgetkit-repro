import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Host, DatePicker } from '@expo/ui/swift-ui';

// The only use of @expo/ui: a regular native date picker.
// No widgets, no Live Activities, no expo-widgets, no extension targets.
export default function App() {
  const [date, setDate] = useState(new Date());
  return (
    <View style={styles.container}>
      <Host matchContents>
        <DatePicker selection={date} onDateChange={setDate} />
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
