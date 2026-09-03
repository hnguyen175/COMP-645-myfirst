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

# Run an interactive Bash so ~/.bashrc loads Bash-it and defines `bash-it`.
bash -ic '
  bash-it enable plugin git history
  bash-it enable alias git general
  bash-it enable completion git
'

# Select Bash-it's Modern theme.
sed -i \
  's/^export BASH_IT_THEME=.*/export BASH_IT_THEME="modern"/' \
  "$HOME/.bashrc"

# Native Bash vi command-line editing.
grep -qxF 'set -o vi' "$HOME/.bashrc" || \
  echo 'set -o vi' >> "$HOME/.bashrc"
