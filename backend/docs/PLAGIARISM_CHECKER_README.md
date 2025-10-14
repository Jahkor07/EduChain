# Winston AI Plagiarism Checker - File Upload Integration

## Overview
The EduChain plagiarism checker now supports **file uploads** with automatic text extraction from PDF, DOCX, and TXT files. This allows educators to upload educational documents directly for plagiarism checking before minting certificates.

---

## Features

### ✅ Supported File Types
- **PDF** (.pdf) - Extracted using `pdf-parse`
- **DOCX** (.docx, .doc) - Extracted using `mammoth`
- **TXT** (.txt) - Direct UTF-8 text reading

### ✅ File Upload Capabilities
- **Max File Size**: 10MB
- **Automatic Text Extraction**: Extracts readable text from documents
- **Temporary File Cleanup**: Automatically deletes files after processing
- **Error Handling**: Graceful error handling with cleanup on failures

### ✅ Validation
- **Minimum Content**: 100 characters required for analysis
- **Maximum Content**: 50,000 characters limit
- **File Type Validation**: Only accepts supported file types
- **Empty Content Detection**: Rejects files with no extractable text

### ✅ Dual Input Support
- **File Upload**: Upload PDF, DOCX, or TXT files
- **Direct Text**: Send text content directly via JSON

---

## API Endpoint

### POST `/api/plagiarism/check`

#### Request Options

**Option 1: File Upload**
```bash
curl -X POST http://localhost:5000/api/plagiarism/check \
  -F "file=@certificate.pdf"
```

**Option 2: Direct Text**
```bash
curl -X POST http://localhost:5000/api/plagiarism/check \
  -H "Content-Type: application/json" \
  -d '{"text": "Your content here..."}'
```

#### Response Format
```json
{
  "success": true,
  "message": "Plagiarism check completed successfully",
  "data": {
    "score": 5.2,
    "plagiarism_score": 5.2,
    "matches": []
  },
  "metadata": {
    "textLength": 1250,
    "timestamp": "2025-10-10T13:45:00.000Z",
    "service": "Winston AI",
    "fileProcessed": true,
    "fileName": "certificate.pdf"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Content too short",
  "message": "Text content must be at least 100 characters for plagiarism analysis",
  "timestamp": "2025-10-10T13:45:00.000Z"
}
```

---

## Backend Implementation

### File Structure
```
backend/
├── routes/
│   └── plagiarismRoutes.js    # File upload & plagiarism routes
├── services/
│   └── winstonService.js      # Winston AI integration
├── uploads/                    # Temporary file storage (auto-cleanup)
└── test-file-upload.js        # Test script
```

### Key Dependencies
```json
{
  "multer": "^2.0.2",           // File upload handling
  "pdf-parse": "^1.1.1",        // PDF text extraction
  "mammoth": "^1.6.0"           // DOCX text extraction
}
```

### Installation
```bash
cd backend
npm install pdf-parse mammoth
```

---

## Frontend Integration

### MintCertificate.js Implementation

```javascript
const handlePlagiarismCheck = async () => {
  if (!file) {
    showToast('Please upload a certificate file first.', 'error');
    return;
  }

  try {
    // Create FormData to send file to backend
    const formData = new FormData();
    formData.append('file', file);

    // Call backend API
    const response = await fetch('http://localhost:5000/api/plagiarism/check', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    // Extract score from response
    const score = result.data?.score || 0;
    const passed = score <= 15; // 15% threshold

    setPlagiarismScore(score);
    setPlagiarismPassed(passed);

    if (passed) {
      showToast(`✅ Plagiarism check passed! Content is original (${score.toFixed(1)}%).`, 'success');
      setCurrentStep(3); // Move to next step
    } else {
      showToast(`❌ High plagiarism detected (${score.toFixed(1)}%). Please revise content.`, 'error');
    }
  } catch (error) {
    showToast('Plagiarism check failed. Please try again.', 'error');
  }
};
```

---

## Testing

### Run Test Script
```bash
cd backend
node test-file-upload.js
```

### Test Scenarios
1. **File Upload Test**: Creates a test TXT file, uploads it, and verifies plagiarism check
2. **Direct Text Test**: Sends text directly without file upload
3. **Cleanup Verification**: Ensures temporary files are deleted

### Expected Output
```
🧪 Testing File Upload Plagiarism Check...

📝 Test 1: Creating test TXT file...
✅ Test file created

📤 Test 2: Uploading file for plagiarism check...
✅ Response received
Success: true
Message: Plagiarism check completed successfully

📊 Plagiarism Results:
Score: 5.2

📋 Metadata:
Text Length: 350
File Processed: true
File Name: test-document.txt
Service: Winston AI

🗑️ Test file cleaned up
🎯 File Upload Test Completed Successfully!
```

---

## Workflow

### 1. User Uploads File
```
User selects PDF/DOCX/TXT file → Frontend sends to backend
```

### 2. Backend Processing
```
Receive file → Extract text → Validate content → Send to Winston AI
```

### 3. Plagiarism Check
```
Winston AI analyzes → Returns score → Backend processes result
```

### 4. Response & Cleanup
```
Send result to frontend → Delete temporary file → Display to user
```

---

## Error Handling

### File Upload Errors
- **Invalid file type**: Returns 400 error
- **File too large**: Multer rejects with 413 error
- **Empty content**: Returns 400 error with message
- **Extraction failure**: Returns 500 error with details

### Automatic Cleanup
- Files are deleted immediately after successful processing
- Files are deleted on error using try-catch cleanup
- Prevents disk space issues from temporary files

---

## Security Considerations

### File Validation
- ✅ File type whitelist (PDF, DOCX, TXT only)
- ✅ File size limit (10MB max)
- ✅ Content length validation
- ✅ Automatic cleanup of uploaded files

### Best Practices
- Files stored in `uploads/` directory (gitignored)
- Temporary files deleted immediately after processing
- No permanent file storage
- Sanitized error messages

---

## Troubleshooting

### Common Issues

**Issue**: "Unsupported file type"
- **Solution**: Ensure file is PDF, DOCX, or TXT format

**Issue**: "Content too short"
- **Solution**: Document must have at least 100 characters of text

**Issue**: "No text content could be extracted"
- **Solution**: File may be corrupted or image-based PDF (no text layer)

**Issue**: "File upload failed"
- **Solution**: Check file size (must be under 10MB)

### Debug Mode
Enable detailed logging:
```javascript
console.log('📄 Processing file:', req.file.originalname);
console.log('📖 Extracting text from PDF...');
console.log(`✅ Extracted ${textContent.length} characters`);
```

---

## Future Enhancements

### Potential Improvements
- [ ] Support for image-based PDFs with OCR
- [ ] Support for more file formats (RTF, ODT)
- [ ] Batch file processing
- [ ] File preview before plagiarism check
- [ ] Progress tracking for large files
- [ ] Caching of plagiarism results

---

## API Reference

### Additional Endpoints

#### GET `/api/plagiarism/status`
Get Winston AI service status
```json
{
  "success": true,
  "message": "Plagiarism service status retrieved",
  "data": {
    "configured": true,
    "apiKeyPresent": true
  }
}
```

#### GET `/api/plagiarism/health`
Health check endpoint
```json
{
  "success": true,
  "message": "Plagiarism service is healthy",
  "service": "Winston AI Plagiarism Detection",
  "uptime": 12345
}
```

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend console logs
3. Run the test script to verify setup
4. Ensure Winston AI API key is configured in `.env`

---

## License
Part of the EduChain project - Educational NFT Certificate Platform

