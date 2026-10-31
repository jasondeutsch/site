# Figure sources and methodology

Prepared October 5, 2026. All embedded figures use deterministic drawing, with PNG embeds and editable SVG equivalents. The original artistic illustrations are no longer embedded.

## shared-capability

[PNG](shared-capability.png) · [SVG](shared-capability.svg)

Proposed ownership map informed by [SWE-agent](https://arxiv.org/abs/2405.15793) and [DevEx](https://doi.org/10.1145/3610285). The ownership boundary is a design choice, not a measured maturity standard.

## field-experiment

[PNG](field-experiment.png) · [SVG](field-experiment.svg)

Measured task-completion effect from [Cui et al., 2026](https://pubsonline.informs.org/doi/10.1287/mnsc.2025.00535). The whisker is ±1 standard error, not a 95% confidence interval. This is one pooled estimate, not an estimate of ROI.

### Data and calculations

The journal abstract reports 4,867 developers, a pooled effect on completed tasks of 26.08%, and a standard error of 10.3 percentage points. The plotted whisker is 26.08 ± 10.3 = [15.78, 36.38]. It is a one-standard-error range, not a confidence interval. The three trials differ and concern a code-completion assistant. No pooled comparison with METR is made.

[Machine-readable plotted values](writing/eng/posts/modern%20ic%20dichotomy/images/figure-data.json)

## Reproduction and evidence status

The shared drawing source is [build_figures.py](build_figures.py). It uses Pillow and system Arial fonts. Run it from writing/eng. It generates both raster and vector figures for the supporting figures. The [header reproduction script](build_headers.py) generates the article topic maps using the same drawing primitives.

Workflow diagrams are author-designed proposals informed by the linked research and guidance. They are not copied diagrams or established standards. Citations substantiate the underlying concerns, not a demonstrated ROI for the complete proposed workflow. Numeric graphs use source-reported quantities with their units and limitations.

## Article topic map

`article-overview.png` and `article-overview.svg` summarize the topics and practical decisions in Draft.md. This is author synthesis, not an empirical finding or a validated operating model. The article’s [research bibliography](writing/eng/posts/modern%20ic%20dichotomy/References.md) documents the evidence and its limits; no quantitative claims are introduced in the map.
