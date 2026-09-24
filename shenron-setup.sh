#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# ── Homebrew update + upgrade everything ─────────────────────────────────────
echo "==> Updating Homebrew and upgrading packages"
brew update
brew upgrade
brew cleanup

# ── Node.js (via nvm, idempotent) ────────────────────────────────────────────
export NVM_DIR="$HOME/.nvm"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "==> Installing nvm"
  brew install nvm
  mkdir -p "$NVM_DIR"
fi
source "$NVM_DIR/nvm.sh"

if ! node -e 'process.exit(parseInt(process.version.slice(1)) >= 20 ? 0 : 1)' 2>/dev/null; then
  echo "==> Installing Node.js 20"
  nvm install 20
fi
nvm use 20
nvm alias default 20
echo "==> Node $(node -v)"

# ── pm2 ───────────────────────────────────────────────────────────────────────
if ! command -v pm2 &>/dev/null; then
  echo "==> Installing pm2"
  npm install -g pm2
fi

# ── ngrok ─────────────────────────────────────────────────────────────────────
if ! command -v ngrok &>/dev/null; then
  echo "==> Installing ngrok"
  brew install ngrok/ngrok/ngrok
fi

if ! ngrok config check 2>/dev/null | grep -q authtoken; then
  echo ""
  echo "==> Enter your ngrok authtoken (https://dashboard.ngrok.com/get-started/your-authtoken):"
  read -r NGROK_TOKEN
  ngrok config add-authtoken "$NGROK_TOKEN"
fi

# ── App dependencies + build ──────────────────────────────────────────────────
echo "==> Installing npm dependencies"
npm ci

echo "==> Building Next.js app"
npm run build

# ── Restart app ───────────────────────────────────────────────────────────────
pm2 stop erus 2>/dev/null || true
pm2 delete erus 2>/dev/null || true
echo "==> Starting app with pm2"
pm2 start npm --name erus -- start
pm2 save

pm2 stop erus-ngrok 2>/dev/null || true
pm2 delete erus-ngrok 2>/dev/null || true
echo "==> Starting ngrok tunnel"
pm2 start "ngrok http 3000" --name erus-ngrok
pm2 save

sleep 3

echo ""
echo "==> Public URL:"
curl -s http://localhost:4040/api/tunnels | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['tunnels'][0]['public_url'])" 2>/dev/null \
  || echo "    Check: curl http://localhost:4040/api/tunnels"

echo ""
echo "Done. pm2 ls to check status, pm2 logs erus for app logs."
