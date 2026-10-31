# Figure sources and methodology

Prepared October 5, 2026. All embedded figures use deterministic drawing, with PNG embeds and editable SVG equivalents. The original artistic illustrations are no longer embedded.

## measurement-boundary

[PNG](measurement-boundary.png) · [SVG](measurement-boundary.svg)

Proposed measurement boundary informed by [SPACE](https://doi.org/10.1145/3454122.3454124), [Cui et al.](https://pubsonline.informs.org/doi/10.1287/mnsc.2025.00535), and [METR](https://arxiv.org/abs/2507.09089v2). The formula is a cohort-level accounting definition, not an observed result.

## perception-versus-time

[PNG](perception-versus-time.png) · [SVG](perception-versus-time.svg)

Historical findings from [Becker et al., 2025](https://arxiv.org/abs/2507.09089v2); measured interval of +2% to +39% reported in [METR's 2026 follow-up](https://metr.org/blog/2026-02-24-uplift-update/). Forecasts are participant estimates, not measured effects. The follow-up cautions against generalizing the older result to current tools.

### Data and interpretation

The early-2025 paper abstract reports forecasts of 24% shorter completion time, retrospective estimates of 20% shorter time, and a measured 19% increase. All bars use change in completion time relative to no AI; negative is shorter and positive is longer. Participant forecasts and estimates are not measurements. METR’s February 2026 update reports the original estimate interval of +2% to +39%; the chart reproduces that reported interval without deriving a new interval or attaching one to the perceptions. The trial covered 16 developers and 246 tasks. It does not estimate all developers’ performance in 2026.

[Machine-readable plotted values](writing/eng/posts/where%20teams%20go%20wrong/images/figure-data.json)

## Reproduction and evidence status

The shared drawing source is [build_figures.py](build_figures.py). It uses Pillow and system Arial fonts. Run it from writing/eng. It generates both raster and vector figures for the supporting figures. The [header reproduction script](build_headers.py) generates the article topic maps using the same drawing primitives.

Workflow diagrams are author-designed proposals informed by the linked research and guidance. They are not copied diagrams or established standards. Citations substantiate the underlying concerns, not a demonstrated ROI for the complete proposed workflow. Numeric graphs use source-reported quantities with their units and limitations.

## Article topic map

`article-overview.png` and `article-overview.svg` summarize the topics and practical decisions in Draft.md. This is author synthesis, not an empirical finding or a validated operating model. The article’s [research bibliography](writing/eng/posts/where%20teams%20go%20wrong/References.md) documents the evidence and its limits; no quantitative claims are introduced in the map.
