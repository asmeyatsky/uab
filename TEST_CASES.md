# Universal Agent Builder - Test Cases

This document outlines comprehensive test cases for the Universal Agent Builder application.

## Manual Testing Scenarios

### 1. Core User Workflow Tests

#### Test Case 1.1: Complete Agent Creation Flow
**Objective**: Verify end-to-end agent creation process
**Steps**:
1. Navigate to http://localhost:3000
2. Enter prompt: "Create a customer service agent that handles order inquiries"
3. Select A2A and MCP frameworks
4. Configure framework settings (change default values)
5. Click "Generate Agent" button
6. Verify configuration appears in preview tab
7. Switch to "Test Agent" tab
8. Send test message: "I need help with my order"
9. Verify agent responds appropriately

**Expected Results**:
- Each step completes without errors
- Configuration shows selected frameworks
- Test interface provides contextual responses
- Generated JSON includes all configured settings

#### Test Case 1.2: Template-Based Agent Creation
**Objective**: Test pre-built template functionality
**Steps**:
1. Click on "Customer Service Agent" template
2. Verify prompt auto-fills
3. Verify A2A and MCP frameworks are auto-selected
4. Modify the auto-filled prompt
5. Verify template selection clears when prompt changes
6. Generate agent and test functionality

**Expected Results**:
- Template loads correct prompt and frameworks
- Manual prompt changes deselect template
- Configuration reflects template settings

---

### 2. Framework Selection Tests

#### Test Case 2.1: Manual Framework Selection
**Objective**: Verify framework selection UI and logic
**Steps**:
1. Check A2A framework box
2. Verify card highlights visually
3. Check configuration panel shows A2A settings
4. Uncheck A2A framework
5. Verify card styling reverts
6. Verify configuration panel hides A2A settings
7. Repeat for ADK and MCP

**Expected Results**:
- Visual feedback immediate and correct
- Configuration sections appear/disappear appropriately
- State persists between selections

#### Test Case 2.2: Auto Framework Selection
**Objective**: Test prompt-based framework suggestions
**Test Data**:
- "agent-to-agent collaboration" → should select A2A
- "workflow orchestration system" → should select ADK  
- "external tools and data sources" → should select MCP
- "multi-agent coordinator with external APIs" → should select all three

**Steps**:
1. Clear all selections
2. Enter each test prompt
3. Verify appropriate frameworks auto-select
4. Verify checkboxes update correctly

**Expected Results**:
- Framework selection matches prompt content
- UI state consistent with auto-selections

#### Test Case 2.3: Framework Card Interaction
**Objective**: Test clicking framework cards toggles selection
**Steps**:
1. Click on A2A framework card (not checkbox)
2. Verify checkbox gets checked
3. Verify card styling updates
4. Click card again
5. Verify checkbox unchecks
6. Click directly on checkbox
7. Verify no double-toggle occurs

**Expected Results**:
- Card clicks toggle checkbox state
- Direct checkbox clicks work normally
- No conflicting event handling

---

### 3. Template System Tests

#### Test Case 3.1: All Templates Load Correctly
**Objective**: Verify all template data displays properly
**Steps**:
1. Verify 4 templates appear in sidebar:
   - Customer Service Agent
   - Data Analysis Agent  
   - Content Creation Agent
   - Multi-Agent Coordinator
2. Click each template
3. Verify unique prompts load
4. Verify correct framework combinations select

**Expected Results**:
- All templates visible and clickable
- Each has distinct prompt and framework selection
- Templates highlight when active

#### Test Case 3.2: Template Framework Recommendations
**Objective**: Test template framework suggestions are logical
**Verification**:
- Customer Service: A2A + MCP (communication + external data)
- Data Analysis: ADK + MCP (workflows + data processing) 
- Content Creation: A2A + ADK (collaboration + workflows)
- Multi-Agent: A2A + ADK + MCP (comprehensive system)

---

### 4. Configuration Generation Tests

#### Test Case 4.1: Framework-Specific Configuration
**Objective**: Verify each framework generates correct config sections
**Steps**:
1. Select only A2A framework
2. Fill in A2A configuration fields
3. Generate agent
4. Verify JSON contains only A2A config section
5. Repeat for ADK and MCP individually
6. Test with all frameworks selected

**Expected Results**:
- Only selected frameworks appear in generated config
- All form values preserved in JSON output
- Configuration structure matches framework requirements

#### Test Case 4.2: Configuration Form Validation
**Objective**: Test configuration input handling
**Steps**:
1. Select A2A framework
2. Enter invalid port number (e.g., "abc")
3. Leave required fields empty
4. Generate configuration
5. Test with extreme values (very long strings, special characters)

**Expected Results**:
- Invalid inputs handled gracefully
- Default values used when appropriate
- No JavaScript errors occur

---

### 5. Error Handling and Edge Cases

#### Test Case 5.1: Empty Input Validation
**Objective**: Test application handles missing required data
**Steps**:
1. Click "Generate Agent" with empty prompt
2. Verify error message appears
3. Enter prompt but select no frameworks
4. Click "Generate Agent"
5. Verify framework selection error message
6. Test export with no generated agent

**Expected Results**:
- Clear error messages for each missing requirement
- No application crashes or undefined behavior
- User guided to complete required fields

#### Test Case 5.2: Browser Compatibility Edge Cases
**Objective**: Test localStorage and modern JavaScript features
**Steps**:
1. Disable localStorage (dev tools)
2. Refresh page
3. Verify app still functions
4. Test with JavaScript disabled (should show graceful degradation)
5. Test with very long prompts (>10,000 characters)

