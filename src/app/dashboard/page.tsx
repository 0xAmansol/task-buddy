"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { ListView } from "@/components/list-view";
import { BoardView } from "@/components/board-view";
import { Task, ViewType } from "../../types/task";
import { useTaskStore } from "@/store/useTaskStore";
import { getAuth } from "firebase/auth";

export default function DashboardPage() {
  const [view, setView] = useState<ViewType>("list");
  const [category, setCategory] = useState<string>("all");
  const [dueDate, setDueDate] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const auth = getAuth();
  const userImage = auth.currentUser?.photoURL || "/default-user.png";

  const { tasks, fetchTasks, updateTask } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (category !== "all") {
      filtered = filtered.filter((task: Task) => task.category === category);
    }
    if (dueDate !== "all") {
      const today = new Date();
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      filtered = filtered.filter((task: Task) => {
        const taskDueDate = new Date(task.dueDate);
        if (dueDate === "today") {
          return taskDueDate.toDateString() === today.toDateString();
        } else if (dueDate === "week") {
          return taskDueDate <= endOfWeek;
        } else if (dueDate === "month") {
          return taskDueDate <= endOfMonth;
        }
        return true;
      });
    }
    if (search) {
      filtered = filtered.filter((task: Task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  }, [tasks, category, dueDate, search]);

  const handleUpdateTask = useCallback(
    (task: Task) => {
      updateTask(task);
    },
    [updateTask]
  );

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader
          view={view}
          onViewChange={setView}
          userImage={userImage}
          onCategoryChange={setCategory}
          onDueDateChange={setDueDate}
          onSearchChange={setSearch}
        />
        {view === "list" ? (
          <ListView tasks={filteredTasks} onUpdateTask={handleUpdateTask} />
        ) : (
          <BoardView tasks={filteredTasks} onUpdateTask={handleUpdateTask} />
        )}
      </div>
    </main>
  );
}
