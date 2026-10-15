import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Customers() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    const [customers, setCustomers] = useState([]);
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
        company: "",
        address: "",
        notes: ""
    };

    const [form, setForm] = useState(emptyForm);

    const inputStyle = {
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        boxSizing: "border-box"
    };

    const fetchCustomers = async () => {
        try {
            const response = await API.get("/customers");
            setCustomers(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.customers || []
            );
            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load customers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value
        }));
    };

    const handleAdd = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowForm(true);
        setError("");
        setMessage("");
    };

    const handleEdit = (customer) => {
        setEditingId(customer._id);

        setForm({
            name: customer.name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            company: customer.company || "",
            address: customer.address || "",
            notes: customer.notes || ""
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
                await API.put(`/customers/${editingId}`, form);
                setMessage("Customer updated successfully!");
            } else {
                const userId = user?._id || user?.id;

                if (!userId) {
                    setError(
                        "User ID is missing. Please log out and log in again."
                    );
                    return;
                }

                await API.post("/customers", {
                    ...form,
                    assignedSalesRep: userId
                });

                setMessage("Customer added successfully!");
            }

            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
            await fetchCustomers();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save customer."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (customerId) => {
        if (!isAdmin) {
            setError("Only Admin users can delete customers.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            await API.delete(`/customers/${customerId}`);
            setMessage("Customer deleted successfully!");
            await fetchCustomers();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete customer. Check your permissions."
            );
        }
    };

    if (loading) {
        return <h2 style={{ padding: "30px" }}>Loading customers...</h2>;
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
                    <h1>Customers</h1>
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
                    + Add Customer
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
                    <h2>{editingId ? "Edit Customer" : "Add New Customer"}</h2>

                    {[
                        { name: "name", label: "Name", required: true },
                        { name: "email", label: "Email", required: true },
                        { name: "phone", label: "Phone" },
                        { name: "company", label: "Company" },
                        { name: "address", label: "Address" }
                    ].map((field) => (
                        <div key={field.name} style={{ marginBottom: "15px" }}>
                            <label>
                                {field.label}{field.required ? " *" : ""}
                            </label>
                            <input
                                name={field.name}
                                type={field.name === "email" ? "email" : "text"}
                                value={form[field.name]}
                                onChange={handleChange}
                                required={field.required}
                                style={inputStyle}
                            />
                        </div>
                    ))}

                    <div style={{ marginBottom: "20px" }}>
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: "80px" }}
                        />
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
                            : editingId
                                ? "Save Changes"
                                : "Save Customer"}
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            padding: "12px 20px",
                            marginLeft: "10px",
                            cursor: "pointer"
                        }}
                    >
                        Cancel
                    </button>
                </form>
            )}

            {customers.length === 0 ? (
                <p>No customers found.</p>
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
                                    "Name",
                                    "Email",
                                    "Phone",
                                    "Company",
                                    "Address",
                                    "Actions"
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        style={{
                                            border: "1px solid #ddd",
                                            padding: "10px",
                                            textAlign: "left"
                                        }}
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer._id}>
                                    <td style={cellStyle}>{customer.name}</td>
                                    <td style={cellStyle}>{customer.email}</td>
                                    <td style={cellStyle}>{customer.phone || "-"}</td>
                                    <td style={cellStyle}>{customer.company || "-"}</td>
                                    <td style={cellStyle}>{customer.address || "-"}</td>
                                    <td style={cellStyle}>
                                        <button
                                            onClick={() => handleEdit(customer)}
                                            style={{
                                                marginRight: "8px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Edit
                                        </button>

                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(customer._id)}
                                                style={{
                                                    color: "white",
                                                    background: "#dc2626",
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
    padding: "10px"
};

export default Customers;