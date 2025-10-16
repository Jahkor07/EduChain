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

/**
 * Enhanced chunked plagiarism check for long texts
 * @param {string} content - The content to check
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Chunked plagiarism check results
 */
async function checkPlagiarismChunked(content, options = {}) {
  const {
    maxChunkLength = 2000,
    overlapSize = 100,
    retryAttempts = 2
  } = options;

  if (!content || typeof content !== 'string') {
    throw new Error('Content must be a non-empty string');
  }

  if (content.trim().length < 50) {
    throw new Error('Content must be at least 50 characters long');
  }

  // If content is short enough, use direct check
  if (content.length <= maxChunkLength) {
    return await winstonService.checkPlagiarism(content);
  }

  console.log(`🔍 Processing ${content.length} characters in chunks of ${maxChunkLength}...`);

  // Create overlapping chunks
  const chunks = createOverlappingChunks(content, maxChunkLength, overlapSize);
  const results = [];
  let totalSimilarity = 0;
  let validChunks = 0;
  let failedChunks = 0;

  // Process each chunk
  for (const [index, chunk] of chunks.entries()) {
    let chunkResult = null;
    let attempts = 0;

    // Retry logic for failed chunks
    while (attempts < retryAttempts && !chunkResult) {
      try {
        console.log(`📄 Processing chunk ${index + 1}/${chunks.length} (attempt ${attempts + 1})...`);
        
        chunkResult = await winstonService.checkPlagiarism(chunk);
        
        if (chunkResult.success) {
          const similarity = chunkResult.data?.plagiarism_score || 0;
          console.log(`✅ Chunk ${index + 1}: Similarity ${similarity}%`);
          
          totalSimilarity += similarity;
          validChunks++;
          results.push({
            chunkIndex: index + 1,
            ...chunkResult,
            chunkLength: chunk.length
          });
        } else {
          throw new Error(chunkResult.message || 'Chunk processing failed');
        }
      } catch (error) {
        attempts++;
        console.error(`❌ Error in chunk ${index + 1} (attempt ${attempts}):`, error.message);
        
        if (attempts >= retryAttempts) {
          failedChunks++;
          results.push({
            chunkIndex: index + 1,
            success: false,
            error: error.message,
            chunkLength: chunk.length
          });
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }
  }

  // Calculate overall statistics
  const overallSimilarity = validChunks > 0 ? 
    parseFloat((totalSimilarity / validChunks).toFixed(2)) : 0;

  const successRate = chunks.length > 0 ? 
    parseFloat(((validChunks / chunks.length) * 100).toFixed(2)) : 0;

  console.log(`📊 Overall plagiarism score: ${overallSimilarity}% based on ${validChunks}/${chunks.length} chunks (${successRate}% success rate)`);

  // Determine overall result
  const isPlagiarized = overallSimilarity > 30;
  const confidence = successRate >= 80 ? 'high' : successRate >= 50 ? 'medium' : 'low';

  return {
    overallSimilarity,
    isPlagiarized,
    confidence,
    statistics: {
      totalChunks: chunks.length,
      validChunks,
      failedChunks,
      successRate,
      totalCharacters: content.length,
      averageChunkSize: Math.round(content.length / chunks.length)
    },
    results,
    recommendations: generateRecommendations(overallSimilarity, confidence, failedChunks)
  };
}

/**
 * Create overlapping chunks from text
 * @param {string} text - Input text
 * @param {number} maxLength - Maximum chunk length
 * @param {number} overlap - Overlap size between chunks
 * @returns {Array<string>} - Array of text chunks
 */
function createOverlappingChunks(text, maxLength, overlap) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + maxLength;
    
    // If this isn't the last chunk, try to break at a word boundary
    if (end < text.length) {
      const lastSpace = text.lastIndexOf(' ', end);
      if (lastSpace > start + maxLength * 0.8) {
        end = lastSpace;
      }
    }

    chunks.push(text.slice(start, end));
    start = end - overlap;
  }

  return chunks;
}

/**
 * Generate recommendations based on plagiarism check results
 * @param {number} similarity - Overall similarity score
 * @param {string} confidence - Confidence level
 * @param {number} failedChunks - Number of failed chunks
 * @returns {Array<string>} - Array of recommendations
 */
function generateRecommendations(similarity, confidence, failedChunks) {
  const recommendations = [];

  if (similarity > 50) {
    recommendations.push("⚠️ High similarity detected. Consider rewriting significant portions of the text.");
  } else if (similarity > 30) {
    recommendations.push("⚠️ Moderate similarity detected. Review and cite sources appropriately.");
  } else if (similarity > 10) {
    recommendations.push("✅ Low similarity detected. Consider adding proper citations for any referenced content.");
  } else {
    recommendations.push("✅ Very low similarity detected. Text appears to be original.");
  }

  if (confidence === 'low') {
    recommendations.push("⚠️ Low confidence in results due to processing errors. Consider re-running the check.");
  }

  if (failedChunks > 0) {
    recommendations.push(`⚠️ ${failedChunks} chunks failed to process. Results may be incomplete.`);
  }

  return recommendations;
}

// Add chunked method to the service instance
winstonService.checkPlagiarismChunked = checkPlagiarismChunked;

module.exports = winstonService;

