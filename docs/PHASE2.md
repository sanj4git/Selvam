# Phase 2: Automation, Analytics & UI Overhaul

## 1. Frontend "Glow-up" (UI/UX)
* **Dashboard Visuals:** Integrate `Recharts` to show Net Worth trends and Expense donuts.
* **Dark Mode / Glassmorphism:** Enhance `index.css` with better depth and micro-interactions.
* **Empty States:** Add professional illustrations for "No Data Found" scenarios.
* **Toast Notifications:** Replace basic alerts with `react-toastify` for success/error feedback.

## 2. API Automations (India-Centric)
* **Gold/Silver Prices:** Integrate a live Metal Price API to auto-update gold asset values.
* **Mutual Fund NAV:** Use RapidAPI or similar to fetch daily NAV for MF holdings.
* **Stock Market Integration:** Basic tracking for NSE/BSE stock prices.
* **Scheduled Jobs:** Implement `node-cron` on the backend to refresh these prices every 24 hours.

## 3. Net Worth Deep-Dive
* **Historical Snapshots:** Start saving a monthly "Net Worth Snapshot" to track wealth growth over time.
* **Debt-to-Asset Ratio:** Add a health-check metric on the dashboard.

## 4. Family Sharing (Early Access)
* **Invite System:** Allow a "Head of Family" to invite another user to view (but not edit) the dashboard.
