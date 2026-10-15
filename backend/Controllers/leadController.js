const Lead = require("../models/Lead");

// Get all leads
const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find()
            .populate("assignedRep", "fullName email role")
            .sort({ createdAt: -1 });

        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get leads",
            error: error.message
        });
    }
};

// Get lead by ID
const getLeadById = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id)
            .populate("assignedRep", "fullName email role");

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get lead",
            error: error.message
        });
    }
};

// Create lead
const createLead = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            source,
            status,
            assignedRep
        } = req.body;

        if (!name || !source || !assignedRep) {
            return res.status(400).json({
                message: "Name, source and assignedRep are required"
            });
        }

        const lead = await Lead.create({
            name,
            email,
            phone,
            source,
            status,
            assignedRep
        });

        const populatedLead = await Lead.findById(lead._id)
            .populate("assignedRep", "fullName email role");

        res.status(201).json({
            message: "Lead created successfully",
            lead: populatedLead
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create lead",
            error: error.message
        });
    }
};

// Update lead
const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("assignedRep", "fullName email role");

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.status(200).json({
            message: "Lead updated successfully",
            lead
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update lead",
            error: error.message
        });
    }
};

// Delete lead
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.status(200).json({
            message: "Lead deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete lead",
            error: error.message
        });
    }
};

module.exports = {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead
};