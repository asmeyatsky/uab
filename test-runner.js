/**
 * Simple Test Runner for Universal Agent Builder
 * Run this in browser console to test core functionality
 */

class UABTestRunner {
  constructor() {
    this.results = [];
    this.testCount = 0;
    this.passCount = 0;
  }

  log(message, type = 'info') {
    const colors = {
      info: 'color: blue',
      pass: 'color: green', 
      fail: 'color: red',
      warn: 'color: orange'
    };
    console.log(`%c${message}`, colors[type]);
  }

  assert(condition, testName) {
    this.testCount++;
    if (condition) {
      this.passCount++;
      this.log(`✓ ${testName}`, 'pass');
      this.results.push({ test: testName, result: 'PASS' });
    } else {
      this.log(`✗ ${testName}`, 'fail');
      this.results.push({ test: testName, result: 'FAIL' });
    }
  }

  async runTests() {
    this.log('=== Universal Agent Builder Test Suite ===', 'info');
    
    // Test 1: Core DOM elements exist
    this.log('\n--- Testing DOM Elements ---', 'info');
    this.assert(
      document.getElementById('promptInput') !== null,
      'Prompt input field exists'
    );
    this.assert(
      document.querySelectorAll('.framework-checkbox').length === 3,
      'All three framework checkboxes exist'
    );
    this.assert(
      document.getElementById('generateAgent') !== null,
      'Generate button exists'
    );

    // Test 2: Framework selection functionality
    this.log('\n--- Testing Framework Selection ---', 'info');
    const a2aCheckbox = document.getElementById('a2a');
    const a2aCard = document.querySelector('[data-framework="A2A"]');
    
    // Clear existing state
    appState.selectedFrameworks.clear();
    a2aCheckbox.checked = false;
    
    // Test checkbox selection
    a2aCheckbox.checked = true;
    a2aCheckbox.dispatchEvent(new Event('change'));
    this.assert(
      appState.selectedFrameworks.has('A2A'),
      'Checking A2A updates app state'
    );
    this.assert(
      a2aCard.classList.contains('selected'),
      'A2A card shows selected styling'
    );

    // Test 3: Template functionality
    this.log('\n--- Testing Templates ---', 'info');
    const template = appData.templates[0]; // Customer Service Agent
    const promptInput = document.getElementById('promptInput');
    
    selectTemplate(template);
    this.assert(
      promptInput.value === template.prompt,
      'Template loads prompt correctly'
    );
    this.assert(
      appState.selectedTemplate.id === template.id,
      'Template selection updates state'
    );

    // Test 4: Auto-framework selection
    this.log('\n--- Testing Auto-Framework Selection ---', 'info');
    appState.selectedFrameworks.clear();
    document.querySelectorAll('.framework-checkbox').forEach(cb => cb.checked = false);
    
    promptInput.value = 'agent-to-agent collaboration system';
    promptInput.dispatchEvent(new Event('input'));
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Allow processing
    
    this.assert(
      appState.selectedFrameworks.has('A2A'),
      'Auto-selects A2A for collaboration keywords'
    );

    // Test 5: Configuration generation
    this.log('\n--- Testing Configuration Generation ---', 'info');
    appState.prompt = 'Test agent prompt';
    appState.selectedFrameworks.add('A2A');
    appState.selectedFrameworks.add('MCP');
    
    const config = generateAgentConfig();
    this.assert(
      config.agent && config.agent.name,
      'Generated config has agent section'
    );
    this.assert(
      config.a2a && config.mcp,
      'Generated config includes selected frameworks'
    );
    this.assert(
      !config.adk,
      'Generated config excludes unselected frameworks'
    );

    // Test 6: Error handling
    this.log('\n--- Testing Error Handling ---', 'info');
    appState.prompt = '';
    appState.selectedFrameworks.clear();
    
    // Mock showNotification to capture calls
    let notificationCalled = false;
    const originalNotification = window.showNotification;
    window.showNotification = () => { notificationCalled = true; };
    
    generateAgent();
    this.assert(
      notificationCalled,
      'Shows error for empty prompt and no frameworks'
    );
    
    // Restore original function
    window.showNotification = originalNotification;

    // Test 7: Storage functionality
    this.log('\n--- Testing Storage ---', 'info');
    const testData = { test: 'value', frameworks: new Set(['A2A']) };
    const saveResult = StorageManager.save('test-key', testData);
    const loadResult = StorageManager.load('test-key');
    
    this.assert(saveResult, 'Storage save succeeds');
    this.assert(
      loadResult && loadResult.test === 'value',
      'Storage load returns correct data'
    );
    this.assert(
      loadResult.frameworks instanceof Set,
      'Set objects deserialize correctly'
    );

    // Clean up test data
    localStorage.removeItem('test-key');

    // Test Results Summary
    this.log('\n=== Test Results Summary ===', 'info');
    this.log(`Total Tests: ${this.testCount}`, 'info');
    this.log(`Passed: ${this.passCount}`, 'pass');
    this.log(`Failed: ${this.testCount - this.passCount}`, this.testCount > this.passCount ? 'fail' : 'pass');
    
    if (this.passCount === this.testCount) {
      this.log('🎉 All tests passed!', 'pass');
    } else {
      this.log('❌ Some tests failed. Check results above.', 'fail');
    }

    return {
      total: this.testCount,
      passed: this.passCount,
      failed: this.testCount - this.passCount,
      results: this.results
    };
  }

  // Quick smoke test - just verify app loads
  quickTest() {
    this.log('=== Quick Smoke Test ===', 'info');
    
    const criticalElements = [
      '#promptInput',
      '.framework-checkbox',
      '#generateAgent',
      '.template-card'
    ];

    let allPresent = true;
    criticalElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (!element) {
        this.log(`✗ Missing: ${selector}`, 'fail');
        allPresent = false;
      }
    });

    if (allPresent) {
      this.log('✓ All critical elements present', 'pass');
      this.log('✓ App state object exists: ' + (typeof appState !== 'undefined'), 'pass');
      this.log('✓ Ready for full testing!', 'pass');
    }

    return allPresent;
  }
}

// Usage instructions
console.log(`
Universal Agent Builder Test Runner loaded!

Usage:
  const testRunner = new UABTestRunner();
  
  // Quick smoke test
  testRunner.quickTest();
  
  // Full test suite
  testRunner.runTests().then(results => {
    console.table(results.results);
  });

Note: Run these commands in the browser console while the app is loaded.
`);

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UABTestRunner;
} else {
  window.UABTestRunner = UABTestRunner;
}