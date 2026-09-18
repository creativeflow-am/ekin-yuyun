import { db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

const COLLECTION_NAME = "pekerjaan";

/**
 * Fetch all tasks from Firestore
 */
export async function getTasks() {
  const q = query(collection(db, COLLECTION_NAME), orderBy("tanggal", "desc"));
  const snapshot = await getDocs(q);
  const tasks = [];
  snapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() });
  });
  return tasks;
}

/**
 * Add a new task to Firestore
 */
export async function addTask(taskData) {
  // taskData should contain: tanggal, skp, deskripsi, type, evidence, tipe_kerja, jam_masuk, jam_pulang, createdAt
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...taskData,
    createdAt: new Date().toISOString()
  });
  return { id: docRef.id, ...taskData };
}

/**
 * Update an existing task in Firestore
 */
export async function updateTask(id, taskData) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, taskData);
  return { id, ...taskData };
}

/**
 * Delete a task from Firestore
 */
export async function deleteTask(id) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  return id;
}
