# Figure sources and methodology

Prepared October 5, 2026. All embedded figures use deterministic drawing, with PNG embeds and editable SVG equivalents. The original artistic illustrations are no longer embedded.

## evidence-lifecycle

[PNG](evidence-lifecycle.png) · [SVG](evidence-lifecycle.svg)

Proposed evidence-carrying lifecycle informed by [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final), [Gu et al.](https://arxiv.org/pdf/2503.22625), and [Google SRE](https://sre.google/workbook/canarying-releases/). No productivity effect is implied by the arrows.

## canary-dilution

[PNG](canary-dilution.png) · [SVG](canary-dilution.svg)

Illustrative calculation based on [Google SRE's monitoring example](https://sre.google/workbook/canarying-releases/): 5% canary traffic × 20% canary errors gives 1% overall errors, assuming a 0% control error rate. These are example values, not measured results.

### Worked-example assumptions

Google SRE gives the 5%-traffic, 20%-error canary example and explains how aggregation dilutes the signal. The figure explicitly assumes 0% errors in the control. With equal request weighting, the service error rate is (0.05 × 0.20) + (0.95 × 0) = 0.01, or 1%. This is a hypothetical calculation, not a research dataset or a service-specific alert threshold.

[Machine-readable plotted values](writing/eng/posts/ai%20native%20sdlc/images/figure-data.json)

## Reproduction and evidence status

The shared drawing source is [build_figures.py](build_figures.py). It uses Pillow and system Arial fonts. Run it from writing/eng. It generates both raster and vector figures for the supporting figures. The [header reproduction script](build_headers.py) generates the article topic maps using the same drawing primitives.

Workflow diagrams are author-designed proposals informed by the linked research and guidance. They are not copied diagrams or established standards. Citations substantiate the underlying concerns, not a demonstrated ROI for the complete proposed workflow. Numeric graphs use source-reported quantities with their units and limitations.

## Article topic map

`article-overview.png` and `article-overview.svg` summarize the topics and practical decisions in Draft.md. This is author synthesis, not an empirical finding or a validated operating model. The article’s [research bibliography](writing/eng/posts/ai%20native%20sdlc/References.md) documents the evidence and its limits; no quantitative claims are introduced in the map.
