set -euo pipefail

ENV_FILE=".env"

# Generate a 64-byte hex secret using containers
gen_secret() {
  # Try Node
  if docker run --rm node:20-alpine node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" 2>/dev/null; then
    return 0
  fi
  #OpenSSL in Alpine
  docker run --rm alpine:3 sh -lc "apk add --no-cache openssl >/dev/null && openssl rand -hex 64"
}

# Ensure .env exists
if [ ! -f "$ENV_FILE" ]; then
  if [ -f .env.example ]; then cp .env.example "$ENV_FILE"; else : > "$ENV_FILE"; fi
  echo "Created .env"
fi

# If JWT_SECRET missing or empty
if ! grep -q '^JWT_SECRET=' "$ENV_FILE" || grep -q '^JWT_SECRET=$' "$ENV_FILE"; then
  echo "Generating JWT_SECRET…"
  SECRET="$(gen_secret)"
  # replace if line exists; else append
  if grep -q '^JWT_SECRET=' "$ENV_FILE"; then
    sed -i.bak -E "s|^JWT_SECRET=.*|JWT_SECRET=${SECRET}|" "$ENV_FILE"
  else
    printf "\nJWT_SECRET=%s\n" "$SECRET" >> "$ENV_FILE"
  fi
fi

echo "✓ .env ready"


echo "Starting Docker services…"
docker compose up --build