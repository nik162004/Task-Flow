import { useState } from "react";
import { createTask } from "../services/taskService";

function TaskForm({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      const newTask = await createTask(formData);

      setFormData({
        title: "",
        description: "",
      });

      onTaskCreated(newTask);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-800">
        Create New Task
      </h2>

      <div>
        <label className="block text-sm font-medium mb-2">
          Title
        </label>

        <input
          type="text"
          name="title"
          placeholder="Enter task title..."
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Description
        </label>

        <textarea
          name="description"
          rows="4"
          placeholder="Describe your task..."
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
      >
        + Add Task
      </button>
    </form>
  );
}

export default TaskForm;