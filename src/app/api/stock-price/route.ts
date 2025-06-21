// app/api/stock-price/route.ts
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

// GET /api/stock-price?symbol=INFY.NS
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  try {
    const quote = await yahooFinance.quote(symbol);
    return NextResponse.json({
      symbol,
      price: quote.regularMarketPrice,
      currency: quote.currency,
    });
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
