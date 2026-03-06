import axios from "axios";
import Asset from "../models/Asset.js";

/**
 * @desc    Fetch Gold Price in INR
 * @returns {Promise<number>} Price per gram
 */
const fetchGoldPrice = async () => {
    try {
        if (!process.env.GOLD_API_KEY || process.env.GOLD_API_KEY === "goldapi-demo-token") {
            throw new Error("No API key provided for Gold API");
        }
        
        const response = await axios.get("https://www.goldapi.io/api/XAU/INR", {
            headers: { "x-access-token": process.env.GOLD_API_KEY }
        });

        // Price is typically for 1 Troy Ounce (31.1035 grams)
        const pricePerGram = response.data.price / 31.1035;
        return pricePerGram;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            throw new Error("Invalid or Missing API key for Gold API");
        }
        console.error("Error fetching gold price:", error.message);
        throw error;
    }
};

/**
 * @desc    Fetch Mutual Fund NAV
 * @param   {string} schemeCode
 * @returns {Promise<number>} NAV
 */
const fetchMFNAV = async (schemeCode) => {
    try {
        const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`);
        if (response.data && response.data.data && response.data.data.length > 0) {
            return parseFloat(response.data.data[0].nav);
        }
        throw new Error("Invalid scheme code: " + schemeCode);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error("Invalid scheme code: " + schemeCode);
        }
        console.error(`Error fetching NAV for MF ${schemeCode}:`, error.message);
        throw new Error("Invalid scheme code: " + schemeCode);
    }
};

/**
 * @desc    Sync all market-linked assets
 */
export const syncValuations = async () => {
    console.log(`[${new Date().toISOString()}] Starting Asset Valuation Sync...`);
    let successCount = 0;
    let failCount = 0;
    const errorsList = [];

    try {
        const marketAssets = await Asset.find({ isMarketLinked: true });

        // Cache gold price to avoid redundant calls
        let cachedGoldPrice = null;

        for (const asset of marketAssets) {
            try {
                let newValue = asset.value;

                if (asset.assetType.toLowerCase() === "gold") {
                    if (!cachedGoldPrice) {
                        cachedGoldPrice = await fetchGoldPrice();
                    }
                    newValue = cachedGoldPrice * asset.quantity;
                } else if (asset.assetType.toLowerCase() === "investment" && asset.symbol) {
                    const nav = await fetchMFNAV(asset.symbol);
                    newValue = nav * asset.quantity;
                }

                if (newValue !== asset.value) {
                    asset.value = newValue;
                    await asset.save();
                    console.log(`Updated ${asset.name}: New Value = ${newValue}`);
                }
                successCount++;
            } catch (err) {
                console.error(`Failed to update asset ${asset.name}:`, err.message);
                errorsList.push(`${asset.name}: ${err.message}`);
                failCount++;
            }
        }

        console.log(`[${new Date().toISOString()}] Sync Finished. Success: ${successCount}, Failed: ${failCount}`);
        
        if (errorsList.length > 0) {
            throw new Error(errorsList.join(" | "));
        }
    } catch (error) {
        console.error("Critical error during valuation sync:", error.message);
        throw error; // Re-throw so the controller can catch it
    }
};

/**
 * @desc    Manual trigger for valuation sync (Controller)
 */
export const triggerSync = async (req, res) => {
    try {
        await syncValuations();
        res.status(200).json({ message: "Sync job triggered successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
