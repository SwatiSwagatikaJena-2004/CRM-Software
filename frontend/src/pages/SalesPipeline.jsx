import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function SalesPipeline() {
    const navigate = useNavigate();

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const stages = [
        "New",
        "Contacted",
        "Qualified",
        "Converted",
        "Lost"
    ];

    const stageColors = {
        New: "#2563eb",
        Contacted: "#d97706",
        Qualified: "#7c3aed",
        Converted: "#16a34a",
        Lost: "#dc2626"
    };

    const fetchLeads = async () => {
        try {
            const response = await API.get("/leads");

            const data = response.data;

            setLeads(
                Array.isArray(data)
                    ? data
                    : data.leads || []
            );

            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load sales pipeline."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleStageChange = async (lead, newStatus) => {
        if (lead.status === newStatus) return;

        setUpdatingId(lead._id);
        setError("");

        try {
            await API.put(`/leads/${lead._id}`, {
                name: lead.name,
                email: lead.email,
                phone: lead.phone || "",
                source: lead.source || "Web",
                status: newStatus
            });

            setLeads((previous) =>
                previous.map((item) =>
                    item._id === lead._id
                        ? { ...item, status: newStatus }
                        : item
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update lead stage."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <h2 style={{ padding: "30px" }}>
                Loading sales pipeline...
            </h2>
        );
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

            <div style={{ margin: "20px 0" }}>
                <h1>Sales Pipeline</h1>
                <p style={{ color: "#6b7280" }}>
                    Track leads as they move through each stage.
                </p>
            </div>

            {error && (
                <p style={{ color: "#dc2626" }}>
                    {error}
                </p>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(210px, 1fr))",
                    gap: "16px",
                    alignItems: "start"
                }}
            >
                {stages.map((stage) => {
                    const stageLeads = leads.filter(
                        (lead) => lead.status === stage
                    );

                    return (
                        <div
                            key={stage}
                            style={{
                                background: "#e9edf2",
                                borderRadius: "10px",
                                padding: "12px",
                                minWidth: 0
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "14px"
                                }}
                            >
                                <h3
                                    style={{
                                        margin: 0,
                                        color: stageColors[stage]
                                    }}
                                >
                                    {stage}
                                </h3>

                                <span
                                    style={{
                                        background: "white",
                                        padding: "4px 9px",
                                        borderRadius: "20px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {stageLeads.length}
                                </span>
                            </div>

                            {stageLeads.length === 0 ? (
                                <p
                                    style={{
                                        color: "#6b7280",
                                        fontSize: "14px"
                                    }}
                                >
                                    No leads in this stage.
                                </p>
                            ) : (
                                stageLeads.map((lead) => (
                                    <div
                                        key={lead._id}
                                        style={{
                                            background: "white",
                                            borderRadius: "8px",
                                            padding: "14px",
                                            marginBottom: "12px",
                                            borderTop:
                                                `4px solid ${stageColors[stage]}`,
                                            boxShadow:
                                                "0 1px 3px rgba(0,0,0,0.08)"
                                        }}
                                    >
                                        <h4
                                            style={{
                                                margin: "0 0 8px",
                                                overflowWrap: "anywhere"
                                            }}
                                        >
                                            {lead.name}
                                        </h4>

                                        <p
                                            style={{
                                                fontSize: "13px",
                                                color: "#4b5563",
                                                overflowWrap: "anywhere",
                                                margin: "5px 0"
                                            }}
                                        >
                                            {lead.email}
                                        </p>

                                        <p
                                            style={{
                                                fontSize: "13px",
                                                color: "#4b5563",
                                                margin: "5px 0 12px"
                                            }}
                                        >
                                            Phone: {lead.phone || "-"}
                                        </p>

                                        <label
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Move to stage
                                        </label>

                                        <select
                                            value={lead.status}
                                            disabled={
                                                updatingId === lead._id
                                            }
                                            onChange={(event) =>
                                                handleStageChange(
                                                    lead,
                                                    event.target.value
                                                )
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                marginTop: "6px",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "5px",
                                                background: "white"
                                            }}
                                        >
                                            {stages.map((option) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </option>
                                            ))}
                                        </select>

                                        {updatingId === lead._id && (
                                            <p
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#2563eb",
                                                    marginBottom: 0
                                                }}
                                            >
                                                Updating...
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SalesPipeline;