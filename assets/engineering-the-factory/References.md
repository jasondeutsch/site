# Research and outline review

Gathered October 4, 2026.

## Outline reviewed

Source: [outline.md](writing/eng/posts/engineering%20the%20factory/outline.md)

Article focus: Turns the factory concept into architecture, ownership, verification, and failure handling.

The draft groups the outline’s 17 components into a connected design using a dependency-update example. It qualifies the verification pyramid: passing checks have limited scope, and rollback may not undo data changes. Risk-based autonomy and metrics are proposals, not validated scoring standards.

## Annotated sources

Preference was given to academic and university research. NIST and Google SRE are primary technical sources added where implementation guidance is more appropriate than a productivity experiment. Notes rely on accessible abstracts, records, and selected source passages, not a comprehensive methodological review.

### 1. Secure Software Development Framework, version 1.1

Murugiah Souppaya, Karen Scarfone, and Donna Dodson, February 2022.

[Source](https://csrc.nist.gov/pubs/sp/800/218/final)

Status: Final NIST SP 800-218 guidance, not an academic experiment.

Secure-development practices across lifecycles. Version 1.2 was listed as an initial public draft in the record checked: https://csrc.nist.gov/pubs/sp/800/218/r1/ipd. Neither document certifies the proposed architecture.

### 2. Lost in the Middle: How Language Models Use Long Contexts

Nelson F. Liu et al., 2023 arXiv paper.

[Source](https://arxiv.org/abs/2307.03172)

Status: Academic research; arXiv abstract reviewed.

Finds positional sensitivity in retrieval tasks. Older models and non-coding tasks limit direct application to current agents.

### 3. Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?

Thibaud Gloaguen et al., revised September 29, 2026.

[Source](https://arxiv.org/abs/2602.11988)

Status: Research paper; arXiv record reviewed, peer-review status not verified.

The abstract reports no general success improvement and increased inference cost in the tested settings. A reason to evaluate guidance, not a universal instruction to remove it.

### 4. Agentless: Demystifying LLM-based Software Engineering Agents

Chunqiu Steven Xia et al., 2024.

[Source](https://arxiv.org/abs/2407.01489)

Status: Research paper; arXiv version reviewed.

A structured repair pipeline provides a counterexample to assuming more elaborate agent orchestration is always better. Its results apply to the tested issue-repair benchmark.

### 5. SWE-bench: Can Language Models Resolve Real-World GitHub Issues?

Carlos E. Jimenez et al., 2023; Princeton article by Carlos Jimenez and John Yang, December 6, 2023.

[Source](https://pli.princeton.edu/blog/2023/swe-bench-can-language-models-resolve-real-world-github-issues)

Status: University explanation of a research benchmark.

Repository issue repair with executable evaluation. The benchmark boundary differs from complete delivery, security acceptance, and user outcomes. Original paper: https://arxiv.org/abs/2310.06770.

### 6. Canarying Releases

Alec Warner and Štěpán Davidovič, The Site Reliability Workbook, 2018.

[Source](https://sre.google/workbook/canarying-releases/)

Status: Primary practitioner publication from Google; included for delivery design.

Describes evaluation of limited deployments before wider rollout. Applicability depends on the service and ability to compare signals and control exposure.

### 7. Ironies of Automation

Lisanne Bainbridge, 1983.

[Source](https://doi.org/10.1016/0005-1098%2883%2990046-8)

Status: Peer-reviewed, Automatica 19(6), 775–779; publisher abstract reviewed.

Discusses the operator problems left by automation. Historical conceptual grounding, not an empirical study of coding agents.

## Evidence limits

The article’s architecture and examples are the author’s proposals. These references do not demonstrate that a complete software factory produces positive ROI, that more autonomy is always preferable, or that all current tools share the limitations of older models. Shared improvements should be tested on representative work and followed through delivery and maintenance.

## Supporting figures

[Figure sources and methodology](writing/eng/posts/engineering%20the%20factory/images/Figure%20sources.md) documents the diagram status, numeric values, assumptions, and source links for the revised supporting visuals.
