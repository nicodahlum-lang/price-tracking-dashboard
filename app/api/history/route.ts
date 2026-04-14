import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = '/Users/white/.easyclaw/workspace/stock_history.csv';
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'History file not found' }, { status: 404 });
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.trim().split('\\n');
    const headers = lines[0].split(',');
    
    const result = lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, i) => {
        obj[header.trim()] = values[i]?.trim();
        return obj;
      }, {} as any);
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
