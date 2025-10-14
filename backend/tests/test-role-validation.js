const axios = require('axios');

/**
 * Test script to verify role-based authentication
 * This script tests the backend role validation functionality
 */

const BASE_URL = 'http://localhost:5000/api/auth';

async function testRoleValidation() {
  console.log('🧪 Testing Role-Based Authentication...\n');

  try {
    // Test 1: Login with correct role
    console.log('📝 Test 1: Login with correct role (student)');
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email: 'teststudent@test.com',
        password: 'test123',
        role: 'student'
      });
      console.log('✅ Success:', response.data.message);
      console.log('   User role:', response.data.user.role);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    // Test 2: Login with incorrect role
    console.log('\n📝 Test 2: Login with incorrect role (student trying to login as educator)');
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email: 'teststudent@test.com',
        password: 'test123',
        role: 'educator'
      });
      console.log('❌ Unexpected success:', response.data.message);
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Access denied correctly:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
      }
    }

    // Test 3: Login with admin role (should work for any user)
    console.log('\n📝 Test 3: Login with admin role (should work for any user)');
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email: 'teststudent@test.com',
        password: 'test123',
        role: 'admin'
      });
      console.log('✅ Admin access granted:', response.data.message);
      console.log('   User role:', response.data.user.role);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    // Test 4: Login without role (should work)
    console.log('\n📝 Test 4: Login without role (should work)');
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email: 'teststudent@test.com',
        password: 'learn123'
      });
      console.log('✅ Login without role successful:', response.data.message);
      console.log('   User role:', response.data.user.role);
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }

    console.log('\n🎯 Role validation test completed!');
    console.log('\n📋 Summary:');
    console.log('   - Correct role: ✅ Should succeed');
    console.log('   - Incorrect role: ❌ Should return 403 Access Denied');
    console.log('   - Admin role: ✅ Should succeed for any user');
    console.log('   - No role: ✅ Should succeed (backward compatibility)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testRoleValidation();
