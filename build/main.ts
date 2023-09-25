
import { argv } from 'node:process';
import { build } from './build';

// Inerpret the last argument as the mode
let mode: 'dev'|'production'|'watch'|string = argv[argv.length - 1];

let watch = false;
if (mode === 'watch') {
	watch = true;
	mode = 'dev';
}

if (mode !== 'dev' && mode !== 'production') {
	throw new Error(`Invalid mode, ${mode}, must be either 'dev' or 'production'.`);
}

void build(mode, watch);
