const express = require("express");

const {
    getSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale
} = require("../Controllers/saleController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales management APIs
 */

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sales
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    getSales
);

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get sale by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale details
 *       404:
 *         description: Sale not found
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/:id",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    getSaleById
);

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - amount
 *               - assignedRep
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: 68d123456789abcdef123456
 *               amount:
 *                 type: number
 *                 example: 25000
 *               status:
 *                 type: string
 *                 enum: [Pending, Completed, Cancelled]
 *                 example: Pending
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-07T10:00:00.000Z
 *               assignedRep:
 *                 type: string
 *                 example: 68d987654321abcdef654321
 *     responses:
 *       201:
 *         description: Sale created successfully
 *       400:
 *         description: Invalid sale data
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    createSale
);

/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Update a sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: 68d123456789abcdef123456
 *               amount:
 *                 type: number
 *                 example: 30000
 *               status:
 *                 type: string
 *                 enum: [Pending, Completed, Cancelled]
 *                 example: Completed
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-10-07T10:00:00.000Z
 *               assignedRep:
 *                 type: string
 *                 example: 68d987654321abcdef654321
 *     responses:
 *       200:
 *         description: Sale updated successfully
 *       404:
 *         description: Sale not found
 *       401:
 *         description: Unauthorized
 */
router.put(
    "/:id",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    updateSale
);

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Delete a sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Admin only
 *       404:
 *         description: Sale not found
 */
router.delete(
    "/:id",
    protect,
    authorizeRoles("Admin"),
    deleteSale
);

module.exports = router;