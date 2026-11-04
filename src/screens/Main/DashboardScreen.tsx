import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { getUserTasks, markTaskDone } from '../../services/taskService';
import { Task } from '../../types';

export default function DashboardScreen({ navigation }: any) {
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

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const pendingCount = tasks.length - completedCount;

  const handleDone = async (taskId?: string) => {
    if (!taskId) return;
    try {
      await markTaskDone(taskId);
      fetchTasks();
    } catch (error: any) {
      Alert.alert('Update failed', error.message);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <View style={styles.summaryContainer}>
        <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
          <Text style={styles.cardTitle}>Total</Text>
          <Text style={styles.cardNumber}>{tasks.length}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#E8F5E9' }]}>
          <Text style={styles.cardTitle}>Done</Text>
          <Text style={styles.cardNumber}>{completedCount}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#FFF3E0' }]}>
          <Text style={styles.cardTitle}>Pending</Text>
          <Text style={styles.cardNumber}>{pendingCount}</Text>
        </View>
      </View>

      <Text style={styles.subHeader}>High Priority</Text>
      <FlatList
        data={tasks.filter((t) => t.priority === 'high' && t.status !== 'done')}
        keyExtractor={(item) => item.id ?? item.title}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={styles.taskRow}>
              <View style={styles.taskTextWrap}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDesc}>{item.status}</Text>
              </View>
              <TouchableOpacity style={styles.doneBtn} onPress={() => handleDone(item.id)}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No high priority tasks.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddEditTask')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  card: { flex: 1, padding: 20, borderRadius: 15, marginHorizontal: 5, alignItems: 'center' },
  cardTitle: { fontSize: 14, color: '#666' },
  cardNumber: { fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  taskCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  taskRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskTextWrap: { flex: 1, paddingRight: 12 },
  taskTitle: { fontSize: 16, fontWeight: '600' },
  taskDesc: { fontSize: 14, color: '#888', marginTop: 5 },
  doneBtn: { backgroundColor: '#2E7D32', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  doneBtnText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#007AFF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.3, elevation: 5 },
  fabText: { color: '#fff', fontSize: 30, fontWeight: 'bold', marginTop: -2 }
});