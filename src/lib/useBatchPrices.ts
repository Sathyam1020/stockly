import axios from "axios";

export const fetchPrice = async (symbol: string) => {
  try {
    const res = await axios.get(`/api/stock-price?symbol=${symbol}`);
    return res.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to fetch price for ${symbol}:`, error.message);
    } else {
      console.error(`Failed to fetch price for ${symbol}:`, error);
    }
    throw new Error(`Could not fetch stock price for ${symbol}. Please try again later.`);
  }
};