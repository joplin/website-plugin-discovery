
import { argv } from 'node:process';
import { build } from './build';

// Inerpret the last argument as the mode
const mode: 'dev'|'production'|string = argv[argv.length - 1];

if (mode !== 'dev' && mode !== 'production') {
	throw new Error(`Invalid mode, ${mode}, must be either 'dev' or 'production'.`);
}

void build(mode);