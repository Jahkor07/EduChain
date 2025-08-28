const ipfsService = require('./services/ipfsService');
const fs = require('fs');
const path = require('path');

async function testFileUpload() {
  console.log('🧪 Testing File Upload to IPFS...');
  
  try {
    // Create a test file buffer (simulating what multer provides)
    const testContent = 'This is a test certificate file content for IPFS upload testing.';
    const testBuffer = Buffer.from(testContent, 'utf8');
    
    console.log(`📁 Test file buffer created: ${testBuffer.length} bytes`);
    
    // Test uploading the file
    console.log('📤 Uploading test file to IPFS...');
    const result = await ipfsService.uploadFile(
      testBuffer, 
      'test-certificate.txt', 
      'text/plain'
    );
    
    console.log('✅ File upload successful!');
    console.log('IPFS Hash:', result.ipfsHash);
    console.log('IPFS URL:', result.ipfsUrl);
    
    // Test uploading metadata
    console.log('📤 Uploading test metadata to IPFS...');
    const metadataResult = await ipfsService.uploadMetadata(
      {
        name: 'Test Certificate',
        description: 'Test certificate for file upload verification',
        fileHash: result.ipfsHash,
        test: true
      }, 
      'test-certificate-metadata.json'
    );
    
    console.log('✅ Metadata upload successful!');
    console.log('Metadata Hash:', metadataResult.ipfsHash);
    console.log('Metadata URL:', metadataResult.ipfsUrl);
    
    console.log('\n🎉 All IPFS uploads working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing file upload:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFileUpload();



