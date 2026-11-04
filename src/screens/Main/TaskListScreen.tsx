import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { getUserTasks, markTaskDone } from '../../services/taskService';
import { Task } from '../../types';

export default function TaskListScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getUserTasks(user.uid);
      setTasks(data);
    } catch (error: any) {
      Alert.alert('Load failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const unsubscribe = navigation.addListener?.('focus', fetchTasks);
    return unsubscribe;
  }, [user, navigation]);

  const handleDone = async (taskId?: string) => {
    if (!taskId) return;

    try {
      await markTaskDone(taskId);
      fetchTasks();
    } catch (error: any) {
      Alert.alert('Update failed', error.message);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddEditTask')}>
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id ?? item.title}
        renderItem={({ item }) => (
          <View style={[styles.taskCard, item.status === 'done' && styles.doneCard]}>
            <View style={styles.taskHeader}>
              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskMeta}>{item.priority} • {item.status}</Text>
                <Text style={styles.taskDescription}>{item.description || 'No description'}</Text>
              </View>

              {item.status !== 'done' && (
                <TouchableOpacity style={styles.doneBtn} onPress={() => handleDone(item.id)}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  loader: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#222' },
  addText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  taskCard: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12 },
  doneCard: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#81C784' },
  taskHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taskContent: { flex: 1, paddingRight: 12 },
  taskTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  taskMeta: { fontSize: 12, color: '#666', textTransform: 'capitalize', marginBottom: 4 },
  taskDescription: { fontSize: 14, color: '#555' },
  doneBtn: { backgroundColor: '#2E7D32', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  doneBtnText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
});
