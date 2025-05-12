import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Switch, useColorScheme
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const fatContentOptions = ["Low Fat", "Regular"];
const itemTypeOptions = [
  "Breads", "Breakfast", "Baking Goods", "Canned", "Dairy", "Frozen Foods",
  "Fruits and Vegetables", "Hard Drinks", "Health and Hygiene", "Household",
  "Meat", "Others", "Seafood", "Snack Foods", "Soft Drinks", "Starchy Foods"
];
const outletIdOptions = [
  "OUT010", "OUT013", "OUT017", "OUT018", "OUT019",
  "OUT027", "OUT035", "OUT045", "OUT046", "OUT049"
];
const outletSizeOptions = ["Small", "Medium", "High", "Unknown"];
const outletLocationOptions = ["Tier 1", "Tier 2", "Tier 3"];
const outletTypeOptions = [
  "Grocery Store", "Supermarket Type1", "Supermarket Type2", "Supermarket Type3"
];

export default function PriceForm({ setPrediction }) {
  const deviceScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceScheme === 'dark');

  const theme = isDarkMode ? darkTheme : lightTheme;

  const [form, setForm] = useState({
    Item_Weight: '',
    Item_Fat_Content: fatContentOptions[0],
    Item_Visibility: '',
    Item_Type: itemTypeOptions[0],
    Item_MRP: '',
    Outlet_Identifier: outletIdOptions[0],
    Outlet_Establishment_Year: '',
    Outlet_Size: outletSizeOptions[0],
    Outlet_Location_Type: outletLocationOptions[0],
    Outlet_Type: outletTypeOptions[0],
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    for (let key in form) {
      if (form[key] === '') {
        Alert.alert('Missing Field', `Please fill in the ${key.replace(/_/g, ' ')} field.`);
        return;
      }
    }
    try {
      const response = await axios.post(
        'https://sales-predictor-5kqf.onrender.com/predict',
        {
          ...form,
          Item_Weight: parseFloat(form.Item_Weight),
          Item_Visibility: parseFloat(form.Item_Visibility),
          Item_MRP: parseFloat(form.Item_MRP),
          Outlet_Establishment_Year: parseInt(form.Outlet_Establishment_Year),
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setPrediction(response.data.prediction);
    } catch (error) {
      Alert.alert('Prediction Error', error?.response?.data?.detail || 'Something went wrong!');
    }
  };

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.text }]}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Sales Predictor</Text>

        {/* Input Fields */}
        {[
          { label: 'Item Weight (kg)', name: 'Item_Weight', keyboardType: 'numeric' },
          { label: 'Item Visibility (0-1)', name: 'Item_Visibility', keyboardType: 'numeric' },
          { label: 'Item MRP', name: 'Item_MRP', keyboardType: 'numeric' },
          { label: 'Outlet Establishment Year', name: 'Outlet_Establishment_Year', keyboardType: 'numeric' },
        ].map(({ label, name, keyboardType }) => (
          <View key={name} style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.accent }]}
              placeholder={`Enter ${label.toLowerCase()}`}
              placeholderTextColor={theme.placeholder}
              keyboardType={keyboardType}
              value={form[name]}
              onChangeText={v => handleChange(name, v)}
            />
          </View>
        ))}

        {/* Picker Fields */}
        {[
          { label: 'Fat Content', name: 'Item_Fat_Content', options: fatContentOptions },
          { label: 'Item Type', name: 'Item_Type', options: itemTypeOptions },
          { label: 'Outlet Identifier', name: 'Outlet_Identifier', options: outletIdOptions },
          { label: 'Outlet Size', name: 'Outlet_Size', options: outletSizeOptions },
          { label: 'Outlet Location Type', name: 'Outlet_Location_Type', options: outletLocationOptions },
          { label: 'Outlet Type', name: 'Outlet_Type', options: outletTypeOptions },
        ].map(({ label, name, options }) => (
          <View key={name} style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
            <View style={[styles.pickerContainer, { backgroundColor: theme.input, borderColor: theme.accent }]}>
              <Picker
                selectedValue={form[name]}
                style={[styles.picker, { color: theme.text }]}
                dropdownIconColor={theme.text}
                onValueChange={v => handleChange(name, v)}
              >
                {options.map(opt => (
                  <Picker.Item key={opt} label={opt} value={opt} color={theme.text} />
                ))}
              </Picker>
            </View>
          </View>
        ))}

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={handleSubmit}>
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Predict Sales</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Themes
const darkTheme = {
  background: '#0d1b2a',
  card: '#1b263b',
  input: '#0d1b2a',
  text: '#e0e1dd',
  accent: '#1b6ca8',
  placeholder: '#a0aec0',
  buttonText: '#ffffff',
};

const lightTheme = {
  background: '#fefefe',
  card: '#e6f2ff',
  input: '#ffffff',
  text: '#1b263b',
  accent: '#0077b6',
  placeholder: '#7a7a7a',
  buttonText: '#ffffff',
};

// Styles
const styles = StyleSheet.create({
  formContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  picker: {
    height: 55,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
