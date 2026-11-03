"""Offline integration tests: fake agents, real subprocesses and acceptance checks."""
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent
CORRECT = '''import re
import sys

def slug(text):
    result = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    if not result:
        raise ValueError("empty slug")
    return result

if __name__ == "__main__":
    try:
        if len(sys.argv) != 2:
            raise ValueError("expected one text argument")
        print(slug(sys.argv[1]))
    except ValueError as error:
        print(str(error), file=sys.stderr)
        sys.exit(2)
'''
# Avoid Unicode case folding adding ASCII letters outside the contract.
CORRECT = CORRECT.replace('text.lower()', 'text.translate(str.maketrans("ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"))')


class ControllerTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.project = self.root / 'project'
        shutil.copytree(ROOT / 'project', self.project,
                        ignore=shutil.ignore_patterns('__pycache__', '.ralph-controller.lock'))
        self.config = self.root / 'tasks.json'
        self.config.write_text(json.dumps({
            'contract': (self.project / 'specs/slug.md').read_text(),
            'tasks': [{'id': name, 'goal': name, 'check': [sys.executable,
                       str(ROOT / 'acceptance.py'), '{project}', name]}
                      for name in ['normalize', 'reject-empty', 'cli']],
        }))
        self.agent = self.root / 'agent.py'
        self.state = self.root / 'state'

    def execute(self, *extra):
        return subprocess.run([
            sys.executable, str(ROOT / 'ralph.py'), '--project', str(self.project),
            '--config', str(self.config), '--state', str(self.state),
            '--agent-json', json.dumps([sys.executable, str(self.agent)]), *extra,
        ], capture_output=True, text=True, timeout=15)

    def fake(self, body):
        self.agent.write_text('import sys\nfrom pathlib import Path\nprompt = sys.stdin.read()\n' + body)

    def test_completion_and_resume_reverification(self):
        self.fake(f'Path("src/slug.py").write_text({CORRECT!r})\n')
        result = self.execute()
        self.assertEqual(result.returncode, 0, result.stderr)
        saved = json.loads((self.state / 'state.json').read_text())
        self.assertEqual(saved['iterations'], 1)
        self.assertEqual(saved['status'], 'complete')
        # A previously complete state cannot bypass a regression on restart.
        (self.project / 'src/slug.py').write_text('def slug(text): return "broken"\n')
        self.fake('print("DONE")\n')
        result = self.execute('--max-iterations', '1')
        self.assertEqual(result.returncode, 2)
        self.assertIn('Iteration budget exhausted', result.stderr)

    def test_ordered_tasks_with_fresh_agent_processes(self):
        normalizer = CORRECT.split('if __name__')[0].replace(
            '    if not result:\n        raise ValueError("empty slug")\n', '')
        function_only = CORRECT.split('if __name__')[0]
        self.fake(
            f'if "Task ID: normalize" in prompt:\n'
            f'    Path("src/slug.py").write_text({normalizer!r})\n'
            f'elif "Task ID: reject-empty" in prompt:\n'
            f'    Path("src/slug.py").write_text({function_only!r})\n'
            f'elif "Task ID: cli" in prompt:\n'
            f'    Path("src/slug.py").write_text({CORRECT!r})\n')
        result = self.execute()
        self.assertEqual(result.returncode, 0, result.stderr)
        saved = json.loads((self.state / 'state.json').read_text())
        self.assertEqual(saved['iterations'], 3)
        for number, name in enumerate(['normalize', 'reject-empty', 'cli']):
            prompt = (self.state / f'attempt-{number:04d}/prompt.md').read_text()
            self.assertIn(f'Task ID: {name}', prompt)

    def test_timeout_still_consumes_attempt_on_restart(self):
        self.fake('import time\ntime.sleep(10)\n')
        self.assertEqual(self.execute('--agent-timeout', '0.1').returncode, 2)
        self.fake(f'Path("src/slug.py").write_text({CORRECT!r})\n')
        result = self.execute('--max-iterations', '1')
        self.assertEqual(result.returncode, 2)
        self.assertIn('Iteration budget exhausted', result.stderr)
        saved = json.loads((self.state / 'state.json').read_text())
        self.assertEqual(saved['iterations'], 1)
        self.assertNotEqual(saved['status'], 'complete')

    def test_verifier_timeout_stops_before_agent(self):
        check = self.root / 'slow-check.py'
        check.write_text('import time\ntime.sleep(10)\n')
        self.config.write_text(json.dumps({'contract': '', 'tasks': [{
            'id': 'slow', 'goal': 'slow', 'check': [sys.executable, str(check)]}]}))
        self.fake('raise AssertionError("must not run")\n')
        result = self.execute('--check-timeout', '0.1')
        self.assertEqual(result.returncode, 2)
        self.assertIn('TimeoutExpired', result.stderr)
        self.assertFalse((self.state / 'attempt-0000/agent.log').exists())

    def test_import_exit_zero_is_not_a_passing_check(self):
        self.fake('Path("src/slug.py").write_text("import sys\\nsys.exit(0)\\n")\n')
        result = self.execute('--max-iterations', '1')
        self.assertEqual(result.returncode, 2)
        feedback = (self.state / 'attempt-0001/check-normalize.log').read_text()
        self.assertIn('Importing the module must not exit', feedback)

    def test_noisy_import_is_not_accepted(self):
        self.fake(f'Path("src/slug.py").write_text({(CORRECT + chr(10) + "print(123)" + chr(10))!r})\n')
        result = self.execute('--max-iterations', '1')
        self.assertEqual(result.returncode, 2)
        feedback = (self.state / 'attempt-0001/check-normalize.log').read_text()
        self.assertIn('Importing the module must not print', feedback)

    def test_false_completion_stagnates(self):
        self.fake('print("<promise>COMPLETE</promise>")\n')
        result = self.execute('--stagnation-limit', '2')
        self.assertEqual(result.returncode, 2)
        self.assertIn('No artifact change', result.stderr)
        self.assertEqual(json.loads((self.state / 'state.json').read_text())['iterations'], 2)

    def test_agent_error_stops(self):
        self.fake('sys.exit(7)\n')
        result = self.execute()
        self.assertEqual(result.returncode, 2)
        self.assertIn('Agent exited 7', result.stderr)

    def test_agent_timeout_stops(self):
        self.fake('import time\ntime.sleep(10)\n')
        result = self.execute('--agent-timeout', '0.1')
        self.assertEqual(result.returncode, 2)
        self.assertIn('TimeoutExpired', result.stderr)

    def test_config_change_rejected(self):
        self.fake(f'Path("src/slug.py").write_text({CORRECT!r})\n')
        self.assertEqual(self.execute().returncode, 0)
        self.config.write_text(self.config.read_text() + '\n')
        result = self.execute()
        self.assertEqual(result.returncode, 2)
        self.assertIn('Project/config changed', result.stderr)

    def test_mutating_verifier_stops(self):
        check = self.root / 'mutate.py'
        check.write_text('from pathlib import Path\nPath("oops").write_text("changed")\n')
        self.config.write_text(json.dumps({'contract': '', 'tasks': [{
            'id': 'bad', 'goal': 'bad', 'check': [sys.executable, str(check)]}]}))
        self.fake('print("unused")\n')
        result = self.execute()
        self.assertEqual(result.returncode, 2)
        self.assertIn('Verification changed project files', result.stderr)

    def test_lock_blocks_second_controller(self):
        import fcntl
        self.fake('print("unused")\n')
        with (self.project / '.ralph-controller.lock').open('a') as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            result = self.execute()
            self.assertEqual(result.returncode, 2)
            self.assertIn('Another controller', result.stderr)

    def test_failed_check_becomes_next_prompt_feedback(self):
        self.fake('assert "NotImplementedError" in prompt\nprint("No edit")\n')
        result = self.execute('--max-iterations', '1')
        self.assertIn('Iteration budget exhausted', result.stderr)
        self.assertIn('NotImplementedError', (self.state / 'attempt-0000/prompt.md').read_text())


if __name__ == '__main__':
    unittest.main()
