#!/usr/bin/env python3
"""External acceptance probe. Usage: acceptance.py PROJECT TASK."""
import importlib.util
import contextlib
import io
from pathlib import Path
import subprocess
import sys

project = Path(sys.argv[1]).resolve()
task = sys.argv[2]
path = project / 'src' / 'slug.py'
spec = importlib.util.spec_from_file_location('candidate_slug', path)
module = importlib.util.module_from_spec(spec)
import_stdout, import_stderr = io.StringIO(), io.StringIO()
try:
    with contextlib.redirect_stdout(import_stdout), contextlib.redirect_stderr(import_stderr):
        spec.loader.exec_module(module)
except SystemExit as error:
    raise AssertionError("Importing the module must not exit the process") from error
if import_stdout.getvalue() or import_stderr.getvalue():
    raise AssertionError("Importing the module must not print output")


def equal(actual, expected):
    if actual != expected:
        raise AssertionError(f'expected {expected!r}, got {actual!r}')


if task == 'normalize':
    for text, wanted in [('Hello, World!', 'hello-world'),
                         ('  A___B---C  ', 'a-b-c'), ('abc123', 'abc123'),
                         ('café', 'caf'), ('ABC', 'abc'), ('İ ABC', 'abc')]:
        equal(module.slug(text), wanted)
elif task == 'reject-empty':
    for text in ['', '!!!', '東京', '   ', 'K']:
        try:
            module.slug(text)
        except ValueError:
            pass
        else:
            raise AssertionError(f'{text!r} must raise ValueError')
elif task == 'cli':
    for argv, code, output in [(['Hello, World!'], 0, 'hello-world\n'),
                               (['!!!'], 2, ''), ([], 2, ''),
                               (['one', 'two'], 2, '')]:
        result = subprocess.run([sys.executable, str(path), *argv],
                                capture_output=True, text=True, timeout=5)
        equal(result.returncode, code)
        equal(result.stdout, output)
        if code == 2 and not result.stderr:
            raise AssertionError('Expected diagnostic on stderr')
else:
    raise ValueError(f'Unknown task: {task}')
print(f'PASS {task}')
