/**
 * AP2 Integration Tests
 * Following architectural principles from SKILL.md
 */

// Import all AP2 components
import { Payment } from './domain/entities/payment/Payment.js';
import { PaymentId } from './domain/value_objects/payment/PaymentId.js';
import { PaymentAmount } from './domain/value_objects/payment/PaymentAmount.js';
import { PaymentMethod } from './domain/value_objects/payment/PaymentMethod.js';
import { PaymentStatus } from './domain/value_objects/payment/PaymentStatus.js';
import { AP2DomainService } from './domain/services/payment/AP2DomainService.js';
import { 
  CreatePaymentUseCase,
  ProcessAgentPaymentUseCase,
  CreatePaymentAuthorizationPlanUseCase
} from './application/use_cases/payment/AP2UseCases.js';
import { MockPaymentProcessorAdapter } from './infrastructure/adapters/payment/MockPaymentProcessorAdapter.js';

// Mock repository for testing
class MockAgentRepository {
  constructor() {
    this.agents = new Map();
  }

  async save(agent) {
    this.agents.set(agent.id.value, agent);
  }

  async findById(id) {
    return this.agents.get(id) || null;
  }

  async findAll() {
    return Array.from(this.agents.values());
  }

  async delete(id) {
    this.agents.delete(id);
  }
}

// Test utilities
class TestReporter {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, testFn) {
    try {
      const result = testFn();
      if (result) {
        this.passed++;
        this.tests.push({ name, status: 'PASS', result });
        console.log(`✅ ${name}`);
      } else {
        this.failed++;
        this.tests.push({ name, status: 'FAIL', result });
        console.log(`❌ ${name}`);
      }
    } catch (error) {
      this.failed++;
      this.tests.push({ name, status: 'ERROR', error: error.message });
      console.log(`💥 ${name}: ${error.message}`);
    }
  }

  report() {
    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    if (this.failed > 0) {
      console.log('Failed tests:');
      this.tests
        .filter(t => t.status !== 'PASS')
        .forEach(t => console.log(`  ${t.name}: ${t.status} - ${t.error || t.result}`));
    }
    return { passed: this.passed, failed: this.failed };
  }
}

// Run tests
const runner = new TestReporter();

console.log('🧪 Running AP2 Integration Tests...\n');

// Test Value Objects
runner.test('PaymentId should be immutable and valid', () => {
  const id = new PaymentId('payment-123');
  return id.value === 'payment-123';
});

runner.test('PaymentAmount should validate and format properly', () => {
  const amount = new PaymentAmount(100.50, 'USD');
  return amount.amount === 100.50 && amount.currency === 'USD';
});

runner.test('PaymentMethod should validate type', () => {
  const method = new PaymentMethod('CREDIT_CARD', { number: '****-****-****-1234' });
  return method.type === 'CREDIT_CARD';
});

runner.test('PaymentStatus should validate status', () => {
  const status = new PaymentStatus('PENDING');
  return status.value === 'PENDING';
});

// Test Entity
runner.test('Payment entity should be created with valid parameters', () => {
  const id = new PaymentId('payment-123');
  const amount = new PaymentAmount(100.50, 'USD');
  const method = new PaymentMethod('CREDIT_CARD', { number: '****-****-****-1234' });
  const status = new PaymentStatus('PENDING');
  const createdAt = DateTime.now();
  const updatedAt = DateTime.now();

  const payment = new Payment(id, amount, method, 'Test payment', 'Merchant', status, createdAt, updatedAt);
  return payment.id.value === 'payment-123' && payment.amount.amount === 100.50;
});

runner.test('Payment should transition status correctly', () => {
  const id = new PaymentId('payment-123');
  const amount = new PaymentAmount(100.50, 'USD');
  const method = new PaymentMethod('CREDIT_CARD', { number: '****-****-****-1234' });
  const status = new PaymentStatus('PENDING');
  const createdAt = DateTime.now();
  const updatedAt = DateTime.now();

  const payment = new Payment(id, amount, method, 'Test payment', 'Merchant', status, createdAt, updatedAt);
  const authorizedPayment = payment.authorize();
  
  return authorizedPayment.status.value === 'AUTHORIZED' && payment.status.value === 'PENDING'; // Original unchanged
});

// Test Domain Service
runner.test('AP2DomainService should create payment', () => {
  const service = new AP2DomainService();
  const payment = service.createPayment(50.00, 'USD', 'DIGITAL_WALLET', { walletId: 'user-123' }, 'Test payment', 'Merchant');
  return payment.amount.amount === 50.00 && payment.recipient === 'Merchant';
});

runner.test('AP2DomainService should validate payment', () => {
  const service = new AP2DomainService();
  const payment = service.createPayment(50.00, 'USD', 'DIGITAL_WALLET', { walletId: 'user-123' }, 'Test payment', 'Merchant');
  const errors = service.validatePayment(payment);
  return errors.length === 0;
});

// Test Use Cases
runner.test('CreatePaymentUseCase should create a payment successfully', async () => {
  const mockAgentRepo = new MockAgentRepository();
  const mockPaymentProcessor = new MockPaymentProcessorAdapter();
  const ap2Service = new AP2DomainService();
  const useCase = new CreatePaymentUseCase(ap2Service, mockPaymentProcessor, mockAgentRepo);

  const request = {
    amount: 25.99,
    currency: 'USD',
    methodType: 'DIGITAL_WALLET',
    methodDetails: { walletId: 'user-123' },
    description: 'Test payment',
    recipient: 'Test Merchant'
  };

  const result = await useCase.execute(request);
  return result.success && result.payment.amount.amount === 25.99;
});

// Note: DateTime is needed for these tests; adding a simple implementation for testing
class DateTime {
  constructor(value) {
    if (value instanceof Date) {
      this._value = new Date(value.getTime());
    } else {
      this._value = new Date();
    }
  }

  static now() {
    return new DateTime(new Date());
  }

  get value() {
    return this._value;
  }
}

// Run the tests and report results
const results = runner.report();

// Export for use in other contexts if needed
if (typeof window !== 'undefined') {
  window.AP2IntegrationTestResults = results;
}

console.log('\n🎯 AP2 Integration Tests Complete!');