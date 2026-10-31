# Research and outline review

Gathered October 4, 2026.

## Outline reviewed

Source: [outline.md](writing/eng/posts/ai%20native%20sdlc/outline.md)

Article focus: Proposes an evidence-carrying lifecycle with deliberate control points and production feedback.

The draft keeps the outline’s lifecycle proposal but preserves the purpose of existing controls. It avoids zero-cost implementation assumptions, distinguishes tests from business acceptance, and treats the closed-loop analogy as limited. The revised draft follows a hypothetical account-recovery change through specification, bounded execution, verification, rollout, and intervention. The lifecycle diagram supplies the overall model; the canary figure is illustrative arithmetic, not empirical data.

## Annotated sources

Preference was given to academic and university research. NIST and Google SRE are primary technical sources added where implementation guidance is more appropriate than a productivity experiment. Notes rely on accessible abstracts, records, and selected source passages, not a comprehensive methodological review.

### 1. Secure Software Development Framework, version 1.1

Murugiah Souppaya, Karen Scarfone, and Donna Dodson, February 2022.

[Source](https://csrc.nist.gov/pubs/sp/800/218/final)

Status: Final NIST SP 800-218 guidance, not an academic experiment.

Secure-development practices across lifecycles. Version 1.2 was listed as an initial public draft in the record checked: https://csrc.nist.gov/pubs/sp/800/218/r1/ipd. Neither document certifies the proposed architecture.

### 2. SWE-bench: Can Language Models Resolve Real-World GitHub Issues?

Carlos E. Jimenez et al., 2023; Princeton article by Carlos Jimenez and John Yang, December 6, 2023.

[Source](https://pli.princeton.edu/blog/2023/swe-bench-can-language-models-resolve-real-world-github-issues)

Status: University explanation of a research benchmark.

Repository issue repair with executable evaluation. The benchmark boundary differs from complete delivery, security acceptance, and user outcomes. Original paper: https://arxiv.org/abs/2310.06770.

### 3. Challenges and Paths Towards AI for Software Engineering

Alex Gu et al., 2025.

[Source](https://arxiv.org/pdf/2503.22625)

Status: Academic research agenda; MIT News reports an ICML presentation.

Taxonomy of tasks and open challenges beyond code generation. Useful design background, not validation of a factory or lifecycle. University summary: https://news.mit.edu/2025/can-ai-really-code-study-maps-roadblocks-to-autonomous-software-engineering-0716.

### 4. Canarying Releases

Alec Warner and Štěpán Davidovič, The Site Reliability Workbook, 2018.

[Source](https://sre.google/workbook/canarying-releases/)

Status: Primary practitioner publication from Google; included for delivery design.

Describes evaluation of limited deployments before wider rollout. Applicability depends on the service and ability to compare signals and control exposure.

### 5. Ironies of Automation

Lisanne Bainbridge, 1983.

[Source](https://doi.org/10.1016/0005-1098%2883%2990046-8)

Status: Peer-reviewed, Automatica 19(6), 775–779; publisher abstract reviewed.

Discusses the operator problems left by automation. Historical conceptual grounding, not an empirical study of coding agents.

### 6. Writing Code vs. Shipping Code: Productivity Effects Across Generations of AI Coding Tools

Mert Demirer, Leon Musolff, and Liyuan Yang, 2026; revised September paper record.

[Source](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6859839)

Status: Working paper; record checked during the earlier bibliography research.

Observational evidence of gains diminishing between coding and release. Does not imply implementation was every team’s bottleneck or quantify ROI.

## Evidence limits

The article’s architecture and examples are the author’s proposals. These references do not demonstrate that a complete software factory produces positive ROI, that more autonomy is always preferable, or that all current tools share the limitations of older models. Shared improvements should be tested on representative work and followed through delivery and maintenance.

## Supporting figures

[Figure sources and methodology](writing/eng/posts/ai%20native%20sdlc/images/Figure%20sources.md) documents the diagram status, numeric values, assumptions, and source links for the revised supporting visuals.
