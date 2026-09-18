"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getTasks } from "@/lib/data";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Re-register SW (optional, could be in layout but fine here)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
      });
    }
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, isLoading, refreshData: fetchData }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
