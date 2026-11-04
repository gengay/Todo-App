import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../config/firebase';

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert('Logout failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? 'Not logged in'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#222' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
  label: { fontSize: 12, color: '#666', marginBottom: 4 },
  value: { fontSize: 18, fontWeight: '600', color: '#333' },
  button: { backgroundColor: '#DC3545', borderRadius: 10, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
