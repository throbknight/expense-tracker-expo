

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Image, Alert } from 'react-native';


const API_URL = 'https://1og1ca5xd6.execute-api.ap-south-1.amazonaws.com/add-expense';
const UPLOAD_API_URL = 'https://1og1ca5xd6.execute-api.ap-south-1.amazonaws.com/upload-receipt';

export default function TabHome() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 1,
    base64: true,
  });

  if (!result.canceled && result.assets.length > 0) {
    setImageUri(result.assets[0].uri);
    setImageBase64(result.assets[0].base64 ?? null);
  }
};

const takePhoto = async () => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (permission.status !== 'granted') {
    Alert.alert('Permission required', 'Camera permission is needed.');
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 1,
    base64: true,
  });

  if (!result.canceled && result.assets.length > 0) {
    setImageUri(result.assets[0].uri);
    setImageBase64(result.assets[0].base64 ?? '');
  }
};



const uploadImage = async () => {
  if (!imageBase64) {
    setMessage('No image to upload.');
    return;
  }
  setMessage('Uploading...');

  try {
    const response = await axios.post(UPLOAD_API_URL, {
      image: imageBase64,
      userId: 'test-user', // or your actual user logic
    });
    setMessage(response.data.message || 'Upload complete!');
    // You can show response.data.lines here (extracted text from Textract)
    console.log(response.data);  // See the lines in debug
  } catch (error) {
    const err = error as any;
    setMessage('Upload failed: ' + (err.response?.data?.message || err.message));
  }
};

  const handleAdd = async () => {
    try {
      const response = await axios.post(API_URL, {
        userId: 'test-user', // you can update with your user logic later
        expenseName,
        amount: Number(amount)
      });

      if (response.status === 200) {
        setMessage(`Expense added! ${expenseName}, ${amount}`);
        setExpenseName('');
        setAmount('');
      } else {
        setMessage('Failed to add expense. Try again.');
      }
    } catch (error) {
      const err = error as any;
      setMessage('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Expense Tracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Expense Name"
        value={expenseName}
        onChangeText={setExpenseName}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Button title="Add" onPress={handleAdd} />

      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Button title="Pick from Gallery" onPress={pickImage} />
      <Button title="Take a Photo" onPress={takePhoto} />

      {imageUri && (
      <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, margin: 10 }} />
)}
      <Button title="Upload Receipt" onPress={uploadImage} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, width: '100%', marginBottom: 16, borderRadius: 5 },
  message: { marginTop: 20, fontSize: 16, color: 'green' },
});

