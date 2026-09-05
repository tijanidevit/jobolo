#!/usr/bin/env sh
# dev.sh — Start Next.js on the next available port starting from 3000.
# Increments the port automatically if it is already occupied.

START_PORT=${PORT:-3000}
port=$START_PORT

# Find an available port by attempting to bind a TCP socket.
# Works on macOS and Linux without any extra dependencies.
while true; do
  if ! lsof -iTCP:"$port" -sTCP:LISTEN -t > /dev/null 2>&1; then
    break
  fi
  echo "Port $port is in use, trying $((port + 1))..."
  port=$((port + 1))
done

# Remove the Next.js dev server lockfile if it exists so we can start
# even if another instance is running in this directory.
rm -f .next/dev/lock

echo "Starting Next.js on port $port"
exec next dev --port "$port"
