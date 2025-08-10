
import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, limit, where, getDoc } from 'firebase/firestore';
import type { Component, Category, Log, User } from './types';

// Collection references
const componentsCollection = collection(db, 'components');
const categoriesCollection = collection(db, 'categories');
const logsCollection = collection(db, 'logs');
const usersCollection = collection(db, 'users');

// Fetch operations
export const fetchComponents = async (): Promise<Component[]> => {
    const snapshot = await getDocs(componentsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Component));
};

export const fetchCategories = async (): Promise<Category[]> => {
    const snapshot = await getDocs(categoriesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
};

export const fetchLogs = async (): Promise<Log[]> => {
    const q = query(logsCollection, orderBy('issueDate', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Log));
};

export const fetchUsers = async (): Promise<User[]> => {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

export const fetchUserByUid = async (uid: string): Promise<User | null> => {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
}

// Add operations
export const addComponent = async (component: Omit<Component, 'id'>) => {
    return await addDoc(componentsCollection, component);
};

export const addCategory = async (category: Omit<Category, 'id'>) => {
    return await addDoc(categoriesCollection, category);
};

export const addLog = async (log: Omit<Log, 'id'>) => {
    return await addDoc(logsCollection, log);
};

export const addUser = async (uid: string, user: Omit<User, 'id'>) => {
    const userDocRef = doc(db, 'users', uid);
    return await setDoc(userDocRef, user);
};


// Update operations
export const updateComponent = async (id: string, data: Partial<Omit<Component, 'id'>>) => {
    const componentDoc = doc(db, 'components', id);
    return await updateDoc(componentDoc, data);
};

export const updateCategory = async (id: string, data: Partial<Category>) => {
    const categoryDoc = doc(db, 'categories', id);
    return await updateDoc(categoryDoc, data);
};

export const updateUser = async (id: string, data: Partial<User>) => {
    const userDoc = doc(db, 'users', id);
    return await updateDoc(userDoc, data);
};

export const updateLog = async (id: string, data: Partial<Log>) => {
    const logDoc = doc(db, 'logs', id);
    return await updateDoc(logDoc, data);
}

// Delete operations
export const deleteComponent = async (id: string) => {
    const componentDoc = doc(db, 'components', id);
    return await deleteDoc(componentDoc);
};

export const deleteCategory = async (id: string) => {
    const categoryDoc = doc(db, 'categories', id);
    return await deleteDoc(categoryDoc);
};

export const deleteLog = async (id: string) => {
    const logDoc = doc(db, 'logs', id);
    return await deleteDoc(logDoc);
}


// This one needs to be imported from 'firebase/firestore'
import { setDoc } from 'firebase/firestore';
