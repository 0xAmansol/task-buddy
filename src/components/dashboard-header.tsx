import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewType } from "@/types/task";
import { Search } from "lucide-react";
import { CreateTaskDialog } from "./createTaskDialog";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { CheckSquare2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
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

interface DashboardHeaderProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  userImage: string;
  onCategoryChange: (category: string) => void;
  onDueDateChange: (dueDate: string) => void;
  onSearchChange: (search: string) => void;
}

export function DashboardHeader({
  view,
  onViewChange,
  userImage,
  onCategoryChange,
  onDueDateChange,
  onSearchChange,
}: DashboardHeaderProps) {
  const router = useRouter();

  const handleSignout = async () => {
    try {
      if (auth.currentUser) {
        await auth.signOut();
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CheckSquare2Icon className="w-8 h-8 text-[#7b1984]" />
          <h1 className="text-xl font-semibold">TaskBuddy</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewChange("list")}
            >
              List
            </Button>
            <Button
              variant={view === "board" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewChange("board")}
            >
              Board
            </Button>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full">
            <Image
              src={userImage}
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
          <div>
            <Button onClick={handleSignout} className="flex-1">
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Select onValueChange={onCategoryChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={onDueDateChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Due Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              className="pl-8"
              placeholder="Search"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <CreateTaskDialog />
        </div>
      </div>
    </div>
  );
}

interface ListViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
}

export function ListView({ tasks = [], onUpdateTask }: ListViewProps) {
  const { removeTask } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleDeleteTask = (taskId: string) => {
    removeTask(taskId);
  };

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
                                      <p className="text-sm text-gray-500 mt-1">
                                        {formatDueDate(task.dueDate)}
                                      </p>
                                      {task.category && (
                                        <span className="text-xs text-gray-500 mt-2 block">
                                          {task.category}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTask(task.id);
                                      }}
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
      {selectedTask && (
        <EditTaskDialog
          task={selectedTask}
          onUpdate={(updatedTask) => {
            onUpdateTask(updatedTask);
            setSelectedTask(null);
          }}
        />
      )}
    </DragDropContext>
  );
}
