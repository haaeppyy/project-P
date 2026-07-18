# Design System — portfolio-super

## Colour

| Token | Value | Usage |
|---|---|---|
| `--color-wall` | `#f1ede6` | Page background (cream gallery wall) |
| `--color-ink` | `#1a1a1a` | Near-black for frame, headline, navigation text |
| `--color-mat` | `#f5f2ec` | Mat board (warm museum white) |
| `--color-muted` | `#8a8a8a` | Inactive nav labels, secondary text |
| `--color-divider` | `#555555` | Horizontal rule, subdued accents |
| `--color-nav-bg` | `#fefdfb` | Navigation pill fill (warm near-white) |
| `--color-nav-border` | `rgba(26,26,26,0.15)` | Navigation pill hairline |

## Typography

| Role | Family | Weight | Size | Notes |
|---|---|---|---|---|
| Display name | Playfair Display | 400 (Regular) | ~64px cap | High-contrast serif, thin/thick stroke |
| Navigation | Inter | 500 (Medium) | 17px | Clean humanist sans |
| Body/tagline | Inter | 400 (Regular) | 16–20px | Neutral sans, muted gray |
| Scroll label | Inter | 500 | 10px / 0.28em | Uppercase small-caps |

## Spacing

Base unit: 4px (rem). Scale: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64.

## Component Architecture

```
src/
├── app/                          # Next.js app router pages
├── features/
│   └── hero/
│       ├── Hero.tsx              # Page-level composition
│       ├── HeroLayout.tsx        # Two-column grid, scroll cue
│       ├── HeroTypography.tsx    # Headline, divider, tagline
│       ├── GalleryFrame/
│       │   ├── GalleryFrame.tsx  # Frame shell (layer stack)
│       │   ├── Bezel.tsx         # Outer black wooden frame
│       │   ├── MatBoard.tsx      # Museum cotton mat
│       │   ├── Photograph.tsx    # heroImage.png mount
│       │   ├── HangingSystem.tsx # Pins, wires, crown
│       │   ├── FrameMaterials.ts # Material constants
│       │   └── index.ts
│       ├── Navigation/
│       │   ├── NavPill.tsx
│       │   └── ThemeToggle.tsx
│       └── ScrollIndicator/
│           └── ScrollCue.tsx
├── lib/
│   └── cn.ts                    # classname utility
└── styles/
    └── tokens.css               # Design token custom properties
```

## Phases Completed

- Phase 1 — Layout & Typography
- Phase 2 — Gallery Frame
- Phase 3 — Hanging System
