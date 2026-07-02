#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-4000}"
URL="http://localhost:${PORT}"

if ! command -v bundle >/dev/null 2>&1; then
  echo "bundler is required. Install with: gem install bundler" >&2
  exit 1
fi

if [ ! -d vendor/bundle ]; then
  echo "First run: installing gems into vendor/bundle …"
  bundle config set --local path 'vendor/bundle'
  bundle install
fi

if lsof -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${PORT} is already in use. Set PORT=<n> ./run.sh to choose another." >&2
  exit 1
fi

echo "Serving Jekyll site"
echo "  → ${URL}"

exec bundle exec jekyll serve --port "${PORT}" --livereload
