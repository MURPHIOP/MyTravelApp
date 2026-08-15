const fs = require('fs');

async function testUpload() {
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: '123' })
  });
  
  const cookie = loginRes.headers.get('set-cookie');
  console.log('Login successful:', loginRes.status, cookie ? 'Cookie received' : 'No cookie');

  const formData = new FormData();
  formData.append('file', new Blob([fs.readFileSync('./test-train.pdf')]), 'test-train.pdf');
  formData.append('category', 'TRAIN TICKETS');

  const uploadRes = await fetch('http://localhost:3000/api/documents/upload', {
    method: 'POST',
    headers: { 'Cookie': cookie },
    body: formData
  });

  const uploadData = await uploadRes.json();
  console.log('Upload:', uploadRes.status, uploadData);

  const listRes = await fetch('http://localhost:3000/api/documents/list', {
    headers: { 'Cookie': cookie },
  });
  const listData = await listRes.json();
  console.log('List:', listData.documents.length, 'documents');

  if (uploadData.document?.id) {
    const delRes = await fetch(`http://localhost:3000/api/documents/${uploadData.document.id}`, {
      method: 'DELETE',
      headers: { 'Cookie': cookie },
    });
    console.log('Delete:', delRes.status);
  }
}

testUpload().catch(console.error);
