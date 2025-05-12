import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, ScrollView } from 'react-native';
import PriceForm from './components/PriceForm';
import PredictionResult from './components/PredictionResult';

export default function App() {
  const [prediction, setPrediction] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.inner}>
        <PriceForm setPrediction={setPrediction} />
        {prediction && <PredictionResult prediction={prediction} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000B58', // Primary dark blue
  },
  inner: {
    flexGrow: 1,
    padding: 20,
  },
});