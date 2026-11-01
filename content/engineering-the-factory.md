# Engineering the software factory

Jason Deutsch

Building my own software factory is changing how I think about the engineer's job. I see it moving toward a higher level of abstraction: defining the production system that turns intent into working software, deciding what evidence makes its output acceptable, and improving that system when it fails.

The engineering responsibility grows with the scope of delegation. A person who writes a function reasons about its behavior. A person who designs a workflow that produces many changes must also reason about its inputs, permissions, failure paths, and the consequences of accepting its output. The implementation still matters; more of the engineer's attention moves to the conditions under which it is produced and trusted.

This article is my current working model, informed by building the control plane, reusable agent packages, and evaluation tooling in my own project. My positions will change as I learn from the project and as the industry's understanding develops. The recommendations below are design judgments to test, rather than a settled blueprint for every organization.

![Article topic map summarizing the main topics and practical decisions.](writing/eng/posts/engineering%20the%20factory/images/article-overview.png)

[Figure notes](writing/eng/posts/engineering%20the%20factory/images/Figure%20sources.md)

## Key points

- Software factory engineering moves more of our work toward specifications, interfaces, verification, and the behavior of the production system itself.
- Start with a repeated delivery problem and define the system's responsibilities before choosing an agent framework.
- Specifications should state intended behavior and the evidence required to accept a change.
- Context needs ownership and freshness; larger prompts aren't a substitute for reliable information.
- Use ordinary software for workflow rules and models for tasks requiring interpretation.
- Verification, controlled delivery, and human intervention need to be designed together.
- Measure the cost of accepted changes and failures across the process.

## What building it has changed

The project has made the work around generation much more concrete. I am engineering completion contracts, review handoffs, execution state, and the evidence needed to assess a run. Those concerns determine whether generated work can move through a dependable process.

One October 29 evaluation illustrates the value of design review. The architecture reviewer caught ambiguity about an absent HTTP header and the loss of strict JSON validation in the proposed plan. The author revised the design, and the reviewer checked the corrections using stable finding identifiers. The useful output was a corrected contract before implementation depended on it. The workflow completed, but product checks were reviewer-reported; the operator did not independently test the product. [Project run assessment, October 29](</Users/j/pragma/evals_old/factory-go/runs/GO-001-20261029-082749-concurrent/assessment.md>).

A later run exposed a different boundary. The architect produced its documents but repeatedly failed to submit an accepted completion result: one side sent artifact strings while the controller expected objects. The controller then mislabeled the validation error as temporary unavailability and advised a retry. The workflow was eventually cancelled. Documents existed, but the production system could not accept the handoff. That failure directs attention to schema compatibility, error classification, and recovery behavior. It is an observation about that run, not a claim that the same defect remains in today's implementation. [Project run assessment, October 31](</Users/j/pragma/evals_old/factory-go/runs/GO-001-20261031-145233-git-hooks/assessment.md>).

The October 29 run also recorded reviewers attempting to read documents before publication. Starting agents concurrently had introduced a coordination obligation: consumers needed to know when usable inputs existed. Concurrency has to earn its place through the dependencies it can actually respect. [Project run assessment, remaining issues](</Users/j/pragma/evals_old/factory-go/runs/GO-001-20261029-082749-concurrent/assessment.md>).

Cost accounting needs the same care. That run reported about 2.74 million tokens, most of them cached input. Its dollar cost was unknown. The reported token total fell relative to the preceding run, but runtime, skills, and instructions had changed; a single comparison cannot identify the cause or establish an efficiency gain. I need repeatable evaluation and trustworthy accounting before claiming that the factory saves money. [Project run assessment, usage](</Users/j/pragma/evals_old/factory-go/runs/GO-001-20261029-082749-concurrent/assessment.md>).

Building a software factory means taking responsibility for what happens between a request and a maintained production change. Choosing a model is one decision inside that job. The engineer still has to determine how the system handles conflicting requirements, failed checks, or a release that needs to be stopped.

A useful first version can be small. Take one repeated class of work, define its boundary, and engineer a dependable route through it. A sprawling framework with unclear failure handling is harder to trust than a narrow workflow whose behavior the team understands.

## Define what enters and what leaves

