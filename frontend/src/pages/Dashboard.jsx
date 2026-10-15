import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    const [summary, setSummary] = useState({
        customers: 0,
        leads: 0,
        pendingTasks: 0,
        totalSales: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const [customersRes, leadsRes, tasksRes, salesRes] =
                    await Promise.all([
                        API.get("/customers"),
                        API.get("/leads"),
                        API.get("/tasks"),
                        API.get("/sales")
                    ]);

                const getRecords = (data, key) => {
                    if (Array.isArray(data)) return data;
                    return Array.isArray(data?.[key]) ? data[key] : [];
                };

                const customers = getRecords(customersRes.data, "customers");
                const leads = getRecords(leadsRes.data, "leads");
                const tasks = getRecords(tasksRes.data, "tasks");
                const sales = getRecords(salesRes.data, "sales");

                setSummary({
                    customers: customers.length,
                    leads: leads.length,
                    pendingTasks: tasks.filter(
                        task => task.status !== "Completed"
                    ).length,
                    totalSales: sales.reduce(
                        (total, sale) =>
                            total + (Number(sale.amount) || 0),
                        0
                    )
                });

                setError("");
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Could not load dashboard statistics."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const cards = [
        {
            title: "Total Customers",
            value: summary.customers,
            description: "Customer records",
            icon: "👥",
            color: "#2563eb",
            path: "/customers"
        },
        {
            title: "Total Leads",
            value: summary.leads,
            description: "Potential customers",
            icon: "🎯",
            color: "#9333ea",
            path: "/leads"
        },
        {
            title: "Pending Tasks",
            value: summary.pendingTasks,
            description: "Tasks not completed",
            icon: "📋",
            color: "#d97706",
            path: "/tasks"
        },
        {
            title: "Total Sales",
            value: `₹${summary.totalSales.toLocaleString("en-IN", {
                maximumFractionDigits: 2
            })}`,
            description: "Sum of sales amounts",
            icon: "💰",
            color: "#16a34a",
            path: "/sales"
        },
        {
            title: "Sales Pipeline",
            value: summary.leads,
            description: "Leads across sales stages",
            icon: "📊",
            color: "#0891b2",
            path: "/sales-pipeline"
        }
    ];

    const modules = [
        {
            title: "Customers",
            description: "Manage customer information",
            path: "/customers"
        },
        {
            title: "Leads",
            description: "Track potential customers",
            path: "/leads"
        },
        {
            title: "Tasks",
            description: "Manage tasks and deadlines",
            path: "/tasks"
        },
        {
            title: "Sales",
            description: "Manage sales records",
            path: "/sales"
        },
        {
            title: "Sales Pipeline",
            description: "Track leads and move them through sales stages",
            path: "/sales-pipeline"
        }
    ];

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f4f6f8",
            fontFamily: "Arial, sans-serif"
        }}>
            <header style={{
                background: "#1f2937",
                color: "white",
                padding: "20px 40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px"
            }}>
                <div>
                    <h2 style={{ margin: 0 }}>CRM Dashboard</h2>
                    <p style={{ margin: "6px 0 0", color: "#d1d5db" }}>
                        Customer Relationship Management
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "10px 18px",
                        cursor: "pointer",
                        border: "none",
                        borderRadius: "6px",
                        background: "white",
                        color: "#1f2937",
                        fontWeight: "bold"
                    }}
                >
                    Logout
                </button>
            </header>

            <main style={{ padding: "30px 40px" }}>
                <h1 style={{ marginBottom: "8px" }}>
                    Welcome, {user?.fullName || user?.name || "User"}!
                </h1>

                <p style={{ color: "#6b7280", marginTop: 0 }}>
                    Here's an overview of your CRM activity.
                </p>

                <p>
                    Role: <strong>{user?.role || "User"}</strong>
                </p>

                {isAdmin && (
                    <div style={{
                        background: "#dbeafe",
                        color: "#1e40af",
                        padding: "16px 20px",
                        borderRadius: "8px",
                        marginTop: "20px"
                    }}>
                        <h3 style={{ margin: "0 0 6px" }}>
                            Administrator Access
                        </h3>
                        <p style={{ margin: 0 }}>
                            You are logged in as an Admin. You can access
                            administrative features permitted by your account.
                        </p>
                    </div>
                )}

                {!isAdmin && user?.role === "Sales Rep" && (
                    <div style={{
                        background: "#dcfce7",
                        color: "#166534",
                        padding: "16px 20px",
                        borderRadius: "8px",
                        marginTop: "20px"
                    }}>
                        <h3 style={{ margin: "0 0 6px" }}>
                            Sales Representative Access
                        </h3>
                        <p style={{ margin: 0 }}>
                            Welcome! Use the CRM modules to manage your
                            permitted sales activities.
                        </p>
                    </div>
                )}

                {error && (
                    <div style={{
                        padding: "12px",
                        background: "#fee2e2",
                        color: "#991b1b",
                        borderRadius: "6px",
                        marginTop: "20px"
                    }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <p>Loading dashboard statistics...</p>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        marginTop: "30px"
                    }}>
                        {cards.map(card => (
                            <div
                                key={card.path}
                                onClick={() => navigate(card.path)}
                                onKeyDown={event => {
                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();
                                        navigate(card.path);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                style={{
                                    background: "white",
                                    padding: "24px",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    borderTop: `4px solid ${card.color}`,
                                    boxShadow:
                                        "0 3px 10px rgba(0,0,0,0.06)"
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <span style={{ color: "#6b7280" }}>
                                        {card.title}
                                    </span>
                                    <span style={{ fontSize: "26px" }}>
                                        {card.icon}
                                    </span>
                                </div>

                                <h2 style={{
                                    fontSize: "30px",
                                    margin: "18px 0 8px",
                                    color: "#111827",
                                    overflowWrap: "anywhere"
                                }}>
                                    {card.value}
                                </h2>

                                <p style={{
                                    color: "#6b7280",
                                    margin: 0,
                                    fontSize: "14px"
                                }}>
                                    {card.description}
                                </p>

                                <p style={{
                                    color: card.color,
                                    marginBottom: 0,
                                    fontWeight: "bold"
                                }}>
                                    View details →
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <h2 style={{ marginTop: "40px" }}>CRM Modules</h2>

                <div style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                    marginTop: "20px"
                }}>
                    {modules.map(module => (
                        <div
                            key={module.path}
                            onClick={() => navigate(module.path)}
                            onKeyDown={event => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    event.preventDefault();
                                    navigate(module.path);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            style={{
                                background: "white",
                                padding: "22px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                boxShadow:
                                    "0 2px 8px rgba(0,0,0,0.05)"
                            }}
                        >
                            <h3 style={{ marginTop: 0 }}>
                                {module.title}
                            </h3>
                            <p style={{ color: "#6b7280" }}>
                                {module.description}
                            </p>
                            <span style={{ color: "#2563eb" }}>
                                Open module →
                            </span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;