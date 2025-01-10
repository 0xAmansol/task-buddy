import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { Task, TaskStatus } from "@/types/task";
import { useTaskStore } from "@/store/useTaskStore";

export function CreateTaskDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    category: "Work",
    status: "TODO",
    dueDate: "",
    attachments: [],
  });
  const { addTask } = useTaskStore();

  const handleCreateTask = async () => {
    if (task.title && task.description) {
      await addTask(task as Task);
      setIsOpen(false);
      setTask({
        title: "",
        description: "",
        category: "Work",
        status: "TODO",
        dueDate: "",
        attachments: [],
      });
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-purple-600 hover:bg-purple-700"
      >
        Add Task
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateTask();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="title">Task title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={task.description}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Task Category</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={task.category === "Work" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setTask({ ...task, category: "Work" })}
                  >
                    Work
                  </Button>
                  <Button
                    type="button"
                    variant={
                      task.category === "Personal" ? "default" : "outline"
                    }
                    size="sm"
                    className="flex-1"
                    onClick={() => setTask({ ...task, category: "Personal" })}
                  >
                    Personal
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Task Status</Label>
                <select
                  id="status"
                  value={task.status}
                  onChange={(e) =>
                    setTask({ ...task, status: e.target.value as TaskStatus })
                  }
                  className="w-full border rounded-md p-2"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due-date">Due on</Label>
              <Input
                type="date"
                id="due-date"
                value={task.dueDate}
                onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Attachment</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drop your files here or{" "}
                  <button
                    type="button"
                    className="text-purple-600 hover:underline"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    Upload
                  </button>
                </p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={() => {}}
                />
              </div>
              {task.attachments?.map((url, index) => (
                <div key={index} className="mt-2 text-sm text-gray-600">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {url.split("/").pop()}
                  </a>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
