# JSIN

A tool to help process text or JSON on the command line
Meant to be used with stdin being piped in from some other command

For example:
```
echo """
## Soemthing
some text
### Another thing
more text

## Section
lots of text

### Sub section 1
### Sub section 2

## A header

### A final section
""" | jsin --match \"l.match(/#/)\" \"l.replace('###', '    - ').replace('##', '- ')\"

```

Or one that I have been using recently on a regular basis:

```

function alaOpacity() {
    cat ~/.config/alacritty/alacritty.yml | jsin --yaml --yamlout --whole "function r(l, o) { l.background_opacity=Number(o); return l; }  r(l, \"$1\"); " >  ~/.config/alacritty/alacritty.new
    mv ~/.config/alacritty/alacritty.new ~/.config/alacritty/alacritty.yml
}

```

then:

```
alaOpacity 0.7
```

This shows it's ability to parse yaml as well.

It can also parse and print JSON of course and handle plists.



## Compiling down into a single file which could be transported to different machines
Use ncc:

```
npm i -g @vercel/ncc 
ncc build dist/jsin.js -o jsin
chmod +x jsin/index.js
cp jsin/index.js /usr/local/bin/jsin # jsin/index.js is the file you could now use on any machine without deps other than node
rm -rf jsin
```


## Or compiling the NodeJS based command line tool into a binary command line tool...
with a packaged NodeJS interpreter.

```
alias -g removeFirstLine='tail -n +2'
npm i -g @vercel/ncc pkg
ncc build dist/jsin.js -o jsin
cp jsin/index.js ./jsin-with-hashbang.js 
rm -rf jsin
cat jsin-with-hashbang.js  | removeFirstLine > jsin.js
pkg --target macos-x64 jsin.js
rm jsin-with-hashbang.js jsin.js
```


Here is an example bash function that will change your Alacritty opacity:
```
# To use run: alaFontSize 12
function alaFontSize() {
    cat ~/.config/alacritty/alacritty.yml | jsin --yaml --yamlout --whole "(l.font.size=Number(\"$1\")) && l; " > $HOME/.config/alacritty/alacritty.yml.tmp
    mv $HOME/.config/alacritty/alacritty.yml.tmp $HOME/.config/alacritty/alacritty.yml
}
# To use run: alaOpacity 0.8
function alaOpacity() {
    cat ~/.config/alacritty/alacritty.yml | jsin --yaml --yamlout --whole "(l.background_opacity=Number(\"$1\")) && l; " > $HOME/.config/alacritty/alacritty.yml.tmp
    mv $HOME/.config/alacritty/alacritty.yml.tmp $HOME/.config/alacritty/alacritty.yml
}
alaOpacity 0.3
```




This is actually a clone of someone elses tool but I don't know where that repo is and cannot link to it.
