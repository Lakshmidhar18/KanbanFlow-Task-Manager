import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import TaskColumn from "../components/TaskColumn";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import "../styles/Dashboard.css";
import toast from "react-hot-toast";


export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(true);


  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ---------------- FETCH TASKS ---------------- */
  
const fetchTasks = async () => {
  try {
    setLoading(true);
    const res = await api.get("/tasks");

    if (Array.isArray(res.data)) {
      setTasks(res.data);
    } else if (Array.isArray(res.data.tasks)) {
      setTasks(res.data.tasks);
    } else {
      setTasks([]);
    }
  } catch (err) {
    console.error("FETCH TASK ERROR:", err);
    setTasks([]);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchTasks();
  }, []);

const addTask = async () => {
  if (!newTask.trim()) return;

  try {
    const res = await api.post("/tasks", {
      title: newTask,
      status: "todo",
    });

    // ✅ add task to state immediately
    setTasks((prev) => [...prev, res.data]);

    setNewTask("");
    toast.success("Task added");
  } catch (err) {
    toast.error("Failed to add task");
  }
};


const deleteTask = async (id) => {
  try {
    await api.delete(`/tasks/${id}`);

    // ✅ remove from state
    setTasks((prev) => prev.filter((t) => t._id !== id));

    toast.success("Task deleted");
  } catch (err) {
    toast.error("Failed to delete task");
  }
}

const moveTask = async (taskId, newStatus) => {
  try {
    // optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, status: newStatus } : t
      )
    );

    await api.put(`/tasks/${taskId}`, { status: newStatus });

    toast.success("Task moved");
  } catch (err) {
    toast.error("Failed to move task");
  }
};



  /* ---------------- THEME ---------------- */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Kanban Board</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ADD TASK */}
      {/* <div className="task-input-wrapper">
  <div className="task-input-box">
    <label className="task-label">New Task</label>
    <input
      type="text"
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
    />
  </div>

  <button className="add-task-btn" onClick={addTask}>
    + Add Task
  </button>
</div> */}

    <div className="task-input-wrapper">
  <div className="task-input-box">
    <span className="task-input-label">New Task</span>
 
    <input
      type="text"
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
    />
  </div>

  <button className="add-task-btn" onClick={addTask}>
    + Add
  </button>
</div>

      {loading && (
  <p style={{ opacity: 0.7, marginTop: "20px" }}>
    Loading tasks...
  </p>
)}

    {loading && <div className="loader">Loading tasks...</div>}

      {/* COLUMNS */}
      <div className="columns">
  <TaskColumn
    title="To Do"
    status="todo"
    tasks={tasks.filter((t) => t.status === "todo")}
    onDelete={deleteTask}
    onMove={moveTask}
  />

  <TaskColumn
    title="In Progress"
    status="in-progress"
    tasks={tasks.filter((t) => t.status === "in-progress")}
    onDelete={deleteTask}
    onMove={moveTask}
  />

  <TaskColumn
    title="Done"
    status="done"
    tasks={tasks.filter((t) => t.status === "done")}
    onDelete={deleteTask}
    onMove={moveTask}
  />
</div>


      {/* THEME TOGGLE */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
}
