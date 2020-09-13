#!/usr/local/bin/node
import readline from 'readline';
import yargs from 'yargs';

const argv = yargs.options({
    json: { type: 'boolean', default: false },
    match: { type: 'string', default: '' }
  }).argv;

  debugger
const rl: readline.Interface = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});

if (argv._.length != 1) {
  console.log("Usage:");
  console.log("  jsin (optional: --json) (optional: --match string-to-eval-to-see-if-line-matched) string-to-evaluate-line-from-stdin-with");
  console.log("  For ex:")
  console.log("  echo \"some\\nline\" | jsin \"l.replace(/e/, 'a')\"");
  console.log("  or: ")
  console.log("  echo '## Section 1\\n### Sub Section 1\\n### Sub Section 2\\n## Section 2\\n### Sub Section 1-2' | jsin --match \"l.match(/#/)\" \"l.replace('###', '    - ').replace('##', '- ')\"");
  process.exit(1);
}

rl.on('line', (rll: string): void => {
    var l: string | object = argv.json ? JSON.parse(rll) : rll;
    const out = argv.match.length ? (eval(argv.match) ? eval(argv._[0]) : "") : eval(argv._[0]);
    if (out.length) {
      console.log(`${out}`);
    }
});
