import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const historyPath = '/Users/white/.easyclaw/workspace/stock_history.csv';
    const assetsPath = '/Users/white/.easyclaw/workspace/tracked_assets.txt';

    if (!fs.existsSync(historyPath) || !fs.existsSync(assetsPath)) {
      return NextResponse.json({ error: 'Data files not found' }, { status: 404 });
    }

    const assetsContent = fs.readFileSync(assetsPath, 'utf-8');
    const trackedAssets = assetsContent.split('\n').map(a => a.trim()).filter(Boolean);

    const historyContent = fs.readFileSync(historyPath, 'utf-8');
    const lines = historyContent.split('\n').filter(Boolean);
    
    // Skip header
    const dataLines = lines.slice(1);
    const history = dataLines.map(line => {
      const [timestamp, asset, price] = line.split(',');
      return { timestamp, asset, price: parseFloat(price) };
    });

    const result = trackedAssets.map(asset => {
      const assetHistory = history
        .filter(h => h.asset === asset)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      if (assetHistory.length === 0) {
        return { asset, currentPrice: null, previousPrice: null, diff: 0, percentChange: 0, history: [] };
      }

      const currentPrice = assetHistory[assetHistory.length - 1].price;
      const previousPrice = assetHistory.length > 1 
        ? assetHistory[assetHistory.length - 2].price 
        : currentPrice;
      
      const diff = currentPrice - previousPrice;
      const percentChange = previousPrice !== 0 ? (diff / previousPrice) * 100 : 0;

      return {
        asset,
        currentPrice,
        previousPrice,
        diff,
        percentChange,
        history: assetHistory.map(h => ({ date: h.timestamp, price: h.price }))
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
