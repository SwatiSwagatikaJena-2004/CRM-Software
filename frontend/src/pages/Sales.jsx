import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Sales() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const emptyForm = {
        customerId: "",
        amount: "",
        status: "Pending",
        date: new Date().toISOString().split("T")[0]
    };

    const [form, setForm] = useState(emptyForm);

    const inputStyle = {
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        boxSizing: "border-box"
    };

    const cellStyle = {
        border: "1px solid #ddd",
        padding: "10px",
        textAlign: "left"
    };

    const fetchData = async () => {
        try {
            const [salesResponse, customersResponse] =
                await Promise.all([
                    API.get("/sales"),
                    API.get("/customers")
                ]);

            const salesData = salesResponse.data;
            const customersData = customersResponse.data;

            setSales(
                Array.isArray(salesData)
                    ? salesData
                    : salesData.sales || []
            );

            setCustomers(
                Array.isArray(customersData)
                    ? customersData
                    : customersData.customers || []
            );

            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load sales or customers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
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

    const handleEdit = (sale) => {
        const customerId =
            typeof sale.customerId === "object"
                ? sale.customerId?._id
                : sale.customerId || sale.customer?._id || sale.customer;

        setEditingId(sale._id);

        setForm({
            customerId: customerId || "",
            amount: sale.amount ?? "",
            status: sale.status || "Pending",
            date: sale.date
                ? new Date(sale.date).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0]
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
            if (!form.customerId) {
                setError("Please select a customer.");
                return;
            }

            const payload = {
                customerId: form.customerId,
                amount: Number(form.amount),
                status: form.status,
                date: form.date
            };

            if (editingId) {
                await API.put(`/sales/${editingId}`, payload);
                setMessage("Sale updated successfully!");
            } else {
                const currentUser = JSON.parse(
                    localStorage.getItem("user") || "null"
                );

                const userId = currentUser?._id || currentUser?.id;

                if (!userId) {
                    setError(
                        "User ID is missing. Please log out and log in again."
                    );
                    return;
                }

                await API.post("/sales", {
                    ...payload,
                    assignedRep: userId
                });

                setMessage("Sale added successfully!");
            }

            setShowForm(false);
            setEditingId(null);
            setForm({
                ...emptyForm,
                date: new Date().toISOString().split("T")[0]
            });

            await fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save sale."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (saleId) => {
        if (!isAdmin) {
            setError("Only Admin users can delete sales.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this sale?")) {
            return;
        }

        setError("");
        setMessage("");

        try {
            await API.delete(`/sales/${saleId}`);
            setMessage("Sale deleted successfully!");
            await fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete sale. Check your permissions."
            );
        }
    };

    if (loading) {
        return <h2 style={{ padding: "30px" }}>Loading sales...</h2>;
    }

    return (
        <div
            style={{
                padding: "30px",
                background: "#f4f6f8",
                minHeight: "100vh"
            }}
        >
            <button
                onClick={() => navigate("/dashboard")}
                style={{ padding: "10px 16px", cursor: "pointer" }}
            >
                ← Back to Dashboard
            </button>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px",
                    marginTop: "20px"
                }}
            >
                <div>
                    <h1>Sales</h1>
                    <p style={{ color: "#555" }}>
                        Logged in as: <strong>{user?.role || "User"}</strong>
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
                    + Add Sale
                </button>
            </div>

            {message && (
                <p style={{ color: "green" }}>{message}</p>
            )}

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

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
                    <h2>{editingId ? "Edit Sale" : "Add New Sale"}</h2>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Customer *</label>
                        <select
                            name="customerId"
                            value={form.customerId}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        >
                            <option value="">Select a customer</option>

                            {customers.map((customer) => (
                                <option
                                    key={customer._id}
                                    value={customer._id}
                                >
                                    {customer.name || customer.fullName}
                                    {customer.company
                                        ? ` - ${customer.company}`
                                        : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Amount *</label>
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            min="0.01"
                            step="0.01"
                            required
                            style={inputStyle}
                            placeholder="Enter sale amount"
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label>Date *</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                            style={inputStyle}
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
                                : "Save Sale"}
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

            {sales.length === 0 ? (
                <p>No sales found.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "20px",
                            background: "white"
                        }}
                    >
                        <thead>
                            <tr>
                                {[
                                    "Customer",
                                    "Amount",
                                    "Status",
                                    "Date",
                                    "Actions"
                                ].map((heading) => (
                                    <th key={heading} style={cellStyle}>
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {sales.map((sale) => (
                                <tr key={sale._id}>
                                    <td style={cellStyle}>
                                        {sale.customerId?.name ||
                                            sale.customer?.name ||
                                            "Customer"}
                                    </td>

                                    <td style={cellStyle}>
                                        {sale.amount}
                                    </td>

                                    <td style={cellStyle}>
                                        {sale.status}
                                    </td>

                                    <td style={cellStyle}>
                                        {sale.date
                                            ? new Date(
                                                sale.date
                                            ).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        <button
                                            onClick={() => handleEdit(sale)}
                                            style={{ marginRight: "8px" }}
                                        >
                                            Edit
                                        </button>

                                        {isAdmin && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(sale._id)
                                                }
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

export default Sales;