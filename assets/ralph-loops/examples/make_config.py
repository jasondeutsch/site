"""Write absolute argv paths for the external verifier."""
import json
from pathlib import Path
import sys

root = Path(__file__).resolve().parent
config = {
    'contract': (root / 'project/specs/slug.md').read_text(),
    'tasks': [
        {'id': key, 'goal': goal,
         'check': [sys.executable, str(root / 'acceptance.py'), '{project}', key]}
        for key, goal in [
            ('normalize', 'Implement ASCII normalization and separator collapse'),
            ('reject-empty', 'Raise ValueError when normalization yields no characters'),
            ('cli', 'Implement the command-line interface and its exit/output contract'),
        ]
    ],
}
(root / 'tasks.json').write_text(json.dumps(config, indent=2) + '\n')
print(root / 'tasks.json')
