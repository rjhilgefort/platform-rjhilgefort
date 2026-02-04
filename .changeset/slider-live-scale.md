---
"@repo/budget-time": patch
---

Improve ExpandingSlider UX - live scaling while dragging

- Scale adjusts in real-time as you drag (not just on release)
- Smaller increments: 1.5x instead of 2x
- Contracts when below 30% of current max
- Expands when above 85% of current max
- Much smoother experience getting back to lower values
