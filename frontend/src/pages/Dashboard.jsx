import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../services/taskService";
import TaskForm from "../components/TaskForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const {logout} = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  const handleTaskCreated = (newTask) => {
    setTasks((prev)=> [newTask, ...prev]);
  };

  const handleComplete = async (task) => {
    try{
        const updated = await updateTask(task._id, {
            ...task,
            status: "Completed",
        });

        setTasks((prev) => 
            prev.map((t) => 
                t._id === updated._id ? updated : t
            )
        );
    } catch (error){
        alert("Failed to update task");
        console.log(error);
    }
  }

  const handleDelete = async (id) => {
    try{
        await deleteTask(id);
        setTasks((prev) => 
            prev.filter((task)=> task._id !== id)
        );
    } catch (error) {
        alert("Failed to delete task");
        console.log(error);
    }
  };

  
  const loadTasks = async () => {
      try {
          const data = await getTasks();
          setTasks(data);
        } catch (error) {
            console.log(error);
        }
    };
    
    useEffect(() => {
      loadTasks();
    }, []);
    
  return (
    <div style={{ maxWidth: "800px", margin: "30px auto" }}>
      <button onClick={handleLogout}>Logout</button>
      <h1>TaskFlow Dashboard</h1>

      <TaskForm onTaskCreated={handleTaskCreated}/>

      <hr />

      {tasks.length === 0 ? (
        <p>No Tasks Found</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <strong>Status:</strong> {task.status}
            <br />
            <br />

            <button onClick={()=> handleDelete(task._id)}>Delete</button>
            <button onClick={()=> handleComplete(task)}>Mark Complete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;