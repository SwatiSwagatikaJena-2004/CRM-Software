import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Sales Rep");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await API.post("/register", {
                fullName,
                email,
                password,
                role
            });

            setMessage(response.data.message);

            setFullName("");
            setEmail("");
            setPassword("");
            setRole("Sales Rep");

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f6f8"
            }}
        >
            <div
                style={{
                    width: "400px",
                    padding: "30px",
                    background: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}
            >
                <h1 style={{ textAlign: "center" }}>
                    CRM Registration
                </h1>

                {message && (
                    <p
                        style={{
                            color: "green",
                            textAlign: "center"
                        }}
                    >
                        {message}
                    </p>
                )}

                {error && (
                    <p
                        style={{
                            color: "red",
                            textAlign: "center"
                        }}
                    >
                        {error}
                    </p>
                )}

                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: "15px" }}>
                        <label>Full Name</label>

                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(e.target.value)
                            }
                            placeholder="Enter full name"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter email"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter password"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label>Role</label>

                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        >
                            <option value="Sales Rep">
                                Sales Rep
                            </option>

                            <option value="Admin">
                                Admin
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            cursor: "pointer"
                        }}
                    >
                        {loading
                            ? "Registering..."
                            : "Register"}
                    </button>
                </form>

                <p style={{ textAlign: "center" }}>
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        style={{
                            border: "none",
                            background: "none",
                            cursor: "pointer"
                        }}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Register;