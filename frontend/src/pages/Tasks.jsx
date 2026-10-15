import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Tasks() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const emptyForm = {
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending"
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

    const fetchTasks = async () => {
        try {
            const response = await API.get("/tasks");

            setTasks(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.tasks || []
            );

            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load tasks."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
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

    const handleEdit = (task) => {
        setEditingId(task._id);

        setForm({
            title: task.title || "",
            description: task.description || "",
            dueDate: task.dueDate
                ? new Date(task.dueDate).toISOString().split("T")[0]
                : "",
            priority: task.priority || "Medium",
            status: task.status || "Pending"
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
                await API.put(`/tasks/${editingId}`, form);
                setMessage("Task updated successfully!");
            } else {
                const user = JSON.parse(
                    localStorage.getItem("user") || "null"
                );

                const userId = user?._id || user?.id;

                if (!userId) {
                    setError(
                        "User ID is missing. Please log out and log in again."
                    );
                    return;
                }

                await API.post("/tasks", {
                    ...form,
                    assignedTo: userId
                });

                setMessage("Task added successfully!");
            }

            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);

            await fetchTasks();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save task."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (taskId) => {
        if (!isAdmin) {
            setError("Only Admin users can delete tasks.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            await API.delete(`/tasks/${taskId}`);

            setMessage("Task deleted successfully!");
            await fetchTasks();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete task. Check your permissions."
            );
        }
    };

    if (loading) {
        return <h2 style={{ padding: "30px" }}>Loading tasks...</h2>;
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
                style={{
                    padding: "10px 16px",
                    cursor: "pointer"
                }}
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
                    <h1>Tasks</h1>
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
                    + Add Task
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
                    <h2>{editingId ? "Edit Task" : "Add New Task"}</h2>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Title *</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                            placeholder="Task title"
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            style={{
                                ...inputStyle,
                                minHeight: "80px"
                            }}
                            placeholder="Task description"
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Due Date *</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Priority</label>
                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
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
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
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
                            : editingId
                                ? "Save Changes"
                                : "Save Task"}
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

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
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
                                    "Title",
                                    "Description",
                                    "Due Date",
                                    "Priority",
                                    "Assigned To",
                                    "Status",
                                    "Actions"
                                ].map((heading) => (
                                    <th key={heading} style={cellStyle}>
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id}>
                                    <td style={cellStyle}>{task.title}</td>

                                    <td style={cellStyle}>
                                        {task.description || "-"}
                                    </td>

                                    <td style={cellStyle}>
                                        {task.dueDate
                                            ? new Date(
                                                task.dueDate
                                            ).toLocaleDateString()
                                            : "-"}
                                    </td>

                                    <td style={cellStyle}>{task.priority}</td>

                                    <td style={cellStyle}>
                                        {task.assignedTo?.fullName ||
                                            task.assignedTo?.name ||
                                            "-"}
                                    </td>

                                    <td style={cellStyle}>{task.status}</td>

                                    <td style={cellStyle}>
                                        <button
                                            onClick={() => handleEdit(task)}
                                            style={{
                                                marginRight: "8px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Edit
                                        </button>

                                        {isAdmin && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(task._id)
                                                }
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

export default Tasks;