import express from "express";
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from "./controllers/taskController.js";

const router = express.Router();

router.post("/tasks", createTask);
router.get("/tasks", getAllTasks);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
