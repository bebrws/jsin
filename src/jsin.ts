#!/usr/local/bin/node
import readline from 'readline';
import yargs from 'yargs';
import jsyaml from 'js-yaml';

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
  console.log("Usage:");
  console.log("  jsin --yamlout --whole --json --yaml --match positional-command-line-arg--a-string-to-evaluate-line-from-stdin-with");
  console.log("        optional: --whole    = put all lines into one string for parsing with whichever de-serialization method is chosen"); 
  console.log("        optional: --json     = parse input as json"); 
  console.log("        optional: --yamlout  = print output object as yaml");   
  console.log("        optional: --yaml     = parse input as yaml"); 
  console.log("        optional: --match    = a string to eval to check if each string matches, should return a truthy or falsey value"); 
  console.log("        required: The final command line argument needs to a string which will be evaled in a context where the variable l");
  console.log("                  is either a string representing a new line, the entire read of stdin, or an object parsed from json or yaml.");
  console.log("  For ex:");
  console.log("  echo \"some\\nline\" | jsin \"l.replace(/e/, 'a')\"");
  console.log("  or: ");
  console.log("  echo '## Section 1\\n### Sub Section 1\\n### Sub Section 2\\n## Section 2\\n### Sub Section 1-2' | jsin --match \"l.match(/#/)\" \"l.replace('###', '    - ').replace('##', '- ')\"");
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
