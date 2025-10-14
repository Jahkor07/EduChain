const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test function to check if server is running
async function testServerConnection() {
  try {
    console.log('🔍 Testing server connection...');
    const response = await axios.get(`${BASE_URL}/courses`);
    console.log('✅ Server is running and responding!');
    console.log('📊 Courses response:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return false;
  }
}

// Test function to check courses endpoint
async function testCoursesEndpoint() {
  try {
    console.log('\n📚 Testing courses endpoint...');
    
    // Test GET /courses (public)
    const getResponse = await axios.get(`${BASE_URL}/courses`);
    console.log('✅ GET /courses working:', getResponse.data);
    
    return true;
  } catch (error) {
    console.log('❌ Courses endpoint test failed:', error.message);
    return false;
  }
}

// Test function to check certificates endpoint (should fail without auth)
async function testCertificatesEndpoint() {
  try {
    console.log('\n🎓 Testing certificates endpoint...');
    
    // Test GET /certificates (should fail without auth)
    const getResponse = await axios.get(`${BASE_URL}/certificates`);
    console.log('⚠️  GET /certificates should have failed (no auth)');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ GET /certificates correctly requires authentication');
      return true;
    } else {
      console.log('❌ Unexpected error:', error.message);
      return false;
    }
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  const serverOk = await testServerConnection();
  if (!serverOk) {
    console.log('\n❌ Server tests failed. Make sure backend is running.');
    return;
  }
  
  const coursesOk = await testCoursesEndpoint();
  const certificatesOk = await testCertificatesEndpoint();
  
  console.log('\n📋 Test Results:');
  console.log(`Server Connection: ${serverOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Courses Endpoint: ${coursesOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Certificates Endpoint: ${certificatesOk ? '✅ PASS' : '❌ FAIL'}`);
  
  if (serverOk && coursesOk && certificatesOk) {
    console.log('\n🎉 All tests passed! Your APIs are working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

// Run tests
runTests().catch(console.error);








