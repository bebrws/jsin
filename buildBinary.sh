#!/usr/bin/env zsh
alias -g removeFirstLine='tail -n +2'
npm i -g @vercel/ncc pkg
rm -rf jsin
ncc build dist/jsin.js -o jsin
cp jsin/index.js ./jsin-with-hashbang.js 
rm -rf jsin
cat jsin-with-hashbang.js  | removeFirstLine > jsin.js
pkg --target macos-x64 jsin.js
rm jsin-with-hashbang.js jsin.js

if read -q "choice?Press y/n to install jsin binary to /usr/local/bin: "; then
    echo "\n\nInstalling to /usr/local/bin"
    cp jsin /usr/local/bin/jsin2
else
    echo "\n\n$choice not 'y'. Not installing and exiting..."
fi
