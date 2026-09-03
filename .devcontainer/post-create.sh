#!/usr/bin/env bash
set -eo pipefail

# Add the class remote only if it is absent.
git remote get-url myfirst >/dev/null 2>&1 || \
  git remote add myfirst https://github.com/hnguyen175/COMP-645-myfirst.git

# Install Bash-it non-interactively once.
if [ ! -d "$HOME/.bash_it" ]; then
  git clone --depth=1 https://github.com/Bash-it/bash-it.git "$HOME/.bash_it"
  bash "$HOME/.bash_it/install.sh" -s -a
fi

# Use Bash-it's default theme (normally bobby) or replace with desired theme
# later from an interactive terminal.

# Native Bash vi command-line editing.
grep -qxF 'set -o vi' "$HOME/.bashrc" || \
  echo 'set -o vi' >> "$HOME/.bashrc"

# Readline vi mode settings; add once.
if ! grep -qxF 'set editing-mode vi' "$HOME/.inputrc" 2>/dev/null; then
  cat >> "$HOME/.inputrc" <<'EOF'

set editing-mode vi
set show-mode-in-prompt on
set vi-ins-mode-string \1\e[6 q\2
set vi-cmd-mode-string \1\e[2 q\2
EOF
fi