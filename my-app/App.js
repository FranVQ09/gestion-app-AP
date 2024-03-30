import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <>
      <View style={styles.container}></View>
      <WebView source={{ uri: 'https://zingy-bubblegum-3b4884.netlify.app' }} style={{ flex: 1 }} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 45,
  },
});
