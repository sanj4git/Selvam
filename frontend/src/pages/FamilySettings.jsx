import { useEffect, useState } from "react";
import { getFamily, generateJoinCode, joinFamily, createFamily } from "../api/family.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function FamilySettings() {
    const { user } = useAuth();
    const [familyData, setFamilyData] = useState(null);
    const [members, setMembers] = useState([]);
    const [joinCodeInput, setJoinCodeInput] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFamily();
    }, []);

    const fetchFamily = async () => {
        setLoading(true);
        try {
            const data = await getFamily();
            setFamilyData(data.family);
            setMembers(data.members);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to fetch family data");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateCode = async () => {
        try {
            setError("");
            setSuccess("");
            const data = await generateJoinCode();
            setFamilyData({ ...familyData, joinCode: data.joinCode });
            setSuccess("New join code generated successfully.");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to generate join code");
        }
    };

    const handleJoinFamily = async (e) => {
        e.preventDefault();
        if (!joinCodeInput.trim()) return;
        try {
            setError("");
            setSuccess("");
            await joinFamily(joinCodeInput);
            setJoinCodeInput("");
            setSuccess("Successfully joined new family.");
            fetchFamily();
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to join family");
        }
    };

    const handleCreateFamily = async () => {
        try {
            setError("");
            setSuccess("");
            await createFamily();
            setSuccess("Successfully created a new family.");
            fetchFamily();
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to create family");
        }
    };

    if (loading && !familyData) {
        return (
            <section className="page">
                <div className="muted">Loading family settings...</div>
            </section>
        );
    }

    const isHead = familyData && user && familyData.headUserId === user._id;

    return (
        <section className="page">
            <div className="page-header">
                <h2>Family Settings</h2>
                <p className="muted">Manage your household members and join codes</p>
            </div>

            {error && <div className="alert">{error}</div>}
            {success && <div className="alert" style={{ backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" }}>{success}</div>}

            {/* Family Info Card */}
            {familyData && (
                <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3 style={{ margin: 0 }}>{familyData.name}</h3>
                        <span className="muted" style={{ fontWeight: 600 }}>Role: {isHead ? "Head" : "Member"}</span>
                    </div>

                    {familyData.joinCode ? (
                        <div style={{ background: "linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(15, 44, 92, 0.4))", border: "1px solid rgba(212, 175, 55, 0.2)", padding: "1.5rem", borderRadius: "12px", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--soft-gold)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>Family Join Code</p>
                                <p style={{ margin: "8px 0 0", fontFamily: "monospace", fontSize: "1.8rem", fontWeight: "bold", color: "var(--white)", letterSpacing: "2px" }}>{familyData.joinCode}</p>
                            </div>
                            <button onClick={handleGenerateCode} className="btn" style={{ fontSize: "0.9rem", padding: "10px 16px", background: "rgba(212, 175, 55, 0.15)", color: "var(--gold-accent)", border: "1px solid rgba(212, 175, 55, 0.3)", backdropFilter: "blur(4px)" }}>
                                Regenerate Code
                            </button>
                        </div>
                    ) : (
                        <div style={{ marginBottom: "1.5rem" }}>
                            <p className="muted">You are a member of this family. Only the Head can manage the join code.</p>
                        </div>
                    )}

                    <h4 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Members</h4>
                    {members.length === 0 ? (
                        <div className="muted">No members found.</div>
                    ) : (
                        <div className="table">
                            <div className="table-row table-head">
                                <div>Name</div>
                                <div>Email</div>
                                <div>Role</div>
                                <div>Joined</div>
                            </div>
                            {members.map((member) => (
                                <div key={member._id} className="table-row">
                                    <div style={{ fontWeight: "500" }}>{member.name}</div>
                                    <div>{member.email}</div>
                                    <div>
                                        <span style={{
                                            padding: "4px 10px",
                                            borderRadius: "12px",
                                            fontSize: "0.8rem",
                                            fontWeight: "600",
                                            backgroundColor: member.role === "Head" ? "rgba(212, 175, 55, 0.15)" : "rgba(255, 255, 255, 0.05)",
                                            color: member.role === "Head" ? "var(--gold-accent)" : "rgba(255, 255, 255, 0.7)",
                                            border: `1px solid ${member.role === "Head" ? "rgba(212, 175, 55, 0.3)" : "rgba(255, 255, 255, 0.1)"}`
                                        }}>
                                            {member.role || "Member"}
                                        </span>
                                    </div>
                                    <div className="muted" style={{ fontSize: "0.85rem" }}>
                                        {new Date(member.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Join Another Family Card */}
            <div className="card" style={{ marginBottom: "1.5rem" }}>
                <h3>Join Existing Family</h3>
                <p className="muted" style={{ marginBottom: "1.5rem" }}>
                    Have a join code from another family head? Enter it below.
                    Warning: Joining another family will revoke access to your current family's shared data.
                </p>
                <form onSubmit={handleJoinFamily} className="form" style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                    <label style={{ flex: 1, marginBottom: 0 }}>
                        Join Code
                        <input
                            type="text"
                            value={joinCodeInput}
                            onChange={(e) => setJoinCodeInput(e.target.value)}
                            placeholder="e.g. A1B2C3D4"
                        />
                    </label>
                    <button type="submit" className="btn" style={{ whiteSpace: "nowrap", height: "42px" }}>
                        Join Family
                    </button>
                </form>
            </div>

            {/* Create New Family Card (only if not already a head) */}
            {!familyData && (
                <div className="card">
                    <h3>Create a New Family</h3>
                    <p className="muted" style={{ marginBottom: "1.5rem" }}>
                        Don't have a family to join? You can create your own family unit and become the Head.
                        You will be able to invite members later.
                    </p>
                    <button onClick={handleCreateFamily} className="btn" style={{ background: "var(--gold-accent)", color: "var(--dark-navy)" }}>
                        Create Family
                    </button>
                </div>
            )}
        </section>
    );
}
