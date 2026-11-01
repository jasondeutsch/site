# Dependency-update workflow companion

A complete Haskell source example using only `base`. It follows one proposed dependency update through scope validation, revision-bound checks, approval, simulated publication, and timeout reconciliation.

From this directory, with GHC installed:

```sh
runghc -i. Main.hs
```

Or compile and run:

```sh
mkdir -p /tmp/fp-agent-build
ghc -Wall -outputdir /tmp/fp-agent-build -i. Main.hs -o /tmp/fp-agent-workflow
/tmp/fp-agent-workflow
```

No Haskell compiler was available in the authoring environment. The source was reviewed, but neither command has been executed here.

## Files

- [Workflow.hs](Workflow.hs): shared domain types, hidden validated constructors, pure policy decisions, command planning, replay, and lookup-based recovery.
- [Result.hs](Result.hs): the small custom failure-handling monad from the article, including its supporting instances.
- [Main.hs](Main.hs): simulated remote service and scenario assertions. A failing assertion terminates the program; successful execution ends with `All scenario checks passed. No network calls were made.`

## Scenarios

The assertions cover successful authorization; rejected scope; failing tests; evidence for the wrong revision; absent or stale approval; success and short-circuiting for bind; representative identity and associativity cases; a lost response after remote creation; lookup-based recovery without a second create; unresolved and failed lookups; and a confirmation for the wrong operation.

The monad-law cases illustrate expected behavior for selected inputs. They are not a proof for every value.

## Deliberate boundaries

The proposal carries the revision of an already applied dependency update. Applying source changes and generating that revision are outside this demonstration. Tests and security checks arrive as supplied reports; in production a trusted runner must bind those observations to an immutable revision. Approval is a fixed snapshot; expiration, revocation, identity, and live authorization checks are omitted.

The simulated remote service stores one result in an `IORef` and can return an unknown outcome after creation. It is single-threaded and in-memory. Its lookup/create sequence is not atomic and must not be used as a concurrent idempotency implementation. Remote request deduplication and durable history are separate production responsibilities.

The article's `async` illustration is not required by this companion. It contrasts independent checks with dependent decisions; the companion focuses on their recorded results.
