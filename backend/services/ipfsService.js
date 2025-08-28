const PinataSDK = require('@pinata/sdk');
const { Readable } = require('stream');
require('dotenv').config();

class IPFSService {
  constructor() {
    this.pinata = new PinataSDK({
      pinataApiKey: process.env.PINATA_API_KEY,
      pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
    });
  }

  /**
   * Upload a file to IPFS via Pinata
   * @param {Buffer} fileBuffer - The file buffer to upload
   * @param {string} fileName - Name of the file
   * @param {string} fileType - MIME type of the file
   * @returns {Promise<Object>} - IPFS hash and URL
   */
  async uploadFile(fileBuffer, fileName, fileType) {
    try {
      console.log(`Uploading file to IPFS: ${fileName}`);
      console.log(`File buffer type: ${typeof fileBuffer}, length: ${fileBuffer.length}`);
      
      // Try using the buffer directly first
      let result;
      try {
        console.log('Attempting direct buffer upload...');
        result = await this.pinata.pinFileToIPFS(fileBuffer, {
          pinataMetadata: {
            name: fileName,
            keyvalues: {
              fileType: fileType,
              uploadedAt: new Date().toISOString()
            }
          }
        });
        console.log('Direct buffer upload successful');
      } catch (directError) {
        console.log('Direct buffer upload failed, trying with stream...');
        console.log('Direct error:', directError.message);
        
        // Fallback to stream approach
        const readableStream = Readable.from(fileBuffer);
        result = await this.pinata.pinFileToIPFS(readableStream, {
          pinataMetadata: {
            name: fileName,
            keyvalues: {
              fileType: fileType,
              uploadedAt: new Date().toISOString()
            }
          }
        });
        console.log('Stream upload successful');
      }

      console.log(`File uploaded successfully to IPFS: ${result.IpfsHash}`);
      
      return {
        ipfsHash: result.IpfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw new Error(`Failed to upload file to IPFS: ${error.message}`);
    }
  }

  /**
   * Upload metadata JSON to IPFS
   * @param {Object} metadata - The metadata object to upload
   * @param {string} name - Name for the metadata
   * @returns {Promise<Object>} - IPFS hash and URL
   */
  async uploadMetadata(metadata, name) {
    try {
      console.log(`Uploading metadata to IPFS: ${name}`);
      
      const result = await this.pinata.pinJSONToIPFS(metadata, {
        pinataMetadata: {
          name: name,
          keyvalues: {
            type: 'certificate-metadata',
            uploadedAt: new Date().toISOString()
          }
        }
      });

      console.log(`Metadata uploaded successfully to IPFS: ${result.IpfsHash}`);
      
      return {
        ipfsHash: result.IpfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
    }
  }

  /**
   * Test IPFS connection
   * @returns {Promise<boolean>} - Connection status
   */
  async testConnection() {
    try {
      const result = await this.pinata.testAuthentication();
      console.log('IPFS connection test successful:', result);
      return true;
    } catch (error) {
      console.error('IPFS connection test failed:', error);
      return false;
    }
  }
}

module.exports = new IPFSService();

