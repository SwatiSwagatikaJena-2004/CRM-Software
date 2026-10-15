const express = require("express");

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    getTasks
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/:id",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    getTaskById
);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - dueDate
 *               - assignedTo
 *             properties:
 *               title:
 *                 type: string
 *                 example: Follow up with customer
 *               description:
 *                 type: string
 *                 example: Call the customer regarding the new proposal
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-10T10:00:00.000Z
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: High
 *               assignedTo:
 *                 type: string
 *                 example: 68d123456789abcdef123456
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Completed]
 *                 example: Pending
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid task data
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    createTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Follow up with customer
 *               description:
 *                 type: string
 *                 example: Discuss updated quotation
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-12T10:00:00.000Z
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: Medium
 *               assignedTo:
 *                 type: string
 *                 example: 68d123456789abcdef123456
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Completed]
 *                 example: In Progress
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.put(
    "/:id",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    updateTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Admin only
 *       404:
 *         description: Task not found
 */
router.delete(
    "/:id",
    protect,
    authorizeRoles("Admin"),
    deleteTask
);

module.exports = router;