import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getRandomQuote,
  POP_CULTURE_QUOTES,
  sortTasks,
  generateMicroSteps,
  PRIORITY_WEIGHTS,
} from './bloomEngine.js';

test('getRandomQuote returns a quote with valid properties from pop culture', () => {
  const quoteData = getRandomQuote();
  assert.ok(quoteData.quote);
  assert.ok(quoteData.source);
  assert.ok(quoteData.category);
  assert.ok(POP_CULTURE_QUOTES.some((q) => q.quote === quoteData.quote));
});

test('sortTasks correctly prioritizes incomplete over completed, then High over Medium over Low', () => {
  const testTasks = [
    { id: '1', title: 'Low priority task', priority: 'low', completed: false, createdAt: 100 },
    { id: '2', title: 'High priority task', priority: 'high', completed: false, createdAt: 200 },
    { id: '3', title: 'Completed high task', priority: 'high', completed: true, createdAt: 300 },
    { id: '4', title: 'Medium priority task', priority: 'medium', completed: false, createdAt: 150 },
  ];

  const sorted = sortTasks(testTasks);

  // Incomplete tasks must come first
  assert.equal(sorted[0].id, '2'); // High incomplete
  assert.equal(sorted[1].id, '4'); // Medium incomplete
  assert.equal(sorted[2].id, '1'); // Low incomplete
  assert.equal(sorted[3].id, '3'); // High completed
});

test('generateMicroSteps produces 3 actionable micro-steps for study or job tasks', () => {
  const studySteps = generateMicroSteps('Study for AP chemistry exam');
  assert.equal(studySteps.length, 3);
  assert.ok(studySteps[0].length > 10);

  const workSteps = generateMicroSteps('Work closing shift at grocery store');
  assert.equal(workSteps.length, 3);
  assert.ok(workSteps[0].length > 10);

  const generalSteps = generateMicroSteps('Finish random chore');
  assert.equal(generalSteps.length, 3);
});

test('priority weights are properly structured', () => {
  assert.equal(PRIORITY_WEIGHTS.high, 3);
  assert.equal(PRIORITY_WEIGHTS.medium, 2);
  assert.equal(PRIORITY_WEIGHTS.low, 1);
});
