---
"budget-time": patch
---

ExpandingSlider: support negative values and smoother expansion

- Added `allowNegative` prop to allow slider to expand into negative territory
- Reduced increment ratio from 50% to 25% for smoother expansion steps
- Only expand when actively dragging and hitting the exact ceiling
- Stricter contraction threshold (70%) to avoid jumpy behavior
- Current Balance sliders in settings now support negative values
