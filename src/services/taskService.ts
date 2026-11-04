import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Task } from '../types';

const tasksCollection = collection(db, 'tasks');

export const addTask = async (task: Omit<Task, 'id'>) => {
  return await addDoc(tasksCollection, {
    ...task,
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
  });
};

export const updateTask = async (taskId: string, data: Partial<Task>) => {
  const taskRef = doc(db, 'tasks', taskId);
  return await updateDoc(taskRef, {
    ...data,
    updatedAt: new Date(),
  });
};

export const markTaskDone = async (taskId: string) => {
  const taskRef = doc(db, 'tasks', taskId);
  return await updateDoc(taskRef, {
    status: 'done',
    completedAt: new Date(),
    updatedAt: new Date(),
  });
};

export const deleteTask = async (taskId: string) => {
  const taskRef = doc(db, 'tasks', taskId);
  return await deleteDoc(taskRef);
};

export const getUserTasks = async (userId: string) => {
  const q = query(tasksCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Task));
};