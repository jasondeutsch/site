# Figure sources and reproduction

All four figures are original architectural explanations of the article's proposed controller. They contain no benchmark data, measured performance, or third-party artwork.

| Figure | Meaning | Editable source | Export |
| --- | --- | --- | --- |
| Two loops | Agent/tool conversation versus controller attempt lifecycle | [SVG](01-two-loops.svg) | [PNG](01-two-loops.png) |
| Durable memory | Which artifacts survive a fresh conversation | [SVG](02-memory.svg) | [PNG](02-memory.png) |
| Controller state machine | Verification, admission, fresh attempt, completion, and inspection | [SVG](03-state-machine.svg) | [PNG](03-state-machine.png) |
| Trust boundaries | Recommended production separation of candidate editing, checking, and release | [SVG](04-trust-boundaries.svg) | [PNG](04-trust-boundaries.png) |

Regenerate SVGs with:

```bash
python3 build_figures.py
```

Export each SVG with an SVG-capable renderer. Preparation used the bundled Node `sharp` package at 1800 pixels wide, preserving the source aspect ratio. The PNGs were visually inspected. Figure 4 describes a production target; the provided local controller does not enforce those isolation boundaries.
