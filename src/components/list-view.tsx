import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Task, TaskStatus } from "@/types/task";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { EditTaskDialog } from "./editTaskDialog";
import { formatDueDate } from "@/utils/formatDueDate";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "./ui/button";

interface ListViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
}

export function ListView({ tasks = [], onUpdateTask }: ListViewProps) {
  const { removeTask } = useTaskStore();

  const handleDeleteTask = (taskId: string) => {
    removeTask(taskId);
  };

  const [expandedSections, setExpandedSections] = useState<TaskStatus[]>([
    "TODO",
    "IN_PROGRESS",
    "COMPLETED",
  ]);

  const toggleSection = (status: TaskStatus) => {
    setExpandedSections((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const sections: { status: TaskStatus; title: string; bgColor: string }[] = [
    { status: "TODO", title: "Todo", bgColor: "bg-pink-100" },
    { status: "IN_PROGRESS", title: "In-Progress", bgColor: "bg-blue-100" },
    { status: "COMPLETED", title: "Completed", bgColor: "bg-green-100" },
  ];

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const updatedTask = tasks.find((task) => task.id === draggableId);
    if (updatedTask) {
      const newStatus = destination.droppableId as TaskStatus;
      onUpdateTask({
        ...updatedTask,
        status: newStatus,
        completed: newStatus === "COMPLETED",
      });
    }
  };

  const handleTaskCompletion = (taskId: string, completed: boolean) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      onUpdateTask({
        ...taskToUpdate,
        status: completed ? "COMPLETED" : "TODO",
        completed,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        {sections.map(({ status, title, bgColor }) => {
          const sectionTasks = tasks.filter((task) => task.status === status);
          const isExpanded = expandedSections.includes(status);

          return (
            <div key={status} className="rounded-lg">
              <button
                onClick={() => toggleSection(status)}
                className={`w-full ${bgColor} p-4 rounded-lg flex items-center justify-between`}
              >
                <span className="font-medium">
                  {title} ({sectionTasks.length})
                </span>
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {isExpanded && (
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="mt-2 space-y-2"
                    >
                      {sectionTasks.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No Tasks in {title}
                        </div>
                      ) : (
                        sectionTasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-4 bg-white rounded-lg shadow-sm border"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start space-x-2">
                                    <Checkbox
                                      checked={task.status === "COMPLETED"}
                                      onCheckedChange={(checked) =>
                                        handleTaskCompletion(
                                          task.id,
                                          checked as boolean
                                        )
                                      }
                                    />
                                    <div>
                                      <h3
                                        className={`font-medium ${
                                          task.status === "COMPLETED"
                                            ? "line-through text-gray-500"
                                            : ""
                                        }`}
                                      >
                                        {task.title}
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        {formatDueDate(task.dueDate)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">
                                      {task.category || "No Category"}
                                    </span>
                                    <EditTaskDialog
                                      task={task}
                                      onUpdate={onUpdateTask}
                                    />
                                    <Button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-red-600 hover:text-red-800"
                                      variant="ghost"
                                      size="sm"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
