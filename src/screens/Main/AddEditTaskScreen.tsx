import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addTask } from '../../services/taskService';
import { AuthContext } from '../../context/AuthContext';
import { Priority, TaskStatus } from '../../types';

export default function AddEditTaskScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return Alert.alert('Error', 'Please enter task title');
    if (!user) return Alert.alert('Error', 'User not authenticated');

    setLoading(true);
    try {
      await addTask({
        userId: user.uid,
        title: title.trim(),
        description: description.trim(),
        priority,
        status: 'todo' as TaskStatus,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
      });
      Alert.alert('Success', 'Task added successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error saving task', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.content}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" />

        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} 
          placeholder="Enter description" multiline numberOfLines={4} 
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          {['low', 'medium', 'high'].map((p) => (
            <TouchableOpacity 
              key={p} 
              style={[styles.priorityBtn, priority === p && styles.priorityBtnActive]}
              onPress={() => setPriority(p as Priority)}
            >
              <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>
                {p.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Task</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  priorityContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  priorityBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginHorizontal: 4, alignItems: 'center', backgroundColor: '#fff' },
  priorityBtnActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  priorityText: { color: '#666', fontWeight: '600' },
  priorityTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});