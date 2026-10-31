# Figure sources and methodology

Prepared October 5, 2026. All embedded figures use deterministic drawing, with PNG embeds and editable SVG equivalents. The original artistic illustrations are no longer embedded.

## factory-boundary

[PNG](factory-boundary.png) · [SVG](factory-boundary.svg)

Proposed architecture: the harness is one part of the software production system. Informed by [SWE-agent](https://arxiv.org/abs/2405.15793) and [Gu et al.](https://arxiv.org/pdf/2503.22625); the boundary is the author's synthesis.

## failure-routing

[PNG](failure-routing.png) · [SVG](failure-routing.svg)

Proposed failure routing, informed by [Agentless](https://arxiv.org/abs/2407.01489) and [Bainbridge](https://doi.org/10.1016/0005-1098%2883%2990046-8). Retry policy and ownership must be defined by the team.

## Reproduction and evidence status

The shared drawing source is [build_figures.py](build_figures.py). It uses Pillow and system Arial fonts. Run it from writing/eng. It generates both raster and vector figures for the supporting figures. The [header reproduction script](build_headers.py) generates the article topic maps using the same drawing primitives.

Workflow diagrams are author-designed proposals informed by the linked research and guidance. They are not copied diagrams or established standards. Citations substantiate the underlying concerns, not a demonstrated ROI for the complete proposed workflow. Numeric graphs use source-reported quantities with their units and limitations.

## Article topic map

`article-overview.png` and `article-overview.svg` summarize the topics and practical decisions in Draft.md. This is author synthesis, not an empirical finding or a validated operating model. The article’s [research bibliography](writing/eng/posts/coding%20agents%20to%20factories/References.md) documents the evidence and its limits; no quantitative claims are introduced in the map.
