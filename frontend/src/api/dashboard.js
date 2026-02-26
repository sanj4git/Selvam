/*
  Dashboard API Service
  ---------------------
  Thin wrapper around the backend dashboard endpoints.

  Endpoints consumed:
  - GET /api/dashboard/summary   → { totalAssets, totalLiabilities, netWorth }
  - GET /api/dashboard/expenses  → { byCategory: [{category, total}], byMonth: [{month, total}] }

  Both endpoints are JWT-protected; the Axios interceptor in client.js
  automatically attaches the Bearer token.
*/

import api from "./client.js";

/**
 * Fetch the financial snapshot for the logged-in user.
 * @returns {Promise<{totalAssets: number, totalLiabilities: number, netWorth: number}>}
 */
export async function getSummary() {
    const { data } = await api.get("/api/dashboard/summary");
    return data;
}

/**
 * Fetch expense analytics (category-wise & month-wise breakdowns).
 * @returns {Promise<{byCategory: Array, byMonth: Array}>}
 */
export async function getExpenseAnalytics() {
    const { data } = await api.get("/api/dashboard/expenses");
    return data;
}
