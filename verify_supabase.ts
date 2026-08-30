import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing required environment variables.");
  console.error("Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('🚀 Starting Supabase Integration Test Suite...');
  
  const bucketName = 'vault-documents';
  const dummyFileName = `test-file-${Date.now()}.txt`;
  const dummyFileContent = 'This is a test file to verify Supabase storage uploads and RLS policies.';
  
  let insertedRecordId = null;

  try {
    // ---------------------------------------------------------
    // 1. Bucket Connectivity Test
    // ---------------------------------------------------------
    console.log(`\n[1/4] Verifying connection and bucket existence for '${bucketName}'...`);
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw new Error(`Failed to list buckets: ${bucketsError.message}`);
    }

    const bucketExists = buckets.some(b => b.name === bucketName);
    if (!bucketExists) {
      throw new Error(`Bucket '${bucketName}' was not found. Please ensure it is created and public.`);
    }
    console.log('✅ Bucket exists and is accessible.');

    // ---------------------------------------------------------
    // 2. Storage Upload Test
    // ---------------------------------------------------------
    console.log(`\n[2/4] Attempting to upload dummy file '${dummyFileName}'...`);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(dummyFileName, dummyFileContent, {
        contentType: 'text/plain',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}. Check storage RLS policies.`);
    }
    console.log('✅ File uploaded successfully to storage.');

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(dummyFileName);
      
    console.log(`   Public URL generated: ${publicUrlData.publicUrl}`);

    // ---------------------------------------------------------
    // 3. Database Metadata Insert Test
    // ---------------------------------------------------------
    console.log('\n[3/4] Attempting to insert metadata into public.documents table...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('documents')
      .insert([
        {
          name: dummyFileName,
          type: 'text/plain',
          size: Buffer.byteLength(dummyFileContent),
          url: publicUrlData.publicUrl,
          uploaded_by: 'QA Automation Test',
          family: 'MITRA'
        }
      ])
      .select()
      .single();

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}. Check table RLS policies.`);
    }
    
    insertedRecordId = insertData.id;
    console.log(`✅ Metadata inserted successfully! Record ID: ${insertedRecordId}`);

  } catch (error: any) {
    console.error('\n❌ TEST FAILED:', error.message);
  } finally {
    // ---------------------------------------------------------
    // 4. Teardown / Cleanup
    // ---------------------------------------------------------
    console.log('\n[4/4] Commencing Teardown / Cleanup phase...');
    
    // Clean up DB Record
    if (insertedRecordId) {
      const { error: deleteDbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', insertedRecordId);
        
      if (deleteDbError) {
        console.error(`   ⚠️ Failed to delete DB record: ${deleteDbError.message}`);
      } else {
        console.log(`✅ DB record ${insertedRecordId} deleted successfully.`);
      }
    }

    // Clean up Storage File
    const { error: deleteStorageError } = await supabase.storage
      .from(bucketName)
      .remove([dummyFileName]);
      
    if (deleteStorageError) {
      console.error(`   ⚠️ Failed to delete storage file: ${deleteStorageError.message}`);
    } else {
      console.log(`✅ Storage file '${dummyFileName}' deleted successfully.`);
    }

    console.log('\n🏁 Test suite execution finished.');
  }
}

runTests();
