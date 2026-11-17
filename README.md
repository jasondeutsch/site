# Personal website

The Obsidian vault is the source of truth. Article Markdown is not copied into this repository. `content/articles.json` selects the articles and their publication dates:

```json
{
  "slug": "engineering-the-factory",
  "source": "../../writing/eng/posts/engineering the factory/Draft.md",
  "date": "2026-10-01"
}
```

`source` is resolved relative to the repository root (`site/`), not the config file or current terminal directory. Absolute paths also work locally, but relative paths keep the configuration portable when the vault and website move together. All four current articles are registered in the JSON file. The slug preserves each article URL. Dates are explicit and independent of file timestamps.

## Build from the vault

Requires Node.js 22 or newer. From `site/`:

```sh
npm ci --ignore-scripts
npm run build
```

The build reads each configured draft directly, generates `articles/*.html`, refreshes the homepage titles and dates, and copies referenced images and supporting files into `assets/<slug>/`. Companion `examples/` directories are copied so README links and downloadable source remain usable. Original vault files are never edited.

Source-relative links are resolved from the draft's directory. Legacy `writing/…` links resolve from the vault root. Private absolute citations are displayed as “local source; not public” rather than published as broken links. Missing source files or referenced assets stop the build.

The article template is `templates/article.html`. Markdown headings, lists, tables, fenced code, and details are rendered with Marked. LaTeX equations render to native MathML with KaTeX at build time. Context Article 00 keeps its contents before the introduction and definitions after it.

```sh
npm run render   # regenerate tracked HTML/assets and build record
npm run check    # compare rendered content/assets with the live vault drafts
npm test         # regression tests
npm run build    # render locally and prepare dist/
npm run package  # verify and package generated files without reading the vault
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000 to preview the build. `npm run check` detects changes to the external drafts, titles, or assets. Run it locally where the vault exists.

## Publish

After editing a vault draft:

1. Run `npm run build` locally.
2. Review and commit the generated HTML/assets, homepage, `render-state.json`, and any config changes.
3. Push to the default branch.

GitHub cannot access your local vault. The workflow installs pinned dependencies, runs fixture-based tests, then runs **npm run package**, which verifies the hashes in `render-state.json` and uploads `dist/`. It does not try to render from unavailable local paths. Changes to configuration, templates, CSS, generated pages, or assets without a corresponding local build fail packaging.

A vault-only edit cannot trigger GitHub Actions: you must run the local build and commit its output. `render-state.json` verifies committed build inputs/output; it cannot tell GitHub that an inaccessible vault file has changed.

Select **GitHub Actions** under **Settings → Pages**, with custom domain `jasondeutsch.com`. The repository root is `site/`; the parent workspace's `.github/` is outside this repository.

Only static website files are uploaded. The JSON configuration, build scripts, build record, dependencies, and Git metadata stay out of the deployed site. Newsletter signup submits directly to Mailchimp; professional inquiries open a prepared message in the visitor's email app.
