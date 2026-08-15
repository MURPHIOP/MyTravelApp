import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'src/lib/private_uploads');
const METADATA_FILE = path.join(UPLOAD_DIR, 'metadata.json');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    let metadataRaw;
    try {
      metadataRaw = await fs.readFile(METADATA_FILE, 'utf-8');
    } catch {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const documents = JSON.parse(metadataRaw);
    const doc = documents.find((d: { id: string }) => d.id === id);

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const filePath = path.join(UPLOAD_DIR, doc.storedName);
    let fileBuffer;
    try {
      fileBuffer = await fs.readFile(filePath);
    } catch {
      return NextResponse.json({ error: 'File missing on disk' }, { status: 404 });
    }

    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': doc.mimeType || 'application/pdf',
        'Content-Disposition': `inline; filename="${doc.filename}"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
