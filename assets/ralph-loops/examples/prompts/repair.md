Task: repair CLI argument-count handling.

Observed failure:
python3 src/slug.py one two
Expected: exit 2, empty stdout, diagnostic on stderr.
Observed: exit 0, stdout "one-two\n".

The specification requires exactly one text argument.
Do not change that requirement or join positional arguments.
Inspect the argument parser and add a regression test.
Preserve all previously passing normalization behavior.
