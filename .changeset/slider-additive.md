---
"@repo/budget-time": patch
---

ExpandingSlider now uses additive scaling instead of multiplicative

- Adds/subtracts 50% of initial max each step (e.g., 120 → 180 → 240 → 300)
- No more exponential jumps into thousands
- Much more predictable and controllable range adjustments
