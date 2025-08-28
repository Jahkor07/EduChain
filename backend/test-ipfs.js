const ipfsService = require('./services/ipfsService');

async function testIPFS() {
  console.log('🧪 Testing IPFS/Pinata Connection...');
  
  try {
    // Test the connection
    const isConnected = await ipfsService.testConnection();
    
    if (isConnected) {
      console.log('✅ IPFS connection successful!');
      
      // Test uploading a simple metadata
      console.log('📤 Testing metadata upload...');
      const testMetadata = {
        name: 'Test Certificate',
        description: 'Test certificate for IPFS connection',
        test: true
      };
      
      const result = await ipfsService.uploadMetadata(testMetadata, 'test-metadata.json');
      console.log('✅ Metadata upload successful!');
      console.log('IPFS Hash:', result.ipfsHash);
      console.log('IPFS URL:', result.ipfsUrl);
      
    } else {
      console.log('❌ IPFS connection failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing IPFS:', error.message);
  }
}

testIPFS();



