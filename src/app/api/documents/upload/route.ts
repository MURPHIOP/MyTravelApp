import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import fs from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'src/lib/private_uploads');
const METADATA_FILE = path.join(UPLOAD_DIR, 'metadata.json');

// Ensure directory and metadata exist
async function initStorage() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
  try {
    await fs.access(METADATA_FILE);
  } catch {
    await fs.writeFile(METADATA_FILE, JSON.stringify([]));
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'FAMILY_HEAD') {
      return NextResponse.json({ error: 'Unauthorized. Family Head access required.' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;

    if (!file || !category) {
      return NextResponse.json({ error: 'File and category are required' }, { status: 400 });
    }

    await initStorage();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const id = Date.now().toString();
    const extension = path.extname(file.name) || '.pdf';
    const filename = `${id}${extension}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    await fs.writeFile(filePath, buffer);

    // Update metadata
    const metadataRaw = await fs.readFile(METADATA_FILE, 'utf-8');
    const metadata = JSON.parse(metadataRaw);

    const docEntry = {
      id,
      filename: file.name,
      storedName: filename,
      category,
      size: file.size,
      mimeType: file.type,
      uploadDate: new Date().toISOString(),
      uploadedBy: session.name || session.username,
      url: `/api/documents/${id}/download`,
    };

    metadata.push(docEntry);
    await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));

    return NextResponse.json({ success: true, document: docEntry }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
