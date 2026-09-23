/**
 * @esportsmath/player-impact-rar
 * Role-Adjusted Rating (RAR) and Overdispersed Negative Binomial Prop Evaluator.
 * Developed by EsportsMath Labs (Applied Probability Institute).
 */

export const ROLE_BENCHMARKS = {
  ENTRY:   { name: 'Entry Fragger', mu: 0.74, sigma: 0.12 },
  AWP:     { name: 'AWPer',          mu: 0.78, sigma: 0.11 },
  RIFLER:  { name: 'Rifler / Anchor', mu: 0.68, sigma: 0.09 },
  SUPPORT: { name: 'Support',        mu: 0.62, sigma: 0.08 },
  IGL:     { name: 'In-Game Leader', mu: 0.59, sigma: 0.10 }
};

/**
 * Computes Role-Adjusted Rating (RAR):
 * z = (kpr - mu_role) / sigma_role
 * RAR = 1.00 + 0.15 * z
 *
 * @param {number} kpr - Player kills per round
 * @param {keyof ROLE_BENCHMARKS} role - Positional role
 */
export function calculateRoleAdjustedRating(kpr, role = 'RIFLER') {
  const bench = ROLE_BENCHMARKS[role] || ROLE_BENCHMARKS.RIFLER;
  const zScore = (kpr - bench.mu) / bench.sigma;
  const rar = 1.00 + 0.15 * zScore;

  return {
    role: bench.name,
    kpr,
    zScore,
    rar: Math.max(0.40, Math.min(2.10, rar))
  };
}

/**
 * Log factorial helper for high-precision probability distributions.
 */
function logFactorial(n) {
  if (n <= 1) return 0;
  let res = 0;
  for (let i = 2; i <= n; i++) res += Math.log(i);
  return res;
}

/**
 * Generates Negative Binomial discrete probability distribution of kills
 * accounting for match overdispersion (variance > mean).
 * Parameterization: mean = mu, dispersion = r
 * p = r / (r + mu)
 * P(X = k) = Gamma(k + r) / (k! * Gamma(r)) * p^r * (1 - p)^k
 *
 * @param {number} projectedMean - Expected kills for the map (e.g. 16.5)
 * @param {number} dispersionR - Dispersion parameter (typical esports: 12..18)
 * @param {number} maxKills - Upper bound evaluation cap (default 45)
 */
export function generateKillDistribution(projectedMean, dispersionR = 15, maxKills = 45) {
  const mu = Math.max(0.1, projectedMean);
  const r = dispersionR;
  const p = r / (r + mu);
  const q = 1 - p;

  const probs = [];
  let sum = 0;

  for (let k = 0; k <= maxKills; k++) {
    // log P(X = k) = logGamma(k + r) - logGamma(r) - log(k!) + r*log(p) + k*log(q)
    // For integer r: Gamma(k + r)/Gamma(r) = (k + r - 1)! / (r - 1)!
    let logComb = 0;
    for (let i = 0; i < k; i++) {
      logComb += Math.log(r + i) - Math.log(i + 1);
    }
    const logProb = logComb + r * Math.log(p) + k * Math.log(q);
    const prob = Math.exp(logProb);
    probs.push({ kills: k, prob });
    sum += prob;
  }

  // Normalize tail truncation
  return probs.map(item => ({
    kills: item.kills,
    prob: item.prob / sum
  }));
}

/**
 * Evaluates an Over/Under kill prop line given the discrete distribution.
 *
 * @param {number} line - Proposition line (e.g. 17.5 or 18.0)
 * @param {Array<{ kills: number, prob: number }>} distribution
 */
export function evaluateKillProp(line, distribution) {
  let probOver = 0;
  let probUnder = 0;
  let probPush = 0;

  for (const { kills, prob } of distribution) {
    if (kills > line) probOver += prob;
    else if (kills < line) probUnder += prob;
    else probPush += prob;
  }

  const fairOddsOver = probOver > 0 ? 1 / probOver : Infinity;
  const fairOddsUnder = probUnder > 0 ? 1 / probUnder : Infinity;

  return {
    line,
    probOver,
    probUnder,
    probPush,
    fairOddsOver,
    fairOddsUnder
  };
}
