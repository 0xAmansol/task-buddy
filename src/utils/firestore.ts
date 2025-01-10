import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Task } from "@/types/task";
import { getAuth } from "firebase/auth";

// Add a task
export const addTask = async (task: Task) => {
  const auth = getAuth();

  const user = auth.currentUser;
  if (!user || !user.email) {
    return "User not authenticated";
  }

  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      title: task.title,
      attachments: task.attachments,
      description: task.description,
      category: task.category,
      status: task.status,
      dueDate: task.dueDate,
      userId: user.uid,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding task: ", error);
    throw new Error("Error adding task");
  }
};

// Get task history
export const getTaskHistory = async (taskId: string): Promise<string[]> => {
  try {
    const historyQuery = query(
      collection(db, "taskHistory"),
      where("taskId", "==", taskId),
      orderBy("timestamp", "asc")
    );
    const querySnapshot = await getDocs(historyQuery);
    const history: string[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      history.push(
        `${data.timestamp.toDate().toLocaleString()}: ${data.action}`
      );
    });
    return history;
  } catch (error) {
    console.error("Error fetching task history: ", error);
    throw new Error("Error fetching task history");
  }
};

//get all tasks
export const getAllTasks = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !user.email) {
    return "User not authenticated";
  }
  try {
    const tasksCollection = query(collection(db, "tasks"));
    const tasksQuery = query(
      tasksCollection,
      where("userId", "==", user.email)
    );
    const querySnapshot = await getDocs(tasksQuery);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tasks;
  } catch (error) {
    return error;
  }
};

//delete a task
export const deleteTask = async (id: string) => {
  const taskRef = doc(db, "tasks", id);
  await deleteDoc(taskRef);
};

export const updateTask = async (task: Task) => {
  const taskRef = doc(db, "tasks", task.id);
  await updateDoc(taskRef, {
    title: task.title,
    dueDate: task.dueDate,
    category: task.category,
    status: task.status,
    attachments: task.attachments,
  });
};
