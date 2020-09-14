#!/usr/local/bin/node
import readline from 'readline';
import yargs from 'yargs';
import plist from 'plist';
import jsyaml from 'js-yaml';
import chalk from 'chalk';

// Pretty json is imported to be used from an eval statement if needed
import pj from '@slimio/pretty-json';
// Now a final argument can eval a line that contains pj(l)
// and a "pretty" yaml output will be displayed for l when it is an object

let allLines: string[] = [];

const argv = yargs.options({
    whole: { type: 'boolean', default: false },
    json: { type: 'boolean', default: false },
    yaml: { type: 'boolean', default: false },
    match: { type: 'string', default: '' }
  }).argv;

  debugger
const rl: readline.Interface = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});

if (argv._.length != 1) {
  console.log(chalk.yellow(`\njsin usage and examples:\n`));
  console.log(`A tool for parsing files line by line or as a while that are ascii/unicode and formatted as either`);
  console.log(`json, yaml, or are an OSX/iOS plist.\n\n`);
  console.log(`  ${chalk.cyan("jsin")} ${chalk.green("--plist")} ${chalk.green("--plistout")} ${chalk.green("--yamlout")} ${chalk.green("--whole")} ${chalk.green("--json")} ${chalk.green("--yaml")} ${chalk.green("--match")} positional-${chalk.green("unnamed-command-line-arg")}-a-string-to-evaluate-line-from-stdin-with`);
  console.log(`        optional: ${chalk.green("--whole")}     = put all lines into one string for parsing with whichever de-serialization method is chosen. String is variable l`); 
  console.log(`        optional: ${chalk.green("--json")}      = parse input as json into an object, l`); 
  console.log(`        optional: ${chalk.green("--yamlout")}   = print output object as yaml`);   
  console.log(`        optional: ${chalk.green("--yaml")}      = parse input as yaml into an object, l`); 
  console.log(`        optional: ${chalk.green("--plistout")}  = print output object and generate plist xml output`);   
  console.log(`        optional: ${chalk.green("--plist")}     = parse input plist xml into an object, l`);   
  console.log(`        optional: ${chalk.green("--match")}     = a string to eval to check if each string matches, should return a truthy or falsey value`); 
  console.log(`        required: The ${chalk.green("final command line argument")} needs to a string which will be evaled in a context where the variable l`);
  console.log(`                  is either a string representing a new line, the entire read of stdin, or an object parsed from json or yaml.`);
  console.log(`\n  For ex:\n`);
  console.log(chalk.blue(`  echo \"some\\nline\" | jsin \"l.replace(/e/, 'a')\"`));
  console.log(`\n  or:\n`);
  console.log(chalk.blue(`  echo '## Section 1\\n### Sub Section 1\\n### Sub Section 2\\n## Section 2\\n### Sub Section 1-2' | jsin --match \"l.match(/#/)\" \"l.replace('###', '    - ').replace('##', '- ')\"`));
  console.log(`\n  or a helpful bash function for setting a terminals opacity:\n`);
  console.log(chalk.blue(`  function alaOpacity() {
    cat ~/.config/alacritty/alacritty.yml | jsin --yaml --yamlout --whole "function r(l, o) { l.background_opacity=Number(o); return l; }  r(l, \"$1\"); " >  ~/.config/alacritty/alacritty.new
    mv ~/.config/alacritty/alacritty.new ~/.config/alacritty/alacritty.yml
  }`))
  console.log(`\n\n  Check the README.md file for other examples. https://github.com/bebrws/jsin/blob/master/README.md\n\n`);
  process.exit(1);
}


rl.on('line', (rll: string): void => {
    if (!argv.whole) {
      const l: string | object | jsyaml.LoadOptions = (argv.json ? JSON.parse(rll) : (argv.yaml ? jsyaml.load(rll) : rll));
      const out = argv.match.length ? (eval(argv.match) ? eval(argv._[0]) : "") : eval(argv._[0]);
      if (typeof out !== "string" || (typeof out === "string" && out.length))  {
        argv.yamlout ? console.log(`${jsyaml.dump(out)}`) : console.log(`${out}`);
      }
    } else {
      allLines.push(rll);
    }
});

rl.on('close', () => {
  const allLinesTogether = allLines.join("\n");
  const l: string | object | jsyaml.LoadOptions = (argv.json ? JSON.parse(allLinesTogether) : (argv.yaml ? jsyaml.load(allLinesTogether) : allLinesTogether));
  argv.yamlout ? console.log(jsyaml.dump(eval(argv._[0]))) : console.log(eval(argv._[0]));
});
