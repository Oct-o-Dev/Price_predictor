import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PredictionResult({ prediction }) {
  return (
    <View style={styles.resultBox}>
      <Text style={styles.resultText}>{prediction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  resultBox: {
    backgroundColor: '#003161', // Secondary blue
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFF4B7',
    alignItems: 'center',
  },
  resultText: {
    color: '#FFF4B7', // Light yellow
    fontSize: 24,
    fontWeight: 'bold',
  },
});