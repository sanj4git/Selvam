/*
  Dashboard.jsx
  -------------
  The authenticated user's financial overview page.

  Sections:
  1. Financial Snapshot — three cards showing Total Assets,
     Total Liabilities, and Net Worth (from /api/dashboard/summary).
  2. Category Pie Chart — expense breakdown by category
     (from /api/dashboard/expenses → byCategory).
  3. Monthly Bar Chart — spending trends over time
     (from /api/dashboard/expenses → byMonth).

  Data is fetched via the dashboard API service on mount.
  Empty-state messages are shown when no data is available.
*/

import { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip,
    ResponsiveContainer,
} from "recharts";
import { getSummary, getExpenseAnalytics } from "../api/dashboard.js";

/* ── Colour palette for the pie chart slices ─────────────────────── */
const PIE_COLORS = [
    "#d4af37", // gold
    "#5b8def", // blue
    "#ff6b6b", // red
    "#51cf66", // green
    "#f59f00", // amber
    "#cc5de8", // purple
    "#20c997", // teal
    "#ff922b", // orange
];

/**
 * Format a number as Indian Rupee currency.
 * @param {number} n — the value to format.
 * @returns {string} e.g. "₹1,25,000.00"
 */
function formatINR(n) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(n);
}

/* ── Component ────────────────────────────────────────────────────── */

export default function Dashboard() {
    /* ── state ── */
    const [summary, setSummary] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ── fetch data on mount ── */
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError("");
            try {
                const [summaryData, analyticsData] = await Promise.all([
                    getSummary(),
                    getExpenseAnalytics(),
                ]);
                setSummary(summaryData);
                setAnalytics(analyticsData);
            } catch (err) {
                setError(
                    err?.response?.data?.message || "Failed to load dashboard data"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    /* ── loading / error states ── */
    if (loading) {
        return (
            <section className="page">
                <div className="dashboard-loading">Loading your financial overview…</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="page">
                <div className="alert">{error}</div>
            </section>
        );
    }

    /* ── derived data ── */
    const { totalAssets = 0, totalLiabilities = 0, netWorth = 0 } = summary || {};
    const byCategory = analytics?.byCategory || [];
    const byMonth = analytics?.byMonth || [];

    /* Determine net-worth card accent class */
    const nwClass = netWorth >= 0 ? "dashboard-card--positive" : "dashboard-card--negative";

    return (
        <section className="page">
            {/* ─── Page header ─── */}
            <div className="page-header">
                <h2>Dashboard</h2>
                <p className="muted">Your financial health at a glance</p>
            </div>

            {/* ─── Financial Snapshot (3 cards) ─── */}
            <div className="dashboard-snapshot">
                {/* Total Assets */}
                <div className="dashboard-card dashboard-card--assets">
                    <div className="dashboard-card__icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                    </div>
                    <span className="dashboard-card__label">Total Assets</span>
                    <span className="dashboard-card__value">{formatINR(totalAssets)}</span>
                </div>

                {/* Total Liabilities */}
                <div className="dashboard-card dashboard-card--liabilities">
                    <div className="dashboard-card__icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                            <polyline points="17 18 23 18 23 12" />
                        </svg>
                    </div>
                    <span className="dashboard-card__label">Total Liabilities</span>
                    <span className="dashboard-card__value">{formatINR(totalLiabilities)}</span>
                </div>

                {/* Net Worth */}
                <div className={`dashboard-card ${nwClass}`}>
                    <div className="dashboard-card__icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                            <path d="M12 18V6" />
                        </svg>
                    </div>
                    <span className="dashboard-card__label">Net Worth</span>
                    <span className="dashboard-card__value">{formatINR(netWorth)}</span>
                </div>
            </div>

            {/* ─── Charts row ─── */}
            <div className="dashboard-charts">
                {/* Category Pie Chart */}
                <div className="card dashboard-chart-card">
                    <h3>Spending by Category</h3>
                    {byCategory.length === 0 ? (
                        <p className="muted dashboard-empty">
                            No expense data yet. Add expenses to see your category breakdown.
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={byCategory}
                                    dataKey="total"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={50}
                                    paddingAngle={3}
                                    label={({ category, percent }) =>
                                        `${category} ${(percent * 100).toFixed(0)}%`
                                    }
                                    labelLine={false}
                                >
                                    {byCategory.map((_, i) => (
                                        <Cell
                                            key={`cell-${i}`}
                                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <PieTooltip
                                    formatter={(value) => formatINR(value)}
                                    contentStyle={{
                                        background: "rgba(15,44,92,0.9)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        borderRadius: "12px",
                                        color: "#fff",
                                    }}
                                />
                                <PieLegend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    wrapperStyle={{ color: "rgba(255,255,255,0.7)" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Monthly Bar Chart */}
                <div className="card dashboard-chart-card">
                    <h3>Monthly Spending Trend</h3>
                    {byMonth.length === 0 ? (
                        <p className="muted dashboard-empty">
                            No monthly data yet. Start logging expenses to track trends.
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={byMonth} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255,255,255,0.08)"
                                />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                />
                                <YAxis
                                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                                />
                                <BarTooltip
                                    formatter={(value) => formatINR(value)}
                                    labelStyle={{ color: "#fff" }}
                                    contentStyle={{
                                        background: "rgba(15,44,92,0.9)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        borderRadius: "12px",
                                        color: "#fff",
                                    }}
                                />
                                <Bar
                                    dataKey="total"
                                    name="Spending"
                                    fill="#d4af37"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={48}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </section>
    );
}
