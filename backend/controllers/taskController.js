import Task from "../models/Task.js";

const createTask = async (req, res) => {
    const {title, description} = req.body;

    if(!title){
        return res.status(400).json({
            message: "Title is required",
        });
    }

    const task = await Task.create({
        title,
        description,
        owner: req.user._id,
    });

    res.status(201).json(task);
};

const getTasks = async (req, res) => {
    const tasks = await Task.find({
        owner: req.user._id,
    });

    res.status(200).json(tasks);
};

const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if(!task){
        return res.status(404).json({
            message: "Task not found",
        });
    }
    if(task.owner.toString() !== req.user._id.toString()){
        return res.status(401).json({
            message: "Not authorized",
        });
    }
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).json(updatedTask);
};

const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if(!task){
        return res.status(400).json({
            message: "Task not found",
        });
    }

    if (task.owner.toString() != req.user._id.toString()){
        return res.status(401).json({
            message: "Not authorized",
        });
    }

    await task.deleteOne();

    res.status(200).json({
        message: "Task deleted successfully",
    });
};

export {createTask, getTasks, updateTask, deleteTask};