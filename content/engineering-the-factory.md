# Why I'm building a software factory

Jason Deutsch

I'm building a software factory because I believe in the simple idea of abstraction leading to greater capability.

Throughout the history of software development, and technology in general, we have used tools that simplify our current work. Faster compilers, IntelliSense, and Stack Overflow are examples. When something new makes the work faster or more efficient, we use it to take on more complicated work.

Kubernetes, for all its complexities, provides an abstraction for managing applications across a cluster of machines. Along with its ecosystem of tools, it allows teams to manage complex deployments in a simpler and more effective way than coordinating each part themselves. Abstracting the data center made managing complex software at scale simpler, so we built more complex software.

So I'm exploring software factories professionally. Often, the best way to learn is to try something, run into challenges, learn what the wrong way is, and identify a way forward. The argument for getting professional experience before an MBA makes sense to me for a similar reason. Experience gives the discussion context.

## Key points

- I am exploring whether abstraction can let engineers take on more complicated work.
- Getting the boundaries between components right has been the biggest design challenge.
- I am developing a common volume for task files, separate from the delivered code.
- Deterministic workflow execution and an inbox system support the agents and human participation.
- The evaluation results leave specific verification and cost questions open.

## Keeping the parts decoupled

For this project, getting the abstractions between steps right was everything. One of my design goals is to keep each part componentized and decoupled. The biggest challenge has been finding the right way to design the agents for that, together with the gating and communication primitives that connect the steps.

The abstraction I am exploring covers the work between an engineering request and an accepted change. It includes turning the request into a usable specification and plan, supplying context, and deciding how the result will be checked. I still need to understand the implementation well enough to investigate failures in any of those steps.

My controller owns workflow routes and accepted outcomes. Agent packages supply the behavior used within those steps. [Controller documentation](</Users/j/pragma/controls/README.md>) · [Registry documentation](</Users/j/pragma/registry/README.md>)

## A common source for task files

This is still in progress. I'm looking at a “bag of data” or “bag of context” approach where certain artifacts move through the workflow. Right now, that is represented as a volume. The focus has become a common source for task files and how agents get access to them.

The factory produces specifications, plans, and task steps as it works. These task files are separate from the code being delivered. They give the agents material to work from as the task moves through the factory.

I'm moving toward a model where each agent is deterministically given the location and access it needs. That gives me more flexibility than designing an agent to expect a specific absolute path, URL, or file.

## Execution and communication

Workflow execution is handled deterministically. I organize the workflow into stages made up of steps. Those steps can run sequentially or concurrently.

For communication, I created an inbox system inspired by the actor model. It lets me address each agent individually or broadcast messages. This works for communication between agents and for human participation in the workflow.

The current controller documentation says a package completes a step through an accepted MCP `step_result` message. Process exit, an idle turn, or a prose claim of completion cannot advance it.

A completed step may establish that documents were submitted or that a reviewer returned findings. Product acceptance requires its own checks.

## Learning from the runs

The evaluation task adds optional `Idempotency-Key` support to `POST /tasks` in a small Go service. Repeating a valid request with the same key and body should return the original response without creating another task. The brief also requires preserving the existing Go version unless a change is necessary and a human approves. [GO-001 brief](</Users/j/pragma/evals/scenario/brief.md>)

On November 1, my factory marked the workflow complete. The separate grader passed all ten acceptance cases, then failed the result on `go vet`.

The saved diagnostic identified four uses of an API requiring Go 1.25 or later. The module declared Go 1.22. The workflow had reached its completed state, including review and approval, while the grader still had a reason to reject the candidate. [November 1 result](</Users/j/pragma/evals/runs/GO-001-20261101T211413927528Z-bee829/result.json>) · [Saved vet diagnostic](</Users/j/pragma/evals/runs/GO-001-20261101T211413927528Z-bee829/vet.stderr>)

I have to decide when a check can veto completion and what happens after that veto. Repairing the code creates another candidate, which needs fresh evidence tied to its revision.

The November 14 design review recorded a correction from `go test taskapi_test.go` to `go test .`. The original command omitted the source package definitions the test file depended on. The reviewer reported checking that the corrected command worked. That was useful design-stage evidence, with the later implementation still needing its own checks. [Architecture review](</Users/j/pragma/evals/.factory/executions/3141aac4-34cd-40d5-8436-f2552bfc6dfd/files/reviews/architecture.md>)

The November 14 workflow also completed, but independent product grading was recorded as unavailable. Its newer evaluation protocol uses Factory's public interface, which does not expose the required acceptance operation. The earlier runs used a local grader. Those results cannot be pooled as if they measured the same thing. [November 14 result](</Users/j/pragma/evals/runs/GO-001-20261114T202629280058Z-578ee3/result.json>) · [Evaluation protocol](</Users/j/pragma/evals/README.md>)

## What I want to find out

I want to find out whether this abstraction makes subsequent changes easier to specify, verify, and maintain, and whether it lets me take on more complicated work.

The collected results leave dollar cost unknown. Their token totals span different input variants and evaluation protocols, so I cannot use them to establish an efficiency gain. Even a complete model bill would leave the time spent specifying and reviewing work, repairing failures, and maintaining the factory to account for. [Recorded costs and limits](Supporting%20notes.md#resource-accounting)

A recurring failure might justify better context or a tool change. It might belong in an acceptance test. Each proposed improvement needs representative tasks that show whether it helps and whether it damages other work.

I expect the boundary of what I can delegate to change as the project develops. The current evaluation leaves me with a specific interface to build: a supported independent acceptance check whose result identifies the candidate revision. The November 14 run cannot supply that evidence.

### Research and scope

This is an ongoing project. The common-volume design is still in progress. The evaluation records support the specific observations above; they do not establish general reliability, productivity gains, or ROI. Reviewer findings remain attributed assessments. No new factory run or product test was performed for this revision.

[Supporting notes](Supporting%20notes.md) retain the detailed evaluation records, technical discussion, and conceptual figures. [References](References.md) record source-review limits. Local project links need reviewed public equivalents before external publication.
