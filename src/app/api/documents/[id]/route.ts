import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const METADATA_FILE = path.join(UPLOAD_DIR, 'metadata.json');

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'FAMILY_HEAD') {
      return NextResponse.json({ error: 'Unauthorized. Family Head access required.' }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const metadataRaw = await fs.readFile(METADATA_FILE, 'utf-8');
    const documents = JSON.parse(metadataRaw);

    const docIndex = documents.findIndex((d: { id: string }) => d.id === id);
    if (docIndex === -1) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const doc = documents[docIndex];
    
    // Delete file
    const filePath = path.join(UPLOAD_DIR, doc.storedName);
    try {
      await fs.unlink(filePath);
    } catch {
      console.warn('File already missing or could not be deleted:', filePath);
    }

    // Remove from metadata
    documents.splice(docIndex, 1);
    await fs.writeFile(METADATA_FILE, JSON.stringify(documents, null, 2));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
