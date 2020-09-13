#!/usr/local/bin/node
import readline from 'readline';
import yargs from 'yargs';

const argv = yargs.options({
    json: { type: 'boolean', default: false },
    eval: { type: 'string', default: '' }
  }).argv;

  debugger
const rl: readline.Interface = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});

if (argv._.length != 1) {
  console.log("Usage:");
  console.log("  jsin (optional: --json) string-to-evaluate-line-from-stdin-with");
  console.log("  For ex:")
  console.log("  echo \"some\\nline\" | jsin \"l.replace(/e/, 'a')\"");
  process.exit(1);
}

rl.on('line', (rll: string): void => {
    var l: string | object = argv.json ? JSON.parse(rll) : rll;
    console.log(`${eval(argv._[0])}`);
});
