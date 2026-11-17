# Agentic and generative AI application architectures

I’m writing this series over time to examine how generative and agentic AI applications are designed and operated. The articles follow the decisions around models and data, then tools, execution, and the systems needed to run them in production.

I’ll draw mainly on corporate engineering accounts and academic papers, comparing implementation choices, failure modes, and operating costs. The contents below give the series a direction; the articles will develop as I work through the questions. There is no fixed publication schedule.

Each article focuses on a particular problem and can be read on its own. The sequence connects related decisions, with worked application designs bringing several of them together.

## Architecture decisions

1. [The architecture of a generative AI application](00%20the-architecture-of-a-generative-ai-application/Draft.md)

   Why model quality alone cannot establish application correctness, and where the surrounding software takes responsibility.

2. [Start with the workload and its constraints](01%20start-with-the-workload-and-its-constraints/Draft.md)

   Defining useful outcomes, workload distributions, and the failures the application must handle.

3. [Choose between a model call, a workflow, and an agent](02%20choose-between-a-model-call-a-workflow-and-an-agent/Draft.md)

   Choosing where control flow belongs and deciding how much discretion a model needs.

4. [Draw the boundaries and contracts](03%20draw-the-boundaries-and-contracts/Draft.md)

   Component ownership, interface contracts, and the cost of turning a logical boundary into a service.

5. [Establish evaluation and threat models before implementation](04%20establish-evaluation-and-threat-models-before-implementation/Draft.md)

   Defining acceptable behavior and security boundaries before implementation makes them expensive to change.

## Models and inference

6. [Make model calls a dependable application interface](05%20make-model-calls-a-dependable-application-interface/Draft.md)

   Structured outputs, semantic validation, and typed failure paths around model responses.

7. [Select models and decide when to adapt them](06%20select-models-and-decide-when-to-adapt-them/Draft.md)

   Diagnosing whether a failure calls for better evidence, a different model, or adaptation.

8. [Build a model gateway and routing layer](07%20build-a-model-gateway-and-routing-layer/Draft.md)

   Routing, capability compatibility, quotas, and the responsibilities of a shared model gateway.

9. [Choose hosted inference or operate your own serving stack](08%20choose-hosted-inference-or-operate-your-own-serving-stack/Draft.md)

   Capacity, utilization, operational responsibility, and the economics of operating inference.

10. [Design caching and inference efficiency without changing meaning](09%20design-caching-and-inference-efficiency-without-changing-meaning/Draft.md)

   What can be reused safely, how cache entries become stale, and where permission checks still belong.

## Data, evidence, and state

11. [Build the data ingestion and document processing plane](10%20build-the-data-ingestion-and-document-processing-plane/Draft.md)

   Preserving document structure, provenance, permissions, and source changes through ingestion.

12. [Design retrieval as a search system](11%20design-retrieval-as-a-search-system/Draft.md)

   Candidate generation, hybrid retrieval, reranking, and relevance evaluation.

13. [Generate answers that remain grounded in evidence](12%20generate-answers-that-remain-grounded-in-evidence/Draft.md)

   Connecting claims to evidence, handling contradictions, and knowing when to abstain.

14. [Know when to use graph, iterative, or structured retrieval](13%20know-when-to-use-graph-iterative-or-structured-retrieval/Draft.md)

   Choosing retrieval architecture for local lookup, corpus-wide synthesis, and structured computation.

15. [Compile context for each invocation](14%20compile-context-for-each-invocation/Draft.md)

   Selecting information for each model invocation without losing decision-critical constraints.

16. [Separate task state, conversation, memory, and knowledge](15%20separate-task-state-conversation-memory-and-knowledge/Draft.md)

   Giving persistent information distinct write, correction, and validity rules.

## Tools and execution

17. [Design tools as constrained application capabilities](16%20design-tools-as-constrained-application-capabilities/Draft.md)

   Exposing useful business capabilities without granting unnecessary authority.

18. [Connect tools and agents through explicit protocols](17%20connect-tools-and-agents-through-explicit-protocols/Draft.md)

   What MCP and agent-to-agent protocols standardize, and what remains an application responsibility.

19. [Build bounded agent loops and planning mechanisms](18%20build-bounded-agent-loops-and-planning-mechanisms/Draft.md)

   Planning, observation, validation, and stopping conditions in an agent loop.

20. [Make long-running execution durable](19%20make-longrunning-execution-durable/Draft.md)

   Keeping task progress recoverable across worker crashes and long waits.

