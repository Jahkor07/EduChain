const winstonService = require('./services/winstonService');

async function testWinstonPlagiarism() {
  console.log('🧪 Testing Winston AI with known plagiarized content...\n');

  // Test 1: Original content (should have low plagiarism score)
  const originalContent = `
    This is a completely original piece of content that I have written myself.
    It discusses the importance of educational technology in modern learning environments.
    The content covers various aspects of digital learning platforms and their impact on student engagement.
    This text is unique and has not been copied from any other source.
    It represents my own thoughts and ideas about educational innovation.
    The purpose of this content is to test the plagiarism detection system.
    I have created this text specifically for testing purposes.
    It should show a low plagiarism score when analyzed by Winston AI.
  `.trim();

  // Test 2: Known plagiarized content (should have high plagiarism score)
  const plagiarizedContent = `
    The quick brown fox jumps over the lazy dog. This is a well-known pangram that has been used for centuries.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    This content contains famous text that is widely known and should be detected as plagiarized.
    The quick brown fox is a classic example used in typing tests and font demonstrations.
    Lorem ipsum is placeholder text commonly used in the printing and typesetting industry.
  `.trim();

  try {
    console.log('📝 Test 1: Original Content');
    console.log('Content length:', originalContent.length, 'characters');
    console.log('Content preview:', originalContent.substring(0, 100) + '...\n');

    const originalResult = await winstonService.checkPlagiarism(originalContent);
    console.log('✅ Original content result:');
    console.log('Score:', originalResult.data?.result?.score || 'Unknown');
    console.log('Source Count:', originalResult.data?.result?.sourceCounts || 'Unknown');
    console.log('Word Count:', originalResult.data?.result?.textWordCounts || 'Unknown');
    console.log('Plagiarism Words:', originalResult.data?.result?.totalPlagiarismWords || 'Unknown');
    console.log('');

    console.log('📝 Test 2: Plagiarized Content');
    console.log('Content length:', plagiarizedContent.length, 'characters');
    console.log('Content preview:', plagiarizedContent.substring(0, 100) + '...\n');

    const plagiarizedResult = await winstonService.checkPlagiarism(plagiarizedContent);
    console.log('✅ Plagiarized content result:');
    console.log('Score:', plagiarizedResult.data?.result?.score || 'Unknown');
    console.log('Source Count:', plagiarizedResult.data?.result?.sourceCounts || 'Unknown');
    console.log('Word Count:', plagiarizedResult.data?.result?.textWordCounts || 'Unknown');
    console.log('Plagiarism Words:', plagiarizedResult.data?.result?.totalPlagiarismWords || 'Unknown');
    console.log('');

    // Analysis
    const originalScore = originalResult.data?.result?.score || 0;
    const plagiarizedScore = plagiarizedResult.data?.result?.score || 0;

    console.log('📊 Analysis:');
    console.log(`Original content score: ${originalScore}% (should be low)`);
    console.log(`Plagiarized content score: ${plagiarizedScore}% (should be high)`);
    
    if (originalScore < 10 && plagiarizedScore > 10) {
      console.log('✅ Winston AI is working correctly!');
    } else if (originalScore >= 10) {
      console.log('⚠️  Original content scored too high - this might be a false positive');
    } else if (plagiarizedScore <= 10) {
      console.log('❌ Plagiarized content scored too low - Winston AI is not detecting plagiarism properly');
    } else {
      console.log('🤔 Mixed results - Winston AI might need adjustment');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWinstonPlagiarism();


