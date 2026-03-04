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
  4. Liability Pie Chart — breakdown of liabilities by type
     (from /api/dashboard/liabilities).

  Data is fetched via the dashboard API service on mount.
  Empty-state messages are shown when no data is available.
*/

import { useEffect, useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip,
    ResponsiveContainer,
} from "recharts";

import {
    getSummary,
    getExpenseAnalytics,
    getLiabilityBreakdown
} from "../api/dashboard.js";

/* ── Colour palette for the pie chart slices ─────────────────────── */
const PIE_COLORS = [
    "#d4af37",
    "#5b8def",
    "#ff6b6b",
    "#51cf66",
    "#f59f00",
    "#cc5de8",
    "#20c997",
    "#ff922b",
];

/* Format INR */
function formatINR(n) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(n);
}

export default function Dashboard() {

    /* ── state ── */
    const [summary, setSummary] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [liabilities, setLiabilities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ── fetch data on mount ── */
    useEffect(() => {

        const fetchAll = async () => {

            setLoading(true);
            setError("");

            try {

                const [
                    summaryData,
                    analyticsData,
                    liabilityData
                ] = await Promise.all([
                    getSummary(),
                    getExpenseAnalytics(),
                    getLiabilityBreakdown()
                ]);

                setSummary(summaryData);
                setAnalytics(analyticsData);
                setLiabilities(liabilityData);

            } catch (err) {

                setError(
                    err?.response?.data?.message ||
                    "Failed to load dashboard data"
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
                <div className="dashboard-loading">
                    Loading your financial overview…
                </div>
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

    const nwClass =
        netWorth >= 0
            ? "dashboard-card--positive"
            : "dashboard-card--negative";

    return (

        <section className="page">

            {/* Page header */}

            <div className="page-header">
                <h2>Dashboard</h2>
                <p className="muted">
                    Your financial health at a glance
                </p>
            </div>

            {/* Financial Snapshot */}

            <div className="dashboard-snapshot">

                <div className="dashboard-card dashboard-card--assets">
                    <span className="dashboard-card__label">
                        Total Assets
                    </span>
                    <span className="dashboard-card__value">
                        {formatINR(totalAssets)}
                    </span>
                </div>

                <div className="dashboard-card dashboard-card--liabilities">
                    <span className="dashboard-card__label">
                        Total Liabilities
                    </span>
                    <span className="dashboard-card__value">
                        {formatINR(totalLiabilities)}
                    </span>
                </div>

                <div className={`dashboard-card ${nwClass}`}>
                    <span className="dashboard-card__label">
                        Net Worth
                    </span>
                    <span className="dashboard-card__value">
                        {formatINR(netWorth)}
                    </span>
                </div>

            </div>

            {/* Charts row */}

            <div className="dashboard-charts">

                {/* Expense Category Pie */}

                <div className="card dashboard-chart-card">

                    <h3>Spending by Category</h3>

                    {byCategory.length === 0 ? (

                        <p className="muted dashboard-empty">
                            No expense data yet.
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
                                >

                                    {byCategory.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                                        />
                                    ))}

                                </Pie>

                                <PieTooltip formatter={(v) => formatINR(v)} />
                                <PieLegend verticalAlign="bottom" />

                            </PieChart>

                        </ResponsiveContainer>

                    )}

                </div>

                {/* Monthly Bar Chart */}

                <div className="card dashboard-chart-card">

                    <h3>Monthly Spending Trend</h3>

                    {byMonth.length === 0 ? (

                        <p className="muted dashboard-empty">
                            No monthly data yet.
                        </p>

                    ) : (

                        <ResponsiveContainer width="100%" height={300}>

                            <BarChart data={byMonth}>

                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />

                                <BarTooltip
                                    formatter={(v) => formatINR(v)}
                                />

                                <Bar
                                    dataKey="total"
                                    fill="#d4af37"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    )}

                </div>

                {/* Liability Pie Chart */}

                <div className="card dashboard-chart-card">

                    <h3>Liability Breakdown</h3>

                    {liabilities.length === 0 ? (

                        <p className="muted dashboard-empty">
                            No liabilities yet.
                        </p>

                    ) : (

                        <ResponsiveContainer width="100%" height={300}>

                            <PieChart>

                                <Pie
                                    data={liabilities}
                                    dataKey="total"
                                    nameKey="category"
                                    outerRadius={100}
                                    innerRadius={50}
                                >

                                    {liabilities.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                                        />
                                    ))}

                                </Pie>

                                <PieTooltip formatter={(v) => formatINR(v)} />
                                <PieLegend verticalAlign="bottom" />

                            </PieChart>

                        </ResponsiveContainer>

                    )}

                </div>

            </div>

        </section>
    );
}

