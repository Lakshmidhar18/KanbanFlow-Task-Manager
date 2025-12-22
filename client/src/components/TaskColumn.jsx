import { useState } from "react";
import TaskCard from "./TaskCard";

export default function TaskColumn({ title, status, tasks = [], onMove, onDelete }) {
  const [isOver, setIsOver] = useState(false);

  const handleDrop = (e) => {
    const taskId = e.dataTransfer.getData("taskId");
    setIsOver(false);
    if (taskId) onMove(taskId, status);
  };

  return (
    <div
      className={`task-column ${isOver ? "drag-over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <h3>{title}</h3>

      {tasks.length === 0 && (
        <p className="empty">Drop tasks here</p>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
