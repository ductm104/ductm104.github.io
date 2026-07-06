#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-4000}"
HOST="${HOST:-0.0.0.0}"
LIVERELOAD_PORT="${LIVERELOAD_PORT:-35729}"
FORCE_POLLING="${FORCE_POLLING:-false}"
URL_HOST="${URL_HOST:-localhost}"
URL="http://${URL_HOST}:${PORT}"
CONFIG_FILES="_config.yml"

if [ -f .bundle/_config.local.yml ]; then
  CONFIG_FILES="${CONFIG_FILES},.bundle/_config.local.yml"
fi

if ! command -v bundle >/dev/null 2>&1; then
  echo "bundler is required. Install with: gem install bundler" >&2
  exit 1
fi

if [ ! -d vendor/bundle ]; then
  echo "First run: installing gems into vendor/bundle …"
  bundle config set --local path 'vendor/bundle'
  bundle install
fi

port_available() {
  ruby -rsocket -e 'TCPServer.new(ARGV[0], ARGV[1].to_i).close' "$1" "$2" >/dev/null 2>&1
}

if ! port_available "${HOST}" "${PORT}"; then
  echo "Port ${PORT} is already in use. Set PORT=<n> ./run.sh to choose another." >&2
  exit 1
fi

if ! port_available "${HOST}" "${LIVERELOAD_PORT}"; then
  echo "LiveReload port ${LIVERELOAD_PORT} is already in use. Set LIVERELOAD_PORT=<n> ./run.sh to choose another." >&2
  exit 1
fi

echo "Serving Jekyll site"
echo "  → ${URL}"
echo "  → listening on ${HOST}:${PORT}"

serve_args=(
  serve
  --config "${CONFIG_FILES}"
  --host "${HOST}"
  --port "${PORT}"
  --watch
  --livereload
  --livereload-port "${LIVERELOAD_PORT}"
)

if [ "${FORCE_POLLING}" = "true" ]; then
  serve_args+=(--force_polling)
fi

exec bundle exec jekyll "${serve_args[@]}"
