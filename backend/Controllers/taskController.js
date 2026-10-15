const Task = require("../models/Task");

// Get all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("assignedTo", "fullName email role")
            .sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get tasks",
            error: error.message
        });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "fullName email role");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get task",
            error: error.message
        });
    }
};

// Create task
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            dueDate,
            priority,
            assignedTo,
            status
        } = req.body;

        if (!title || !dueDate || !assignedTo) {
            return res.status(400).json({
                message: "Title, dueDate and assignedTo are required"
            });
        }

        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            assignedTo,
            status
        });

        const populatedTask = await Task.findById(task._id)
            .populate("assignedTo", "fullName email role");

        res.status(201).json({
            message: "Task created successfully",
            task: populatedTask
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create task",
            error: error.message
        });
    }
};

// Update task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("assignedTo", "fullName email role");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update task",
            error: error.message
        });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete task",
            error: error.message
        });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};