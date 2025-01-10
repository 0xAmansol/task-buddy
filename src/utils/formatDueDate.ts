export function formatDueDate(dueDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueDateObj = new Date(dueDate);
  dueDateObj.setHours(0, 0, 0, 0);

  if (dueDateObj.getTime() === today.getTime()) {
    return "Today";
  } else if (dueDateObj.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    return dueDate;
  }
}
