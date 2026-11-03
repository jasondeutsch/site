# Build a Ralph controller with pi

This directory accompanies [the article](../Draft.md). The starter is intentionally incomplete. Nothing here installs pi, invokes a model, commits source, or deploys automatically.

## Requirements

- Python 3.11+ on macOS or Linux. The controller uses POSIX process groups and `fcntl.flock`.
- For a live run: Node.js 22.19+, pi installed, and a configured model provider.
- For offline tests: only Python's standard library. No model account or third-party Python packages.

## Offline verification

From this directory:

```bash
python3 -m unittest discover -s . -p 'test_*.py' -v
```

The suite uses temporary project copies, real subprocesses, and fake agent programs. It never modifies the supplied starter. The fake success agent writes a known implementation; this tests orchestration, not model skill.

## Run with pi

Install and authenticate pi in your own environment. The article uses this upstream manifest version:

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent@1.5.0
pi
```

After provider setup, exit the interactive session, then:

```bash
python3 make_config.py
python3 ralph.py \
  --project ./project \
  --config ./tasks.json \
  --state /tmp/ralph-slug-state \
  --max-iterations 12 \
  --agent-timeout 300 \
  --check-timeout 30 \
  --wall-seconds 3600
```

Use a fresh state directory for a new experiment. Keep the same state directory to resume. The configuration generator writes absolute paths to the verifier and active Python executable; regenerate it after moving the files or changing environments. A changed configuration requires a new state directory.

The default agent argv disables implicit extensions, skills, templates, and context-file discovery for this exercise. It enables read, bash, edit, and write. It sends the prompt on stdin and creates a fresh non-persisted conversation on each invocation.

To choose a model, copy the default argv from `ralph.py`, append `--model` and your exact configured model ID, and supply the full JSON argv through `--agent-json`. This option replaces the entire default command; it does not append to it.

## Acceptance checks by hand

These commands fail against the untouched starter. That is intentional:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 acceptance.py ./project normalize
PYTHONDONTWRITEBYTECODE=1 python3 acceptance.py ./project reject-empty
PYTHONDONTWRITEBYTECODE=1 python3 acceptance.py ./project cli
```

The controller sets `PYTHONDONTWRITEBYTECODE=1` itself. `normalize` checks ASCII-only lowercasing, separators, and selected Unicode edge cases. `reject-empty` checks ValueError. `cli` checks output streams, exit status, and argument count. The controller checks tasks in that order and chooses the first failure, rechecking earlier behavior on every iteration.

## State and stopping semantics

- `state.json` records the project/config identity, consumed attempts, stagnation count, current phase, last task, and file-content fingerprint.
- An attempt is consumed **before** the agent starts. A crash cannot make it free on restart.
- `--max-iterations` is the total attempt cap for that state directory.
- `--wall-seconds` applies to one controller invocation. Restarting begins a new wall-time allowance, while the attempt count persists.
- Each check has its own timeout, capped by the remaining invocation wall time.
- Three unchanged candidates in succession trigger the default stagnation stop. Any content change resets this heuristic.
- All checks are rerun on restart, including after a saved success.
- The controller lock is advisory and applies to cooperating invocations of the same project path.
- Exit 0 means all required checks passed on unchanged project contents. Exit 2 means stop and inspect stderr and logs.
- A saved phase can reflect an interrupted operation. Revalidation, rather than that phase field, determines what happens next.
- `attempt-0000` contains verification before the first agent attempt. Each successful return from an agent leads to the next verification directory.
- Repeated startup verification without a new attempt can overwrite that attempt directory's check logs. Use immutable run/event storage if retaining every observation is required.

The controller intentionally leaves `.ralph-controller.lock` in the project. It excludes the file from fingerprints. No source rollback occurs on failure; inspect partial edits and logs before resuming.

## Scope and limitations

This is an educational local controller for cooperative code:

- The agent inherits the host user's access and environment. Sibling directories are not a security boundary.
- Acceptance imports and runs candidate code. Run hostile candidates only in an isolated verification worker.
- No container, network filter, credential stripping, CPU/memory/disk quota, or provider spend cap is implemented.
- Process-group termination covers ordinary child processes, not intentionally detached daemons.
- File-content identity excludes `.git`, `__pycache__`, `.venv`, and the lock file. It does not cover mode bits, dependency binaries, the environment, or the interpreter.
- Candidate symlinks are rejected for operator review; the fingerprint is not a hardened filesystem traversal protocol.
- Atomic state-file replacement includes a file fsync, not directory fsync or database transactions.
- Task definitions are hashed at startup; the controller and verifier are assumed stable during a run.
- Nonzero agent exits and verifier timeouts stop. Behavioral check failures feed another attempt. There is no typed blocked result or detailed infrastructure-error taxonomy.
- There is no provider token accounting, transcript/event parser, dependency DAG, cached verification, or automatic commit/merge/deployment step.
- A bounded model call may still cost money. Offline tests make no provider calls.

## What was verified

The article preparation checked local pi 1.0.3's help output for the used flags. Upstream documentation and the upstream 1.5.0 package manifest were inspected on November 3, 2026. The controller suite ran offline. A live paid-model end-to-end run was not performed, and the SDK sketch is illustrative rather than independently compiled here.
