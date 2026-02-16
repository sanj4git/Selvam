# Phase 2: Analytics Integration & Automation

## 1. Dashboard Integration (URGENT)
* **Frontend Connection:** Create `Dashboard.jsx` to fetch data from `/api/dashboard/summary` and `/api/dashboard/expenses`.
* **Net Worth Display:** Implement a "Financial Snapshot" section showing Total Assets, Total Liabilities, and Net Worth.
* **Data Visualization:** Use `Recharts` to turn the backend's `byCategory` and `byMonth` data into Pie and Line charts.

## 2. UI/UX Overhaul
* **Modernize Look:** Enhance `index.css` with a "Glassmorphism" effect for cards and improved "Gold" accent interactions.
* **Responsive Tables:** Replace standard row layouts with interactive data grids that look better on mobile.
* **Loading States:** Implement skeleton screens or branded loaders to improve perceived performance.

## 3. Automation & Market APIs
* **Gold Price Tracking:** Integrate a live API to auto-update Gold asset values based on current market rates.
* **Mutual Fund Integration:** Fetch daily NAV updates for manual MF entries.
* **Scheduled Sync:** Set up a backend worker to refresh all market-linked asset values every 24 hours.

## 4. Family Sharing & Insights
* **Shared Access:** Allow a primary user to invite family members with "Read-Only" permissions.
* **Spend Alerts:** Implement frontend notifications when a category (e.g., "Food") exceeds a set monthly budget.