**Expected Results**:
- App gracefully handles storage failures
- Large inputs don't break UI layout
- Basic functionality preserved without JavaScript

---

### 6. State Persistence Tests

#### Test Case 6.1: Page Refresh Persistence
**Objective**: Verify state saves and loads correctly
**Steps**:
1. Enter custom prompt
2. Select specific frameworks
3. Fill in configuration values
4. Refresh browser page
5. Verify all data restored
6. Clear browser storage
7. Refresh again
8. Verify clean initial state

**Expected Results**:
- All user input preserved across refresh
- Configuration state maintained
- Clean slate when storage cleared

#### Test Case 6.2: Multi-Tab Behavior
**Objective**: Test localStorage sharing between tabs
**Steps**:
1. Open application in two browser tabs
2. Make changes in tab 1
3. Refresh tab 2
4. Verify changes appear
5. Make different changes in tab 2
6. Switch back to tab 1

**Expected Results**:
- Most recent changes persist across tabs
- No data corruption between instances

---

### 7. Deployment Configuration Tests

#### Test Case 7.1: Deployment Modal Functionality
**Objective**: Test deployment configuration modals
**Steps**:
1. Click each deployment option:
   - Local Development
   - Cloud Deployment
   - Container Deployment
   - Edge Deployment
2. Verify unique forms load
3. Fill in configuration values
4. Click "Apply Configuration"
5. Verify success notification
6. Test "Cancel" functionality

**Expected Results**:
- Each deployment type shows appropriate form
- Configuration saves to app state
- Modal closes after successful save

#### Test Case 7.2: Deployment Form Validation
**Objective**: Test deployment form input handling
**Steps**:
1. Open Cloud Deployment modal
2. Leave required fields empty
3. Enter invalid region format
4. Test with special characters in instance names
5. Verify form behavior with very long inputs

**Expected Results**:
- Form accepts reasonable inputs
- Handles edge cases gracefully
- No broken UI with unusual inputs

---

### 8. Testing Interface Tests

#### Test Case 8.1: Agent Testing Simulation
**Objective**: Verify mock testing interface works
**Steps**:
1. Create agent with Customer Service template
2. Switch to "Test Agent" tab
3. Send various test messages:
   - "Help with order"
   - "Process return"
   - "Technical issue"
   - Random message
4. Verify contextual responses
5. Test file upload functionality

**Expected Results**:
- Responses match template context
- File uploads process without errors
- Conversation history maintained

#### Test Case 8.2: Test Interface Without Generated Agent
**Objective**: Test behavior before agent generation
**Steps**:
1. Fresh page load
2. Switch to "Test Agent" tab immediately
3. Try sending test message
4. Verify appropriate error/guidance message

**Expected Results**:
- Clear message to configure agent first
- No JavaScript errors or crashes

---

## Performance Tests

#### Test Case P.1: Large Configuration Handling
**Objective**: Test app performance with complex configurations
**Steps**:
1. Select all frameworks
2. Fill in maximum length values in all fields
3. Generate very large configuration
4. Test export functionality
5. Monitor browser memory usage

**Expected Results**:
- No significant performance degradation
- Export completes successfully
- Memory usage remains reasonable

#### Test Case P.2: Rapid User Interactions
**Objective**: Test UI responsiveness under fast interactions
**Steps**:
1. Rapidly toggle framework selections
2. Quickly switch between templates
3. Fast typing in prompt field
4. Rapid tab switching

**Expected Results**:
- UI remains responsive
- State updates correctly despite rapid changes
- No visual glitches or stuck states

---

## Browser Compatibility Tests

#### Test Case B.1: Cross-Browser Functionality
**Test Browsers**: Chrome, Firefox, Safari, Edge
**Steps**:
1. Test complete workflow in each browser
2. Verify localStorage works
3. Test CSS styling consistency
4. Verify JavaScript functionality

#### Test Case B.2: Mobile Responsiveness
**Devices**: iPhone, Android, Tablet
**Steps**:
1. Test touch interactions
2. Verify responsive layout
3. Test modal functionality on mobile
4. Verify text input on virtual keyboards

---

## Automated Test Structure Recommendations

### Unit Test Examples (Jest/Vitest)

```javascript
// Framework selection logic
describe('Framework Selection', () => {
  test('auto-selects A2A for collaboration keywords', () => {
    const prompt = 'agent-to-agent collaboration system';
    const selected = autoSelectFrameworks(prompt);
    expect(selected).toContain('A2A');
  });

  test('updates UI state when framework toggled', () => {
    toggleFramework('A2A', true);
    expect(appState.selectedFrameworks.has('A2A')).toBe(true);
  });
});

// Configuration generation
describe('Configuration Generation', () => {
  test('generates valid JSON for selected frameworks', () => {
    appState.selectedFrameworks.add('A2A');
    const config = generateAgentConfig();
    expect(config).toHaveProperty('a2a');
    expect(config.a2a).toHaveProperty('name');
  });
});
```

### Integration Test Examples (Cypress/Playwright)

```javascript
// End-to-end user workflow
describe('Agent Creation Flow', () => {
  it('creates agent from template to testing', () => {
    cy.visit('/');
    cy.get('[data-template-id="customer-service"]').click();
    cy.get('#a2a').should('be.checked');
    cy.get('#generateAgent').click();
    cy.get('[data-tab="test"]').click();
    cy.get('#testInput').type('Help with order');
    cy.get('#sendTest').click();
    cy.get('.test-message.agent').should('contain', 'order');
  });
});
```

This comprehensive test suite covers all major functionality and edge cases of the Universal Agent Builder application.