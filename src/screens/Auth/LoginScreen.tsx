import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter email and password');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput 
        style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}
        autoCapitalize="none" keyboardType="email-address" 
      />
      <TextInput 
        style={styles.input} placeholder="Password" value={password} onChangeText={setPassword}
        secureTextEntry 
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#007AFF', marginTop: 20 }
});