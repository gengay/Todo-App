import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter email and password');
    setLoading(true);
    try {
      // โค้ดนี้จะสมัครสมาชิกและล็อกอินให้อัตโนมัติ
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput 
        style={styles.input} placeholder="Email" value={email} onChangeText={setEmail}
        autoCapitalize="none" keyboardType="email-address" 
      />
      <TextInput 
        style={styles.input} placeholder="Password (min 6 chars)" value={password} onChangeText={setPassword}
        secureTextEntry 
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#007AFF', marginTop: 20 }
});