
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  try {
    const quote = await yahooFinance.quote(symbol);

    if (!quote || !quote.regularMarketPrice) {
      return NextResponse.json(
        { error: `No valid data found for symbol: ${symbol}` },
        { status: 404 }
      );
    }

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

    console.error(`Error fetching price for ${symbol}:`, errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
