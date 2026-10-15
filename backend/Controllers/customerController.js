const Customer = require("../models/Customer");

// Get all customers
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
            .populate("assignedSalesRep", "fullName email role")
            .sort({ createdAt: -1 });

        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch customers",
            error: error.message
        });
    }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .populate("assignedSalesRep", "fullName email role");

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch customer",
            error: error.message
        });
    }
};

// Create customer
const createCustomer = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            company,
            address,
            assignedSalesRep,
            notes
        } = req.body;

        if (!name || !assignedSalesRep) {
            return res.status(400).json({
                message: "Name and assigned sales representative are required"
            });
        }

        const customer = await Customer.create({
            name,
            email,
            phone,
            company,
            address,
            assignedSalesRep,
            notes
        });

        const populatedCustomer = await customer.populate(
            "assignedSalesRep",
            "fullName email role"
        );

        res.status(201).json({
            message: "Customer created successfully",
            customer: populatedCustomer
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create customer",
            error: error.message
        });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("assignedSalesRep", "fullName email role");

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer updated successfully",
            customer
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update customer",
            error: error.message
        });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete customer",
            error: error.message
        });
    }
};

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};