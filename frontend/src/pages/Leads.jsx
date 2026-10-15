import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Leads() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const emptyForm = {
        name: "",
        email: "",
        phone: "",
        source: "Web",
        status: "New"
    };

    const [form, setForm] = useState(emptyForm);

    const inputStyle = {
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        boxSizing: "border-box"
    };

    const fetchLeads = async () => {
        try {
            const response = await API.get("/leads");
            setLeads(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.leads || []
            );
            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to load leads."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleAdd = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
        setError("");
        setMessage("");
    };

    const handleEdit = (lead) => {
        setEditingId(lead._id);
        setForm({
            name: lead.name || "",
            email: lead.email || "",
            phone: lead.phone || "",
            source: lead.source || "Web",
            status: lead.status || "New"
        });
        setShowForm(true);
        setError("");
        setMessage("");
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setMessage("");

        try {
            if (editingId) {
                await API.put(`/leads/${editingId}`, form);
                setMessage("Lead updated successfully!");
            } else {
                const userId = user?._id || user?.id;

                if (!userId) {
                    setError(
                        "User ID is missing. Please log out and log in again."
                    );
                    return;
                }

                await API.post("/leads", {
                    ...form,
                    assignedRep: userId
                });
                setMessage("Lead added successfully!");
            }

            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
            await fetchLeads();
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to save lead."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (leadId) => {
        if (!isAdmin) {
            setError("Only Admin users can delete leads.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this lead?")) {
            return;
        }

        setError("");
        setMessage("");

        try {
            await API.delete(`/leads/${leadId}`);
            setMessage("Lead deleted successfully!");
            await fetchLeads();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete lead. Check your permissions."
            );
        }
    };

    if (loading) {
        return <h2 style={{ padding: "30px" }}>Loading leads...</h2>;
    }

    return (
        <div style={{
            padding: "30px",
            background: "#f4f6f8",
            minHeight: "100vh"
        }}>
            <button
                onClick={() => navigate("/dashboard")}
                style={{ padding: "10px 16px", cursor: "pointer" }}
            >
                ← Back to Dashboard
            </button>

            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
                marginTop: "20px"
            }}>
                <div>
                    <h1>Leads</h1>
                    <p style={{ color: "#6b7280" }}>
                        Logged in as: {user?.role || "User"}
                    </p>
                </div>

                <button
                    onClick={handleAdd}
                    style={{
                        padding: "12px 18px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    + Add Lead
                </button>
            </div>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        marginTop: "20px",
                        marginBottom: "25px",
                        maxWidth: "600px"
                    }}
                >
                    <h2>{editingId ? "Edit Lead" : "Add New Lead"}</h2>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Name *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Phone</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Source</label>
                        <select
                            name="source"
                            value={form.source}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="Referral">Referral</option>
                            <option value="Ads">Ads</option>
                            <option value="Web">Web</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label>Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Converted">Converted</option>
                            <option value="Lost">Lost</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            padding: "12px 20px",
                            background: "#16a34a",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: saving ? "wait" : "pointer"
                        }}
                    >
                        {saving
                            ? "Saving..."
                            : editingId ? "Save Changes" : "Save Lead"}
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{ padding: "12px 20px", marginLeft: "10px" }}
                    >
                        Cancel
                    </button>
                </form>
            )}

            {leads.length === 0 ? (
                <p>No leads found.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "20px",
                        background: "white"
                    }}>
                        <thead>
                            <tr>
                                {[
                                    "Name", "Email", "Phone",
                                    "Source", "Status", "Actions"
                                ].map((heading) => (
                                    <th key={heading} style={cellStyle}>
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead._id}>
                                    <td style={cellStyle}>{lead.name}</td>
                                    <td style={cellStyle}>{lead.email}</td>
                                    <td style={cellStyle}>{lead.phone || "-"}</td>
                                    <td style={cellStyle}>{lead.source || "-"}</td>
                                    <td style={cellStyle}>{lead.status}</td>
                                    <td style={cellStyle}>
                                        <button
                                            onClick={() => handleEdit(lead)}
                                            style={{ marginRight: "8px" }}
                                        >
                                            Edit
                                        </button>

                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(lead._id)}
                                                style={{
                                                    background: "#dc2626",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "6px 10px",
                                                    borderRadius: "4px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const cellStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left"
};

export default Leads;