# Start with the workload and its constraints

*Agentic and generative AI application architectures · Part 2*

[Previous article](../00%20the-architecture-of-a-generative-ai-application/Draft.md) · [All articles](../Series%20index.md) · [Next article](../02%20choose-between-a-model-call-a-workflow-and-an-agent/Draft.md)

An internal knowledge assistant might work well in a demo built from public documents. Production adds private workspaces and regional data restrictions. Documents can be deleted; traffic can surge on Monday morning. Good retrieval in the demo answers only part of that workload.

Write those conditions into a workload brief before choosing the architecture. Describe who asks for what, which data they may use, and what counts as a successful result. Include the effects the application may cause.

## Define tasks at the outcome boundary

“Answer questions” is too broad to evaluate. A more useful task is: an authorized employee asks which policy governs an expense, receives supported statements with accessible citations, and can identify when the evidence is insufficient.

For an action service, include the resulting business state. “Handle a refund” should specify eligible orders, amount limits, required checks, duplicate-request behavior, and what happens when the payment system returns an uncertain result.

Use a task record such as this example task record:

```yaml
task_kind: expense_policy_question
actor: authenticated_employee
inputs: [question, workspace_scope]
required_outcome: supported_answer_or_explicit_abstention
forbidden_outcomes: [cross_workspace_disclosure, fabricated_citation]
freshness_class: current_policy
interaction: synchronous_with_optional_background_followup
```

This record makes requirements review concrete. Product, security, and engineering can challenge the same fields before anyone turns them into an executable API contract.

## Describe request distributions

Record input sizes, output sizes, languages, attachment types, retrieval depth, and expected tool calls. Separate short lookup requests from broad synthesis and long-running work. Document arrival patterns and concurrency, including scheduled spikes and reconnects after outages.

A few very large documents can dominate token consumption, while rare tool-dependent requests determine tail latency. An average hides both. Record percentiles and plausible worst cases, marking measured values separately from estimates.

Google’s SRE guidance connects service objectives to indicators that reflect user experience. [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) For a generative application, measure operational availability and task quality separately.

| Requirement | Candidate indicator | Design implication |
| --- | --- | --- |
| Useful answer arrives promptly | Time to supported final answer | Retrieval and generation share a deadline |
| Private evidence stays private | Unauthorized evidence exposure | Permission checks across retrieval and caches |
| Job survives interruption | Recoverable task completion | Durable run state and resumable clients |
| Automation is economical | Cost per accepted task | Include retries, tools, evaluation, and review |

Do not announce numeric targets until the team has agreed on their meaning and feasibility. A latency target measured from first token can hide a slow or unsuccessful task.

## Classify consequences separately from complexity

A difficult summarization task may have no external effects. A simple account-status update can be consequential. Give each task an effect class: read-only, artifact creation, reversible business mutation, or difficult-to-reverse action. Define who can authorize escalation between classes.

That classification determines the need for previews, approval, reconciliation, and stronger authentication. It also limits fallback behavior. A degraded model may be acceptable for a draft summary but unsuitable for interpreting a payment instruction.

## Compare an ordinary software baseline

A deterministic search interface, rules engine, template, or human work queue may satisfy the requirement. Establish its quality and cost before arguing for more autonomy. The baseline is also a possible degraded mode when model services fail.

GitHub’s production evaluation account illustrates why task-representative error analysis matters beyond a clean benchmark. [GitHub Engineering: How to evaluate LLMs before production](https://github.blog/ai-and-ml/llms/how-to-evaluate-llms-before-production/) Apply that lesson by including ambiguous requests, missing context, and negative examples in the workload specification.

## Make uncertainty reviewable

Create an assumption register. For each unknown, record its architectural sensitivity and the cheapest experiment that can resolve it. If data residency excludes a provider, that uncertainty is more consequential than the exact token cost of a prompt.

Review the assumptions most likely to invalidate the design. Tenfold traffic could require admission control. Stricter deletion rules could force synchronous access checks, while broader action authority could require a separate approval path.

Another engineer should be able to use the brief to challenge your design. Before implementation, define a successful task and the outcomes you must prevent. Specify when the service may refuse work.

## References

- [Service Level Objectives](https://sre.google/sre-book/service-level-objectives/), Google SRE. Engineering book. User-oriented service indicators. Application outcomes require additional task-specific indicators.
- [How to evaluate LLMs before production](https://github.blog/ai-and-ml/llms/how-to-evaluate-llms-before-production/), GitHub Engineering. Production engineering account. Representative evaluation and error analysis. Secret-scanning workload; not every agent application.
- [Demystifying evals for AI agents](https://www.anthropic.com/research/demystifying-evals-for-ai-agents), Anthropic. Engineering methodology. Task environments, graders, and outcome evaluation. Evaluation guidance requires task-specific calibration.
