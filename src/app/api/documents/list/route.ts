import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const METADATA_FILE = path.join(UPLOAD_DIR, 'metadata.json');

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await fs.access(METADATA_FILE);
    } catch {
      return NextResponse.json({ documents: [] }, { status: 200 });
    }

    const metadataRaw = await fs.readFile(METADATA_FILE, 'utf-8');
    const documents = JSON.parse(metadataRaw);

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
