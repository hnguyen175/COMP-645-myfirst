#!/usr/bin/env bash
set -e

# Add the myfirst remote if it doesn't exist
git remote get-url myfirst >/dev/null 2>&1 || git remote add myfirst https://github.com/hnguyen175/COMP-645-myfirst.git

# Install Bash-it if not present
if [ ! -d ~/.bash_it ]; then
  git clone --depth=1 https://github.com/Bash-it/bash-it.git ~/.bash_it
  bash ~/.bash_it/install.sh -s -a
fi

# Enable git plugin & alias
bash-it enable plugin git
bash-it enable alias git

# Enable a prompt theme
bash-it enable theme powerline

# Vi mode
if ! grep -q 'set -o vi' ~/.bashrc; then
  echo 'set -o vi' >> ~/.bashrc
fi

cat >> ~/.inputrc <<'EOF'
set editing-mode vi
set show-mode-in-prompt on
set vi-ins-mode-string \1\e[6 q\2
set vi-cmd-mode-string \1\e[2 q\2
EOF

# Install ble.sh for autosuggestions
if [ ! -d ~/.ble.sh ]; then
  git clone --depth=1 https://github.com/akinomyoga/ble.sh.git ~/.ble.sh
fi
if ! grep -q 'source ~/.ble.sh/ble.sh' ~/.bashrc; then
  echo 'source ~/.ble.sh/ble.sh' >> ~/.bashrc
fi

bash-it reload