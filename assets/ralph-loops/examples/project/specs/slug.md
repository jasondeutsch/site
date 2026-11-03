# Slug utility

Provide `src/slug.py` with `slug(text: str) -> str`.
Lowercase ASCII uppercase letters. Replace each maximal run of characters
outside ASCII a-z and 0-9 with one hyphen. Remove leading/trailing hyphens.
Do not transliterate Unicode. Raise ValueError if the resulting slug is empty.

Examples:
- "Hello, World!" -> "hello-world"
- "  A___B---C  " -> "a-b-c"
- "café" -> "caf"
- "東京" -> ValueError
- "" -> ValueError

Support `python3 src/slug.py TEXT` with exactly one text argument.
On success, print only the slug followed by a newline and exit 0.
For empty results, print a diagnostic to stderr, print nothing to stdout,
and exit 2. Missing or extra arguments also exit 2.
No third-party dependencies. Importing the module must not run the CLI.
