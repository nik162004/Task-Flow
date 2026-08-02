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
    <form onSubmit={handleSubmit}>
      <h2>Create Task</h2>

      <input
        type="text"
        name="title"
        placeholder="Task title"
        value={formData.title}
        onChange={handleChange}
      />

      <br />
      <br />

      <textarea
        name="description"
        placeholder="Task description"
        value={formData.description}
        onChange={handleChange}
      />

      <br />
      <br />

      <button type="submit">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;