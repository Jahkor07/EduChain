/**
 * Winston Service Test Script
 * 
 * This script demonstrates how to use the Winston plagiarism detection service.
 * Run with: node test-winston.js
 */

require('dotenv').config();
const winstonService = require('./services/winstonService');

async function testWinstonService() {
  console.log('🧪 Testing Winston Plagiarism Detection Service\n');

  // Test 1: Check service status
  console.log('1. Checking service status...');
  const status = winstonService.getStatus();
  console.log('Status:', status);
  console.log('');

  // Test 2: Test connection (if API key is configured)
  if (status.apiKey === 'Configured') {
    console.log('2. Testing API connection...');
    try {
      const connectionTest = await winstonService.testConnection();
      console.log('Connection test result:', connectionTest);
      console.log('');
    } catch (error) {
      console.log('Connection test failed:', error.message);
      console.log('');
    }

    // Test 3: Check plagiarism (if connection is successful)
    console.log('3. Testing plagiarism detection...');
    const testText = `
      This is a comprehensive sample text to test the Winston AI plagiarism detection service.
      The text should be checked for potential plagiarism and return detailed results
      including a plagiarism score and any matches found. This text contains multiple sentences
      to ensure it meets the minimum character requirement of 100 characters for the API.
      The Winston AI service will analyze this content for originality and provide
      a detailed report on any potential plagiarism issues detected.
    `;

    try {
      const result = await winstonService.checkPlagiarism(testText);
      console.log('Plagiarism check result:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.log('Plagiarism check failed:', error.message);
    }
  } else {
    console.log('⚠️  Winston API key not configured. Please set WINSTON_API_KEY in your .env file');
    console.log('Example: WINSTON_API_KEY=your_api_key_here');
  }

  console.log('\n✅ Winston service test completed');
}

// Run the test
testWinstonService().catch(console.error);

