import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ROLE_BENCHMARKS,
  calculateRoleAdjustedRating,
  generateKillDistribution,
  evaluateKillProp
} from '../src/index.js';

test('Benchmark Roles Contain Correct Mean and Variance', () => {
  assert.ok(ROLE_BENCHMARKS.AWP.mu > ROLE_BENCHMARKS.IGL.mu);
  assert.equal(ROLE_BENCHMARKS.RIFLER.mu, 0.68);
});

test('Average Player Receives Exactly 1.00 RAR', () => {
  const res = calculateRoleAdjustedRating(0.68, 'RIFLER');
  assert.ok(Math.abs(res.zScore) < 1e-6);
  assert.ok(Math.abs(res.rar - 1.00) < 1e-6);
});

test('High KPR Yields Positive z-Score and > 1.00 RAR', () => {
  const res = calculateRoleAdjustedRating(0.90, 'ENTRY');
  assert.ok(res.zScore > 1.0);
  assert.ok(res.rar > 1.15);
});

test('Negative Binomial Distribution Integrates to 1.0000', () => {
  const dist = generateKillDistribution(17.5, 15, 50);
  const totalProb = dist.reduce((acc, curr) => acc + curr.prob, 0);
  assert.ok(Math.abs(totalProb - 1.0) < 1e-5);
});

test('Over/Under/Push Partition Axiom Holds', () => {
  const dist = generateKillDistribution(16.0, 15);

  // Fractional line: Push must be 0
  const fracProp = evaluateKillProp(16.5, dist);
  assert.equal(fracProp.probPush, 0);
  assert.ok(Math.abs(fracProp.probOver + fracProp.probUnder - 1.0) < 1e-5);

  // Integer line: Over + Under + Push must equal 1.0
  const intProp = evaluateKillProp(16.0, dist);
  assert.ok(intProp.probPush > 0);
  assert.ok(Math.abs(intProp.probOver + intProp.probUnder + intProp.probPush - 1.0) < 1e-5);
});
