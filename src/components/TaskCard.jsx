export default function TaskCard({ task, onDelete }) {
  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => e.dataTransfer.setData("taskId", task._id)}
    >
      <p className="task-title">{task.title}</p>

      <div className="task-actions">
        <button className="delete" onClick={() => onDelete(task._id)} style={{cursor:"pointer",float:"right"}}>
          ✕ Remove
        </button>
      </div>
    </div>
  );
}