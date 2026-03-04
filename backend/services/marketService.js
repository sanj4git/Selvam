/*
  marketService.js
  ----------------
  Fetch live gold price from external API.
*/

import axios from "axios";

/*
  Fetch gold price per gram in INR
*/
export const getGoldPrice = async () => {
  try {

    // Example API (can be replaced later)
    const response = await axios.get(
      "https://api.metals.live/v1/spot/gold"
    );

    /*
      API returns something like:
      [ { gold: 2320.45 } ]  // price per ounce in USD
    */

    const pricePerOunceUSD = response.data[0].gold;

    // Convert ounce → gram
    const pricePerGramUSD = pricePerOunceUSD / 31.1035;

    // Approx USD → INR conversion
    const USD_TO_INR = 83;

    const pricePerGramINR = pricePerGramUSD * USD_TO_INR;

    return Number(pricePerGramINR.toFixed(2));

  } catch (error) {

    console.error("Gold API error:", error.message);

    // fallback price
    return 6000;
  }
};