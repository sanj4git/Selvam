/*
  financeCalculator.js
  --------------------
  Utility functions for calculating dynamic financial values.
*/

/*
  Convert compounding frequency into numeric value
*/
function getFrequencyValue(freq) {
  switch (freq) {
    case "daily":
      return 365;
    case "monthly":
      return 12;
    case "yearly":
    default:
      return 1;
  }
}

/*
  Calculate compound interest

  Formula:
  A = P (1 + r/n)^(nt)

  P = principal
  r = interest rate
  n = compounding frequency
  t = time in years
*/
export function calculateCompoundInterest(principal, rate, frequency, startDate) {
  if (!rate || rate === 0) return principal;

  const n = getFrequencyValue(frequency);

  const start = new Date(startDate);
  const now = new Date();

  const years = (now - start) / (1000 * 60 * 60 * 24 * 365);

  const amount =
    principal * Math.pow(1 + rate / 100 / n, n * years);

  return Number(amount.toFixed(2));
}

/*
  Calculate gold value using market price

  quantity = grams
  marketPrice = price per gram
*/
export function calculateGoldValue(quantity, marketPrice) {
  if (!quantity || !marketPrice) return 0;

  return quantity * marketPrice;
}

/*
  Resolve current asset value dynamically
*/
export function calculateCurrentAssetValue(asset, marketPrice = null) {
  // Fixed Deposit / Savings
  if (asset.interestRate && asset.interestRate > 0) {
    return calculateCompoundInterest(
      asset.value,
      asset.interestRate,
      asset.compoundingFrequency,
      asset.purchaseDate
    );
  }

  // Gold assets
  if (asset.assetType.toLowerCase() === "gold" && marketPrice) {
    return calculateGoldValue(asset.quantity, marketPrice);
  }

  // Default: static value
  return asset.value;
}