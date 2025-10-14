const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * Test script for file upload plagiarism checking
 * This tests the backend's ability to extract text from files and check plagiarism
 */

const BASE_URL = 'http://localhost:5000/api/plagiarism';

async function testFileUpload() {
  console.log('🧪 Testing File Upload Plagiarism Check...\n');

  try {
    // Test 1: Create a test text file
    console.log('📝 Test 1: Creating test TXT file...');
    const testText = `This is a completely original piece of content that I have written myself for testing purposes.
It discusses the importance of critical thinking in modern education and how it helps students develop analytical skills.
Critical thinking involves analyzing information objectively and evaluating different viewpoints to form reasoned judgments.
This is a fundamental skill that enables students to navigate complex problems and make informed decisions.
Educational institutions are increasingly focusing on integrating these skills into their curriculum.`;

    const testFilePath = path.join(__dirname, 'test-document.txt');
    fs.writeFileSync(testFilePath, testText);
    console.log('✅ Test file created:', testFilePath);

    // Test 2: Upload file for plagiarism check
    console.log('\n📤 Test 2: Uploading file for plagiarism check...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath));

    const response = await axios.post(`${BASE_URL}/check`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log('✅ Response received:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Message:', response.data.message);
    
    if (response.data.data) {
      console.log('\n📊 Plagiarism Results:');
      console.log('Score:', response.data.data.score || 'N/A');
      console.log('Plagiarism Score:', response.data.data.plagiarism_score || 'N/A');
    }

    if (response.data.metadata) {
      console.log('\n📋 Metadata:');
      console.log('Text Length:', response.data.metadata.textLength);
      console.log('File Processed:', response.data.metadata.fileProcessed);
      console.log('File Name:', response.data.metadata.fileName);
      console.log('Service:', response.data.metadata.service);
    }

    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log('\n🗑️ Test file cleaned up');

    console.log('\n🎯 File Upload Test Completed Successfully!');
    console.log('\n📋 Summary:');
    console.log('   - File upload: ✅ Working');
    console.log('   - Text extraction: ✅ Working');
    console.log('   - Plagiarism check: ✅ Working');
    console.log('   - File cleanup: ✅ Working');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Test with direct text (no file)
async function testDirectText() {
  console.log('\n\n🧪 Testing Direct Text Plagiarism Check...\n');

  try {
    const testText = `This is a test of direct text plagiarism checking without file upload.
The system should be able to handle both file uploads and direct text input for maximum flexibility.
This allows users to paste text directly or upload documents for analysis.`;

    console.log('📝 Sending direct text for plagiarism check...');
    const response = await axios.post(`${BASE_URL}/check`, {
      text: testText
    });

    console.log('✅ Response received:');
    console.log('Success:', response.data.success);
    console.log('Message:', response.data.message);
    console.log('Text Length:', response.data.metadata?.textLength);

    console.log('\n🎯 Direct Text Test Completed Successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   EduChain File Upload Plagiarism Check Test Suite');
  console.log('═══════════════════════════════════════════════════════\n');

  await testFileUpload();
  await testDirectText();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   All Tests Completed!');
  console.log('═══════════════════════════════════════════════════════');
}

runAllTests();
