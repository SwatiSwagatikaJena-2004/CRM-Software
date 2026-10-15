const express = require("express");

const {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead
} = require("../controllers/leadController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Lead management APIs
 */

/**
 * @swagger
 * /api/leads:
 *   get:
 *     summary: Get all leads
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leads
 */
router.get(
    "/",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    getLeads
);

/**
 * @swagger
 * /api/leads/{id}:
 *   get:
 *     summary: Get lead by ID
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead details
 *       404:
 *         description: Lead not found
 */
router.get(
    "/:id",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    getLeadById
);

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Create a lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - source
 *               - assignedRep
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amit Kumar
 *               email:
 *                 type: string
 *                 example: amit@gmail.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               source:
 *                 type: string
 *                 enum: [Referral, Ads, Web]
 *                 example: Referral
 *               status:
 *                 type: string
 *                 enum: [New, Contacted, Qualified, Converted, Lost]
 *                 example: New
 *               assignedRep:
 *                 type: string
 *                 example: 64f123456789abcdef123456
 *     responses:
 *       201:
 *         description: Lead created successfully
 */
router.post(
    "/",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    createLead
);

/**
 * @swagger
 * /api/leads/{id}:
 *   put:
 *     summary: Update a lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               source:
 *                 type: string
 *                 enum: [Referral, Ads, Web]
 *               status:
 *                 type: string
 *                 enum: [New, Contacted, Qualified, Converted, Lost]
 *               assignedRep:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *       404:
 *         description: Lead not found
 */
router.put(
    "/:id",
    protect,
    authorizeRoles("Admin", "Sales Rep"),
    updateLead
);

/**
 * @swagger
 * /api/leads/{id}:
 *   delete:
 *     summary: Delete a lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Lead not found
 */
router.delete(
    "/:id",
    protect,
    authorizeRoles("Admin"),
    deleteLead
);

module.exports = router;