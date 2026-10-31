# Research and outline review

Gathered October 4, 2026.

## Outline reviewed

Source: [Outilne.md](Outilne.md)

Article focus: Distinguishes personal AI workflows from maintained organizational capability.

The original filename is preserved. Adoption percentages and the 50% improvement example are omitted as unsupported facts. The maturity ladder is treated as descriptive, not a standard. The draft discusses maintenance, local autonomy, and the ability of shared infrastructure to spread errors.

## Annotated sources

Preference was given to academic and university research. NIST and Google SRE are primary technical sources added where implementation guidance is more appropriate than a productivity experiment. Notes rely on accessible abstracts, records, and selected source passages, not a comprehensive methodological review.

### 1. The Effects of Generative AI on High-Skilled Work: Evidence from Three Field Experiments with Software Developers

Kevin Zheyuan Cui et al., Management Science, 2026.

[Source](https://pubsonline.informs.org/doi/10.1287/mnsc.2025.00535)

Status: Peer-reviewed field-experiment paper; publisher abstract checked in earlier research.

Positive task-completion evidence. Does not identify the best platform design or establish lifetime maintenance cost. MIT working paper: https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf.

### 2. Why AI Agents Still Need You: Findings from Developer-Agent Collaborations in the Wild

Aayush Kumar et al., revised October 9, 2025.

[Source](https://arxiv.org/abs/2506.12347)

Status: Research paper; arXiv abstract reviewed.

Observes 19 developers on 33 issues and describes incremental collaboration. Small observational sample; no estimate of organizational ROI.

### 3. Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?

Thibaud Gloaguen et al., revised September 29, 2026.

[Source](https://arxiv.org/abs/2602.11988)

Status: Research paper; arXiv record reviewed, peer-review status not verified.

The abstract reports no general success improvement and increased inference cost in the tested settings. A reason to evaluate guidance, not a universal instruction to remove it.

### 4. SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering

John Yang et al., 2024.

[Source](https://arxiv.org/abs/2405.15793)

Status: Research paper; arXiv version reviewed.

Studies agent-facing interfaces for repository tasks. Supports evaluating the working environment; benchmark results do not establish release safety or financial returns.

### 5. Why Some Organizations Turn AI Experiments into Business Value While Others Quietly Fail

MIT Sloan Office of Communications, September 9, 2026; research by Katherine C. Kellogg, Batia Wiesenfeld, and Arvind Karunakaran.

[Source](https://mitsloan.mit.edu/press/why-some-organizations-turn-ai-experiments-business-value-while-others-quietly-fail)

Status: University account of a working paper; underlying paper was inaccessible in the previous research pass.

Two cases in healthcare and law connect organizational support to sustained experimentation. Different setting from software engineering; not a causal financial-return estimate.

### 6. The SPACE of Developer Productivity

Nicole Forsgren et al., ACM Queue, 2021.

[Source](https://doi.org/10.1145/3454122.3454124)

Status: Published research framework, not an AI-effect experiment.

Multidimensional productivity measurement. Useful for avoiding a single output metric; does not quantify platform gains.

### 7. DevEx: What Actually Drives Productivity?

Abi Noda, Margaret-Anne Storey, Nicole Forsgren, and Michaela Greiler, 2023.

[Source](https://doi.org/10.1145/3610285)

Status: Communications of the ACM, 66(11), 44–49. Publisher and author research pages checked.

Developer-centered measurement and friction. Author-hosted Queue version: https://www.michaelagreiler.com/wp-content/uploads/2024/06/DevEx-WhatDrivesProductivity.pdf. A framework, not proof that AI platform investment improves outcomes.

## Evidence limits

The article’s architecture and examples are the author’s proposals. These references do not demonstrate that a complete software factory produces positive ROI, that more autonomy is always preferable, or that all current tools share the limitations of older models. Shared improvements should be tested on representative work and followed through delivery and maintenance.

## Supporting figures

[Figure sources and methodology](writing/eng/posts/modern%20ic%20dichotomy/images/Figure%20sources.md) documents the diagram status, numeric values, assumptions, and source links for the revised supporting visuals.
