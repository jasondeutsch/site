# Research and outline review

Gathered October 4, 2026.

## Author perspective: November 16, 2026

The author supplied a first-person account of why he is building a software factory: abstraction can make more complicated work possible, and practical experience can inform professional and academic understanding. The revised opening uses that account to frame the engineering investigation. The Kubernetes example expresses the author's abstraction argument. The original sample retains his MBA analogy; the shorter introduction focuses on the factory's engineering question. The [verbatim author sample](../../editing-reviews/factory-author-voice-2026-11-16/Author%20sample.md) is retained for editorial reference.

The author also identified getting the abstractions between steps right as the largest design challenge, with componentization and decoupling as goals. The new boundaries section closely edits that follow-up. The controller and Registry references describe the current design; the article does not invent an earlier architecture or claim which particular redesign produced it.

The author further described an in-progress “bag of data/bag of context” design, currently represented as a volume for task files. Specifications, plans, and task steps are distinguished from the delivered code. The intended workflow deterministically supplies each agent its location/access, reducing dependence on a specific absolute path, URL, or file. This is author-supplied design intent, not a measured flexibility improvement or a claim that every part of the proposed interface is implemented. No volume type, access-control mechanism, artifact schema, or completion protocol is inferred from this account.

The author described deterministic workflow execution with stages made up of steps that can run sequentially or concurrently. He also reported creating an actor-model-inspired inbox system supporting individually addressed and broadcast messages, communication between agents, and human participation. “Agent-to-agent” is used generically here, without asserting implementation of the formal A2A protocol. This account supplies no new file-discovery rule, message-delivery guarantee, ordering guarantee, or isolation mechanism.

## Project evidence review: November 16, 2026

This revision uses the current `/Users/j/pragma/evals` directory at the author's direction. It replaces the former October 29 and October 31 anecdotes with the evidence listed below. No new factory run, product test, or paid model call was performed.

### November 1: completed workflow, failed grading

- [Result](</Users/j/pragma/evals/runs/GO-001-20261101T211413927528Z-bee829/result.json>): `execution_state=completed`; all ten named acceptance cases passed; `go vet ./...` exited 1; overall grading outcome `fail`.
- [Saved vet diagnostic](</Users/j/pragma/evals/runs/GO-001-20261101T211413927528Z-bee829/vet.stderr>): four diagnostics identify use of an API requiring Go 1.25 or later in a module declaring Go 1.22. The article describes the recorded diagnostic without asserting a new reproduction.
- Reported token count: 20,153,273 (rounded to 20.15 million in prose). Dollar cost is null/unknown. The result is protocol/version 1 and describes a local host grader. It states that neither runner nor grader is a security sandbox and makes no claim that grader files were inaccessible to agents.

### November 7: passing checks on another candidate

- [Result](</Users/j/pragma/evals/runs/GO-001-20261107T160953628967Z-8271ed/result.json>): completed workflow; the ten acceptance cases and vet check passed; overall grading outcome `pass`.
- Reported token count: 5,042,751 (rounded to 5.04 million). Dollar cost is null/unknown. The result uses protocol/version 1, with the same stated host-grading limitations.
- Its input variant differs from November 1. These individual runs do not establish a causal efficiency improvement or a productivity rate.

### November 14: completed workflow, independent product grading unavailable

- [Result](</Users/j/pragma/evals/runs/GO-001-20261114T202629280058Z-578ee3/result.json>): completed workflow under protocol/version 2; independent grading outcome `unavailable`, with no independent grading checks. The public Factory interface does not expose the required GO-001 acceptance operation.
- [Evaluation protocol](</Users/j/pragma/evals/README.md>): the harness uses only public Factory commands and does not open product workspaces or run product checks to compensate for missing interface capabilities. Reviewer findings and approvals remain attributed assessments. Protocol-2 trials must not be pooled with historical locally graded trials as if acceptance evidence were equivalent.
- [Architecture review](</Users/j/pragma/evals/.factory/executions/3141aac4-34cd-40d5-8436-f2552bfc6dfd/files/reviews/architecture.md>): the final design review records seven findings as addressed. They include strict JSON validation, conditional key storage, and a correction from `go test taskapi_test.go` to `go test .`. The review reports checking the corrected commands against the source workspace. These are reviewer-attributed design-stage observations, not independent grading of the final product.
- [Factory report](</Users/j/pragma/evals/runs/GO-001-20261114T202629280058Z-578ee3/factory-report.json>): accounting is input plus cache reads, cache writes, and output. The result records 7,970,186 tokens (rounded to 7.97 million), with dollar cost unknown. Package digests are present, but control-plane build identity is unavailable. Counts across different token classes are not converted to dollar estimates in the article.

### Task and implementation boundaries

- [GO-001 brief](</Users/j/pragma/evals/scenario/brief.md>): optional idempotency keys for a Go task API, exact-byte request comparison, absent/blank header distinction, invalid-request behavior, and concurrency requirements. Existing Go version and dependency constraints remain subject to the brief's human-approval rule.
- [Controls README](</Users/j/pragma/controls/README.md>): accepted MCP `step_result` messages govern step completion. Process exit and prose do not advance a step. The host runner remains explicitly documented as not being a sandbox.
- [Registry README](</Users/j/pragma/registry/README.md>): agent packages, reusable skills, and deterministic Git lifecycle hooks. Documentation establishes the described responsibilities, without demonstrating operational effectiveness or ROI.

- [Execution contract](</Users/j/pragma/controls/docs/execution-contract.md>): separate engine and runner interfaces, structured results, visits versus retries, and explicit distinctions between current behavior and design targets. Authenticated authority, engine/projection atomicity, and parts of recovery remain targets.
- [Execution files and variables](</Users/j/pragma/controls/docs/execution-files.md>): execution documents separate from source, assigned paths, frozen initial inputs, pinned file locations, and host artifact collection. Container volumes and remote transport are separate capabilities. These mechanisms are described from documentation, not newly tested.

Local evidence was read without modifying the project or starting its services. The proposed independent acceptance operation is an engineering recommendation; it is not claimed to exist. The dependency-update example remains hypothetical. Local links need reviewed public equivalents before external publication.

## Outline reviewed

Source: [outline.md](writing/eng/posts/engineering%20the%20factory/outline.md)

Article focus: Turns the factory concept into architecture, ownership, verification, and failure handling.

The main article, *Building a software factory: contracts, context, and verification*, develops the control-plane and runner boundaries, structured completion, shared execution documents, and requirement preservation. It compares all three GO-001 records with their protocol differences, relates the architecture to scoped research findings, and proposes a controlled comparison for future evaluation. The [supporting notes](Supporting%20notes.md) retain additional detail, the hypothetical dependency-update workflow, and conceptual diagrams. Verification and rollout diagrams remain proposed designs; passing checks have limited scope, and rollback may not undo data changes.

## Annotated sources

The arXiv abstracts for *Lost in the Middle*, *Evaluating AGENTS.md*, and *Agentless* were rechecked on November 16, 2026 for this technical revision. No new benchmark results are inferred. Other external summaries retain their earlier review scope.

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