Suppose the first workflow handles routine dependency updates in one service. Its input includes the proposed version and update policy. Its output includes a patch, test results, and a record of the dependency changes. Acceptance requires a named set of checks; release follows the team's existing authorization process.

That boundary excludes updates requiring application redesign. An agent can identify one of those cases and stop with an explanation. Stopping is a valid outcome when the alternative is guessing.

Assign an owner to the workflow itself. Someone has to maintain the environment and respond when the update process stops working. Otherwise a supposedly shared capability becomes a queue nobody owns.

## Specify behavior before generating code

A task needs enough detail to tell an executor what to change and a reviewer how to judge the result. Include constraints that could invalidate an otherwise plausible implementation.

For an API change, that might mean preserving response behavior for existing clients and meeting a latency budget. Translate stable requirements into contract tests where possible. Keep the reasons behind those tests available, because a passing suite cannot cover an intent nobody expressed.

Separate a proposed plan from accepted requirements. An agent may discover a better implementation approach. It should not silently redefine the customer requirement to suit that approach.

Security belongs in the same design. NIST's final SSDF version 1.1 describes practices that can be integrated into different development lifecycles. It is guidance for secure development, not a certification of an agent workflow. [NIST SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final)

## Treat context as maintained infrastructure

A context system should help an executor find authoritative information about the part of the system it is changing. Architecture decisions need dates and owners. Generated summaries should retain links to the source and indicate when they were refreshed.

Conflicts deserve explicit handling. A current contract and an old design document may disagree. The agent needs a rule for identifying the authority or a way to ask the owner. Returning both documents without explanation exports the problem into every execution.

