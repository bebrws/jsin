#!/usr/bin/env zsh
alias -g removeFirstLine='tail -n +2'
npm i -g @vercel/ncc pkg
ncc build dist/jsin.js -o jsin
cp jsin/index.js ./jsin-with-hashbang.js 
rm -rf jsin
cat jsin-with-hashbang.js  | removeFirstLine > jsin.js
pkg --target macos-x64 jsin.js
rm jsin-with-hashbang.js jsin.js