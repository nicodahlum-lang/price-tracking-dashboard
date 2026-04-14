import { NextResponse } from 'next/server';

async function fetchBinancePrice(symbol: string) {
  const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
  const data = await res.json();
  return parseFloat(data.price);
}

export async function GET() {
  try {
    // Target assets for the fintech dashboard
    const symbols = {
      'BTCUSDT': 'BTC',
      'ETHUSDT': 'ETH',
      'BNBUSDT': 'BNB',
      'SOLUSDT': 'SOL'
    };
    
    const pricePromises = Object.entries(symbols).map(async ([binanceSymbol, label]) => {
      const price = await fetchBinancePrice(binanceSymbol);
      return { label, price };
    });
    
    const results = await Promise.all(pricePromises);
    const priceMap = results.reduce((acc, { label, price }) => {
      acc[label] = price;
      return acc;
    }, {} as any);
    
    return NextResponse.json(priceMap);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch live prices' }, { status: 500 });
  }
}
