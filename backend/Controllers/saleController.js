const Sale = require("../models/Sale");

// Get all sales
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate("customerId", "name email phone company")
            .populate("assignedRep", "fullName email role")
            .sort({ createdAt: -1 });

        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get sales",
            error: error.message
        });
    }
};

// Get sale by ID
const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate("customerId", "name email phone company")
            .populate("assignedRep", "fullName email role");

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get sale",
            error: error.message
        });
    }
};

// Create sale
const createSale = async (req, res) => {
    try {
        const {
            customerId,
            amount,
            status,
            date,
            assignedRep
        } = req.body;

        if (!customerId || amount === undefined || !assignedRep) {
            return res.status(400).json({
                message: "customerId, amount and assignedRep are required"
            });
        }

        const sale = await Sale.create({
            customerId,
            amount,
            status,
            date,
            assignedRep
        });

        const populatedSale = await Sale.findById(sale._id)
            .populate("customerId", "name email phone company")
            .populate("assignedRep", "fullName email role");

        res.status(201).json({
            message: "Sale created successfully",
            sale: populatedSale
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create sale",
            error: error.message
        });
    }
};

// Update sale
const updateSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("customerId", "name email phone company")
            .populate("assignedRep", "fullName email role");

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        res.status(200).json({
            message: "Sale updated successfully",
            sale
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update sale",
            error: error.message
        });
    }
};

// Delete sale
const deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        res.status(200).json({
            message: "Sale deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete sale",
            error: error.message
        });
    }
};

module.exports = {
    getSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale
};