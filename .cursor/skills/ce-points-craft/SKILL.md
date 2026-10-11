---
name: ce-points-craft
description: >-
  Applies CE Points craft bar for UI, UX, and motion polish. Use when improving
  animations, visual detail, calculator/ranking feel, theme parity, App Store
  readiness of interaction design, or when the user mentions Benji-level polish,
  craft, micro-interactions, or making the app clearly best-in-class.
---

# CE Points craft

## Mindset

This app wins by being the tool athletes open without thinking. Polish is **attention in the places people touch every meet** — inputs, totals, charts, saved scores, rankings — not novelty screens.

Stay on Expo. Reach for Reanimated, Gesture Handler, and existing theme/components before new libraries or a native rewrite.

## Before changing UI

1. Name the **one** interaction or visual inconsistency you’re fixing.
2. Check light **and** dark (structure and contrast must match).
3. Prefer tokens in `constants/ThemeColors.ts` and shared components under `components/calculators/`.
4. Don’t add features; deepen the ones that already define the product.

## Craft checklist

Copy and tick while working:

```
- [ ] Scoring / data path still correct after the change
- [ ] Light + dark parity (insets, borders, placeholders, overlays)
- [ ] Touch targets and keyboard clearance feel intentional
- [ ] Motion is springy, interruptible where possible, and purposeful
- [ ] No new visual noise (cards, chips, gradients for decoration)
- [ ] Matches nearby screens (spacing, type weight, button language)
```

## High-value polish targets (this app)

| Area | Bar |
|------|-----|
| Event inputs | WR placeholders faded; typed values clear; points column readable |
| Chart modal | Nested panels visible in both themes; calm open/close |
| Saved scores | Reorder/scroll feel physical; no flash on release |
| Rankings | Same density and clarity as calculators |
| More / tips | Honest storefront prices; no clutter |

## Motion guidance

- **Do:** shared layout feel, press scale/opacity, list reorder, modal present/dismiss with consistent easing.
- **Don’t:** looping ornaments, staggered noise on every row, parallax without purpose.
- Prefer one strong motion per flow over many weak ones.

## When reviewing your own diff

If removing a border, shadow, card, or animation doesn’t hurt understanding or feedback, remove it. If light mode “goes flat” where dark has structure, fix tokens — don’t special-case one theme with one-off colors.
