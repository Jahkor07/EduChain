const axios = require('axios');
require('dotenv').config();

/**
 * Winston Plagiarism Detection Service
 * 
 * This service provides plagiarism detection functionality using the Winston AI API.
 * It checks text content for potential plagiarism and returns detailed results.
 */

class WinstonService {
  constructor() {
    this.apiKey = process.env.WINSTON_API_KEY;
    this.baseURL = 'https://api.gowinston.ai/v1';
    
    if (!this.apiKey) {
      console.warn('⚠️  WINSTON_API_KEY not found in environment variables');
    }
  }

  /**
   * Check text for plagiarism using Winston AI API
   * @param {string} text - The text content to check for plagiarism
   * @returns {Promise<Object>} - Plagiarism detection results
   * @throws {Error} - If API key is missing or request fails
   */
  async checkPlagiarism(text) {
    try {
      // Validate inputs
      if (!this.apiKey) {
        throw new Error('Winston API key is not configured. Please set WINSTON_API_KEY in your environment variables.');
      }

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw new Error('Text content is required and must be a non-empty string.');
      }

      // Prepare request configuration for Winston AI MCP API
      const config = {
        method: 'POST',
        url: 'https://api.gowinston.ai/mcp/v1',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'EduChain/1.0.0'
        },
        data: {
          jsonrpc: '2.0',
          id: Math.floor(Math.random() * 1000),
          method: 'tools/call',
          params: {
            name: 'plagiarism-detection',
            arguments: {
              text: text.trim(),
              apiKey: this.apiKey
            }
          }
        },
        timeout: 30000 // 30 second timeout
      };

      console.log('🔍 Checking plagiarism with Winston AI...');
      console.log(`📝 Text length: ${text.length} characters`);

      // Make API request
      const response = await axios(config);

      // Validate response
      if (!response.data) {
        throw new Error('Invalid response received from Winston AI API');
      }

      // Handle MCP response format
      let resultData;
      if (response.data.result) {
        // MCP response format - extract the actual result from content
        const content = response.data.result.content;
        if (content && content[0] && content[0].text) {
          try {
            // Parse the JSON response from the text field
            const jsonMatch = content[0].text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              resultData = JSON.parse(jsonMatch[0]);
            } else {
              resultData = response.data.result;
            }
          } catch (parseError) {
            console.warn('Failed to parse Winston AI response JSON:', parseError);
            resultData = response.data.result;
          }
        } else {
          resultData = response.data.result;
        }
      } else if (response.data.error) {
        // MCP error format
        throw new Error(`Winston AI error: ${response.data.error.message || 'Unknown error'}`);
      } else {
        // Direct response format
        resultData = response.data;
      }

      console.log('✅ Plagiarism check completed successfully');
      
      return {
        success: true,
        data: resultData,
        timestamp: new Date().toISOString(),
        textLength: text.length
      };

    } catch (error) {
      console.error('❌ Winston plagiarism check failed:', error.message);

      // Handle different types of errors
      if (error.response) {
        // API responded with error status
        const status = error.response.status;
        const statusText = error.response.statusText;
        const errorData = error.response.data;

        let errorMessage = `Winston API error (${status}): ${statusText}`;
        
        if (errorData && errorData.message) {
          errorMessage += ` - ${errorData.message}`;
        }

        // Handle specific error cases
        if (status === 401) {
          errorMessage = 'Invalid Winston API key. Please check your WINSTON_API_KEY configuration.';
        } else if (status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (status === 400) {
          errorMessage = 'Invalid request. Please check your text content.';
        } else if (status >= 500) {
          errorMessage = 'Winston AI service is temporarily unavailable. Please try again later.';
        }

        throw new Error(errorMessage);

      } else if (error.request) {
        // Network error
        throw new Error('Network error: Unable to connect to Winston AI API. Please check your internet connection.');

      } else if (error.code === 'ECONNABORTED') {
        // Timeout error
        throw new Error('Request timeout: Winston AI API took too long to respond. Please try again.');

      } else {
        // Other errors
        throw new Error(`Plagiarism check failed: ${error.message}`);
      }
    }
  }

  /**
   * Test the Winston API connection
   * @returns {Promise<Object>} - Connection test result
   */
  async testConnection() {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'Winston API key is not configured'
        };
      }

      // Test with a simple text
      const testText = 'This is a test text to verify Winston API connection.';
      const result = await this.checkPlagiarism(testText);

      return {
        success: true,
        message: 'Winston API connection successful',
        apiKey: this.apiKey ? 'Configured' : 'Not configured'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get service status and configuration
   * @returns {Object} - Service status information
   */
  getStatus() {
    return {
      service: 'Winston Plagiarism Detection',
      apiKey: this.apiKey ? 'Configured' : 'Not configured',
      baseURL: this.baseURL,
      status: this.apiKey ? 'Ready' : 'Not configured'
    };
  }
}

// Create and export service instance
const winstonService = new WinstonService();

module.exports = winstonService;

