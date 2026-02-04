---
"@repo/budget-time": patch
---

ExpandingSlider only expands when hitting the ceiling (99%+)

- No more cascade of expansions while dragging
- Must actually reach the max before it expands
- Thumb naturally repositions to ~67% after expansion, giving room to continue
