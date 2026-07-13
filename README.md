# ductm104.github.io

Personal site + a few static browser tools, built with Jekyll and deployed to
GitHub Pages via [.github/workflows/pages.yml](.github/workflows/pages.yml).

## Local development

```bash
./install.sh   # one-time: installs Bundler + Jekyll gems into .bundle/
./run.sh       # serves at http://localhost:4000 with live reload
```

`install.sh` generates a local-only `Gemfile.local` / `.bundle/_config.local.yml`
with Ruby-compatibility overrides so the site builds on modern Ruby. Neither is
committed. Override the port with `PORT=<n> ./run.sh`.

## Layout

- `index.md`, `about.md`, `tools.md` — top-level pages
- `_posts/` — blog posts (`YEAR-MONTH-DAY-title.md`)
- `_includes/`, `_layouts/`, `assets/main.scss` — theme overrides (minima)
- `pdf-tool/`, `yt-tcp/` — self-contained static tools linked from `tools.md`
