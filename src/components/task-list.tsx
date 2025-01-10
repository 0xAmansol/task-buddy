"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TaskStatus, Task } from "@/types/task";

export function TaskList() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks] = useState<Task[]>([]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">TaskBuddy</h2>
        <div className="flex space-x-2">
          <Button variant="outline" className="text-sm">
            List
          </Button>
          <Button variant="outline" className="text-sm">
            Board
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Due Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        <TaskSection title="Todo (3)" status="TODO" tasks={tasks} />
        <TaskSection
          title="In-Progress (3)"
          status="IN_PROGRESS"
          tasks={tasks}
        />
        <TaskSection title="Completed (3)" status="COMPLETED" tasks={tasks} />
      </div>

      {showAddTask ? (
        <Card className="p-4 space-y-4">
          <Input placeholder="Task Title" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddTask(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Add</Button>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setShowAddTask(true)}
          className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          variant="ghost"
        >
          + Add Task
        </Button>
      )}
    </div>
  );
}

function TaskSection({
  title,
  status,
  tasks,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}) {
  const filteredTasks = tasks.filter((task) => task.status === status);
  const bgColor =
    status === "TODO"
      ? "bg-pink-50"
      : status === "IN_PROGRESS"
      ? "bg-blue-50"
      : "bg-green-50";

  return (
    <div className="space-y-2">
      <div className={`${bgColor} px-4 py-2 rounded-lg`}>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-start gap-4">
              <Checkbox />
              <div className="flex-1 space-y-1">
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">{task.dueDate}</p>
              </div>
              <span className="text-xs text-gray-500">
                {task.status.replace("_", "-")}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
