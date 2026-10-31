# Research and outline review

Gathered October 4, 2026.

## Outline reviewed

Source: [outline.md](writing/eng/posts/coding%20agents%20to%20factories/outline.md)

Article focus: Defines the production-system boundary and the relationship between harnesses and factories.

The outline supplies a conceptual definition. The draft avoids asserting that implementation is dramatically cheaper for every team, treats dark-factory autonomy as a thought experiment, and replaces guaranteed compounding with measured reuse. Examples are illustrative.

## Annotated sources

Preference was given to academic and university research. NIST and Google SRE are primary technical sources added where implementation guidance is more appropriate than a productivity experiment. Notes rely on accessible abstracts, records, and selected source passages, not a comprehensive methodological review.

### 1. Why AI Agents Still Need You: Findings from Developer-Agent Collaborations in the Wild

Aayush Kumar et al., revised October 9, 2025.

[Source](https://arxiv.org/abs/2506.12347)

Status: Research paper; arXiv abstract reviewed.

Observes 19 developers on 33 issues and describes incremental collaboration. Small observational sample; no estimate of organizational ROI.

### 2. SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering

John Yang et al., 2024.

[Source](https://arxiv.org/abs/2405.15793)

Status: Research paper; arXiv version reviewed.

Studies agent-facing interfaces for repository tasks. Supports evaluating the working environment; benchmark results do not establish release safety or financial returns.

### 3. Agentless: Demystifying LLM-based Software Engineering Agents

Chunqiu Steven Xia et al., 2024.

[Source](https://arxiv.org/abs/2407.01489)

Status: Research paper; arXiv version reviewed.

A structured repair pipeline provides a counterexample to assuming more elaborate agent orchestration is always better. Its results apply to the tested issue-repair benchmark.

### 4. Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?

Thibaud Gloaguen et al., revised September 29, 2026.

[Source](https://arxiv.org/abs/2602.11988)

Status: Research paper; arXiv record reviewed, peer-review status not verified.

The abstract reports no general success improvement and increased inference cost in the tested settings. A reason to evaluate guidance, not a universal instruction to remove it.

### 5. The Productivity J-Curve: How Intangibles Complement General Purpose Technologies

Erik Brynjolfsson, Daniel Rock, and Chad Syverson, 2021.

[Source](https://doi.org/10.1257/mac.20180386)

Status: Peer-reviewed, American Economic Journal: Macroeconomics. NBER working-paper record also checked.

Economic framework for complementary process and human-capital investment. It does not guarantee a payoff from a particular engineering platform.

## Evidence limits

The article’s architecture and examples are the author’s proposals. These references do not demonstrate that a complete software factory produces positive ROI, that more autonomy is always preferable, or that all current tools share the limitations of older models. Shared improvements should be tested on representative work and followed through delivery and maintenance.

## Supporting figures

[Figure sources and methodology](writing/eng/posts/coding%20agents%20to%20factories/images/Figure%20sources.md) documents the diagram status, numeric values, assumptions, and source links for the revised supporting visuals.
