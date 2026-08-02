import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../services/taskService";
import TaskForm from "../components/TaskForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    toast.success("Task created");
  };

  const handleComplete = async (task) => {
    try {
      const updated = await updateTask(task._id, {
        ...task,
        status: "Completed",
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );

      toast.success("Task completed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
  };

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || task.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              TaskFlow
            </h1>
            <p className="text-gray-500">
              Organize your work efficiently
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Total Tasks</h2>
            <p className="text-4xl font-bold mt-3">{tasks.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Pending</h2>
            <p className="text-4xl font-bold text-yellow-500 mt-3">
              {tasks.filter((task) => task.status === "Pending").length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Completed</h2>
            <p className="text-4xl font-bold text-green-600 mt-3">
              {tasks.filter((task) => task.status === "Completed").length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <TaskForm onTaskCreated={handleTaskCreated} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white border rounded-xl p-4"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border rounded-xl px-4 py-3"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            No tasks found.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-xl shadow p-6 mb-5 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {task.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  {task.description}
                </p>

                <span
                  className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-semibold ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <div className="space-x-3">
                {task.status !== "Completed" && (
                  <button
                    onClick={() => handleComplete(task)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;