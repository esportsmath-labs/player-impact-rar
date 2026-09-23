#!/usr/bin/env node
import { calculateRoleAdjustedRating, generateKillDistribution, evaluateKillProp } from './src/index.js';

console.log("=== Esports Player RAR & Prop Distribution Engine (EsportsMath Labs) ===");

// 1. RAR Calculation
const zywoo = calculateRoleAdjustedRating(0.86, 'AWP');
console.log(`\nPlayer Assessment (ZywOo - AWP):`);
console.log(`KPR: ${zywoo.kpr} | Role: ${zywoo.role}`);
console.log(`Role z-score: +${zywoo.zScore.toFixed(2)} SD`);
console.log(`Role-Adjusted Rating (RAR): ${zywoo.rar.toFixed(2)} (Elite Tier)`);

// 2. Map Prop Projection
const expectedRounds = 22.0;
const projectedKills = expectedRounds * zywoo.kpr; // ~18.92 kills
const dist = generateKillDistribution(projectedKills, 15);

const line = 17.5;
const prop = evaluateKillProp(line, dist);
console.log(`\nProp Line Evaluation: Over/Under ${line} Kills`);
console.log(`P(Over ${line}):  ${(prop.probOver * 100).toFixed(1)}% (Fair Decimal Odds: ${prop.fairOddsOver.toFixed(2)})`);
console.log(`P(Under ${line}): ${(prop.probUnder * 100).toFixed(1)}% (Fair Decimal Odds: ${prop.fairOddsUnder.toFixed(2)})`);
