# Personal website

A buildless, local-first website. All website source and content lives here.

Preview from this directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. No packages, external fonts, trackers, or build step are required.

- `index.html`: homepage
- `styles.css`: shared responsive styles
- `articles/`: readable HTML articles
- `content/`: copied Markdown source from the vault

The sample article is copied verbatim from `writing/eng/posts/ai induced velocity trap/Draft.md` in the Obsidian vault and marked as a draft. The vault original is unchanged. HTML is a static rendering; later Markdown edits must be reflected in the article HTML.

Before publishing, review the draft, review the résumé-based biography, add a contact address, and choose a newsletter provider. The newsletter controls are intentionally disabled and collect nothing until a real subscription endpoint is configured. This site has not been deployed.

## GitHub Pages

This site works as a static GitHub Pages site, including at a project URL such as `https://USERNAME.github.io/REPOSITORY/`. All internal URLs are relative, including article stylesheets and the portrait.

The deployment workflow is at `../.github/workflows/pages.yml`. Keep the current layout when pushing to GitHub: `.github/` and `site/` must be siblings at the repository root. The workflow publishes the contents of `site/`, with `index.html` at the published root. No build or Jekyll processing is needed.

1. Push this project to a GitHub repository.
2. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the source.
3. Under **Actions**, run **Publish website to GitHub Pages** on the default branch, or push a change to `site/` on that branch.
4. The completed deployment shows the published URL in the `github-pages` environment.

Only the default branch can deploy. Subsequent changes under `site/` trigger deployment automatically. This setup does not connect the newsletter; GitHub Pages serves static files, so subscriptions still need an external newsletter service.
