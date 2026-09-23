# Role-Adjusted Rating (RAR) & Prop Distribution Engine

[![Tests](https://img.shields.io/badge/Tests-Passing-00FF88.svg)](https://github.com/esportsmath-labs/player-impact-rar)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Portal](https://img.shields.io/badge/Portal-esportsmath.org-00E5FF.svg)](https://esportsmath.org/en/tools/player-prop-model/)
[![Affiliation](https://img.shields.io/badge/Institution-Applied%20Probability%20Institute-gold.svg)](https://esportsmath.org/en/about/)

Quantitative performance normalizer and Negative Binomial kill-prop distribution generator for Counter-Strike 2 (CS2) player proposition markets. Eliminates positional role bias by standardizing kills per round (KPR) against positional expectations.

---

## 📐 Mathematical Overview

### 1. Role-Adjusted Rating (RAR)
Positional metrics are normalized via role-specific benchmarks $(\mu_{\text{role}}, \sigma_{\text{role}})$:
$$z = \frac{\text{KPR} - \mu_{\text{role}}}{\sigma_{\text{role}}}$$
$$\text{RAR} = 1.00 + 0.15 \cdot z$$

### 2. Negative Binomial Overdispersion
Esports kill counts exhibit significant variance clustering (overdispersion $\sigma^2 > \mu$), violating standard Poisson assumptions. The Negative Binomial distribution parameterization:
$$p = \frac{r}{r + \mu}, \quad P(K = k) = \frac{\Gamma(k + r)}{k! \, \Gamma(r)} p^r (1 - p)^k$$
where $r = 15.0$ represents empirical match dispersion.

---

## 🚀 Usage

```bash
npm install @esportsmath/player-impact-rar
```

### Run Tests
```bash
node --test test/*.test.js
```

### CLI
```bash
node cli.js
```

---

## 🌐 Live Interactive Tool
Test live player prop projections and calculate fair lines at [esportsmath.org/tools/player-prop-model/](https://esportsmath.org/en/tools/player-prop-model/).

## 📜 Citation
```bibtex
@software{esportsmath_rar2026,
  author = {{EsportsMath Labs}},
  title = {Role-Adjusted Rating and Negative Binomial Player Prop Engine},
  year = {2026},
  publisher = {GitHub},
  url = {https://github.com/esportsmath-labs/player-impact-rar}
}
```