21. [Make external actions safe under retries and concurrency](20%20make-external-actions-safe-under-retries-and-concurrency/Draft.md)

   Idempotency, reconciliation, and explicit uncertainty after external operations.

22. [Use multiple agents only when decomposition earns its cost](21%20use-multiple-agents-only-when-decomposition-earns-its-cost/Draft.md)

   When independent workers help, how their results are integrated, and what coordination costs.

23. [Integrate agents with events, queues, and business processes](22%20integrate-agents-with-events-queues-and-business-processes/Draft.md)

   Duplicates, ordering, backpressure, and the business meaning of an event-driven trigger.

## Interfaces and application patterns

24. [Design conversational and collaborative application interfaces](23%20design-conversational-and-collaborative-application-interfaces/Draft.md)

   Streaming, reconnects, cancellation, and artifacts that outlive a chat session.

25. [Make human review part of the execution model](24%20make-human-review-part-of-the-execution-model/Draft.md)

   Approval scope, reviewer workload, escalation, and the action a person actually authorized.

26. [Architect multimodal, document, and media workflows](25%20architect-multimodal-document-and-media-workflows/Draft.md)

   Preserving meaning and provenance as documents, images, audio, and video change representation.

27. [Build realtime voice applications](26%20build-realtime-voice-applications/Draft.md)

   Turn detection, interruption, playback, and business effects in a voice interface.

28. [Run coding, browser, and computer-use agents in controlled environments](27%20run-coding-browser-and-computeruse-agents-in-controlled-environments/Draft.md)

   Sandboxing, credential boundaries, stale observations, and verification in executable environments.

## Evaluation, security, and governance

29. [Evaluate complete trajectories and business outcomes](28%20evaluate-complete-trajectories-and-business-outcomes/Draft.md)

   Measuring task outcomes, grounding, prohibited effects, and uncertainty across repeated runs.

30. [Observe and debug the system across every boundary](29%20observe-and-debug-the-system-across-every-boundary/Draft.md)

   The records needed to explain an outcome across retrieval, inference, tools, and delivery.

31. [Secure the full application and agent supply chain](30%20secure-the-full-application-and-agent-supply-chain/Draft.md)

   Containing injection, poisoning, exfiltration, and supply-chain threats at runtime boundaries.

32. [Enforce identity, tenant isolation, privacy, and governance](31%20enforce-identity-tenant-isolation-privacy-and-governance/Draft.md)

   Carrying authority across delegation and enforcing isolation throughout the information lifecycle.

## Running applications in production

33. [Engineer reliability and graceful degradation](32%20engineer-reliability-and-graceful-degradation/Draft.md)

   Deadlines, dependency failure, compatible fallbacks, and bounded degradation.

34. [Model latency, capacity, and cost per successful task](33%20model-latency-capacity-and-cost-per-successful-task/Draft.md)

   Accounting for the complete work graph, including retries, review, and discarded work.

35. [Version and release the complete behavioral system](34%20version-and-release-the-complete-behavioral-system/Draft.md)

   Versioning prompts, models, tools, policies, and data alongside application code.

36. [Build a shared AI platform with clear ownership](35%20build-a-shared-ai-platform-with-clear-ownership/Draft.md)

   What belongs in shared infrastructure and what product teams still need to own.

37. [Operate and evolve the system after launch](36%20operate-and-evolve-the-system-after-launch/Draft.md)

   Investigating behavioral incidents, responding to feedback, and turning failures into regressions.

## Putting the architecture together

38. [Case study: permission-aware enterprise search and knowledge assistance](37%20case-study-permissionaware-enterprise-search-and-knowledge-assistance/Draft.md)

   A worked design connecting ingestion, access control, retrieval, grounding, and answer delivery.

39. [Case study: a support and operations agent that can act](38%20case-study-a-support-and-operations-agent-that-can-act/Draft.md)

   A worked support design that separates investigation, approval, commitment, and reconciliation.

40. [Case study: a research and software-work agent](39%20case-study-a-research-and-softwarework-agent/Draft.md)

   A worked design for evidence gathering, isolated repository work, and reviewable artifacts.

41. [How an AI application architecture changes when its assumptions change](40%20architecture-under-changing-requirements/Draft.md)

   Revisiting a voice-and-document scheduling service under load, provider, budget, and residency changes.

## Further reading

[Sources](Sources.md) · [Glossary](Glossary.md)