More text is not automatically better. Liu and colleagues found positional sensitivity in long-context retrieval tasks: models did not use information uniformly across an input. That older study doesn't quantify today's coding-agent behavior, but it supports evaluating retrieval rather than assuming capacity guarantees comprehension. [Lost in the Middle](https://arxiv.org/abs/2307.03172)

Repository instructions need the same discipline. Gloaguen and colleagues' 2026 evaluation found that context files did not generally improve task success in their tested settings, while increasing inference cost. Test useful guidance against real tasks and remove material that adds cost without helping. [Evaluating AGENTS.md](https://arxiv.org/abs/2602.11988)

## Coordinate execution with ordinary software

Decompose work around stable interfaces and explicit dependencies. If a migration changes both producer and consumer, establish the compatibility sequence before running either change. Independent work can run concurrently; dependent work needs coordination.

Keep workflow state outside the agent's conversation. Record which revision a task started from, what artifacts it produced, and which checks ran against that result. A resumed task should not rely on a model remembering whether a deployment happened.

Rules such as retry limits, timeouts, and approval requirements are ordinary software. Let the workflow enforce them. Use a model to interpret an unfamiliar failure or propose a repair when that requires judgment.

That separation is reflected in the current project structure. The controller owns workflow routing and accepted outcomes; reusable packages supply agent behavior. Optional Git hooks handle worktree preparation and stage commits without asking a model to remember those lifecycle operations. These are implementation choices I can inspect and revise independently. [Controller documentation](</Users/j/pragma/controls/README.md>); [Registry documentation](</Users/j/pragma/registry/README.md>).

Agentless demonstrates that a constrained sequence can be competitive on issue-repair benchmarks. It provides a reason to compare a simple process with a more elaborate one, rather than treating orchestration complexity as capability. [Agentless](https://arxiv.org/abs/2407.01489)

![A matrix distinguishes what five evidence types establish and what remains unverified.](verification-scope.png)

*Verification map: checks establish scoped claims, not complete correctness. Informed by [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final) and [Gu et al.](https://arxiv.org/pdf/2503.22625).*

[Figure sources and methodology](writing/eng/posts/engineering%20the%20factory/images/Figure%20sources.md)

## Build verification around the claim being made

Start with inexpensive checks that can catch mechanical mistakes. Then evaluate behavior and the properties that matter to the system. A build establishes that a candidate builds; it says little about whether an authorization rule is correct.

| Evidence | What it helps establish | What remains open |
| --- | --- | --- |
| Build and static checks | Basic consistency with configured rules | Intended behavior |
| Unit and contract tests | Specified behavior at selected boundaries | Untested cases and combined changes |
| System and security checks | Selected operational properties | Conditions the checks don't model |
| Human review | Interpretation and consequential tradeoffs | Human mistakes and missing context |
| Controlled production rollout | Behavior under actual use | Rare or delayed failures |

Use AI review as another source of feedback. It should not be the only evidence for a claim made by the generator, particularly when both use the same assumptions.

SWE-bench evaluates patches against repository tests for issue-resolution tasks. It is a useful example of executable evaluation, with a boundary much narrower than a complete release decision. [Princeton's benchmark explanation](https://pli.princeton.edu/blog/2023/swe-bench-can-language-models-resolve-real-world-github-issues)

## Design autonomy with recovery

![Candidates pass evidence and authorization gates before limited deployment, comparison, expansion, or recovery.](controlled-rollout.png)

*Proposed rollout workflow based on [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final) and [Google SRE](https://sre.google/workbook/canarying-releases/). Recovery depends on the change; rollback is not always sufficient.*

[Figure sources and methodology](writing/eng/posts/engineering%20the%20factory/images/Figure%20sources.md)

Before granting a workflow more authority, ask how the team will detect and recover from a bad result. A reversible configuration change with strong checks is different from a destructive data migration. A nominal rollback command may not undo writes already made to a database.

Use progressive rollout where the service and its traffic allow it. Google's SRE workbook describes canarying as a limited deployment evaluated before wider release. That provides production evidence while reducing exposure; it does not eliminate deployment risk. [Canarying releases](https://sre.google/workbook/canarying-releases/)

Permissions should match the task. Execution needs an identity and an audit trail. Where a policy must hold, enforce it at the tool or deployment boundary instead of relying on a prompt to remember it.

My current local runner also illustrates the gap between a desired control and an implemented one: it executes with the host user's permissions and is explicitly documented as not being a sandbox. A declared task boundary does not establish isolation. That limit belongs in the operating model and in any claims I make about the system. [Current runner limits](</Users/j/pragma/controls/README.md>).

## Give humans a usable way to intervene

An escalation should explain the unresolved question and provide the evidence needed to answer it. A transcript dump leaves the engineer to reconstruct the work. A concise account of the failing check, attempted repairs, and current diff is more useful.

Bainbridge's *Ironies of Automation* warns that automation can leave operators with difficult abnormal conditions. Although it predates coding agents by decades, the concern applies when a workflow expects a person to rescue a failure they haven't been following. [Automatica](https://doi.org/10.1016/0005-1098%2883%2990046-8)

Make it possible to stop work and inspect state. Keep the engineer's authority clear. A human approval step needs time and information to function.

## Improve the system from its failures

Record execution costs and failures, including unsuccessful tasks. Measure time to an accepted change, review effort, and escaped defects. An impressive first-pass rate can hide a large cleanup burden if the acceptance checks are weak.

When a failure recurs, decide whether the fix belongs in context, a tool, or a test. Keep a representative set of past tasks to check that the improvement helps without damaging other work. Evaluate changes to the factory itself before expanding their use.

## Engineering at a higher level of abstraction

The shift I am arguing for changes the unit of engineering attention. Alongside the individual implementation, we design the specifications, tools, execution boundaries, and checks that shape a whole class of implementations. A recurring failure becomes a question about the production system: which assumption, interface, or missing check allowed it through?

That requires engineers to stay close enough to the code and operating environment to investigate failures. Delegation without that understanding makes the system harder to repair. Higher abstraction brings a wider responsibility for understanding how the layers interact.

For my project, the useful test of this direction is whether improvements to the factory make subsequent work easier to specify, verify, and maintain. I want to judge that through accepted changes, recovery effort, and total cost. More autonomous execution is useful only when the surrounding system can support it.

Start with a boundary you can support. Broaden it when evidence shows that the system handles the work and the team can recover when it doesn't. I expect both that boundary and my recommendations to change as the project exposes weaknesses and better evidence becomes available. Engineering the factory includes revising the engineering model itself.

---

### Research and scope

The project observations above come from recorded evaluations and current repository documentation. They do not establish general reliability, productivity gains, or ROI. Other examples remain illustrative design proposals. Benchmarks and older automation research do not validate the factory as a whole. NIST version status reflects the earlier source review, not a new standards check for this revision. Project links point to local evidence and need publishable equivalents before external publication. See [References.md](References.md) for details.
