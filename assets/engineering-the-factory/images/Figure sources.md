# Figure sources and methodology

Prepared October 5, 2026. All embedded figures use deterministic drawing, with PNG embeds and editable SVG equivalents. The original artistic illustrations are no longer embedded.

## verification-scope

[PNG](verification-scope.png) · [SVG](verification-scope.svg)

Verification map: checks establish scoped claims, not complete correctness. Author synthesis informed by [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final) and [Gu et al.](https://arxiv.org/pdf/2503.22625).

## controlled-rollout

[PNG](controlled-rollout.png) · [SVG](controlled-rollout.svg)

Proposed rollout workflow based on [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final) and [Google SRE](https://sre.google/workbook/canarying-releases/). Recovery depends on the change; rollback is not always sufficient.

## Reproduction and evidence status

The shared drawing source is [build_figures.py](build_figures.py). It uses Pillow and system Arial fonts. Run it from writing/eng. It generates both raster and vector figures for the supporting figures. The [header reproduction script](build_headers.py) generates the article topic maps using the same drawing primitives.

Workflow diagrams are author-designed proposals informed by the linked research and guidance. They are not copied diagrams or established standards. Citations substantiate the underlying concerns, not a demonstrated ROI for the complete proposed workflow. Numeric graphs use source-reported quantities with their units and limitations.

## Article topic map

`article-overview.png` and `article-overview.svg` summarize the topics and practical decisions in Draft.md. This is author synthesis, not an empirical finding or a validated operating model. The article’s [research bibliography](writing/eng/posts/engineering%20the%20factory/References.md) documents the evidence and its limits; no quantitative claims are introduced in the map.
