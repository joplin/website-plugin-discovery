import { argv } from 'node:process';
import { build } from './build';
import { devConfig, productionBaseConfig } from './config';

// Inerpret the last argument as the mode
type CommandType = 'dev' | 'github-release' | 'joplin-website-release' | 'watch-js';
let mode: CommandType | string = argv[2];

let watch = false;
if (mode === 'watch-js') {
	watch = true;
	mode = 'dev';
}

const printUsage = () => {
	console.error('Usage: <script path> dev');
	console.error('Usage: <script path> watch-js');
	console.error('  Builds in development mode');
	console.error('Usage: <script path> production <site-path>');
	console.error(
		"  Builds in production mode. The site's base path (e.g. /plugins) must be specified.",
	);
};

let buildConfig;
if (mode === 'production') {
	if (argv.length <= 3) {
		printUsage();
		throw new Error('Missing required positional option.');
	}

	const sitePath = argv[3];

	if (!sitePath.startsWith('/')) {
		throw new Error(`Invalid site path: ${sitePath}`);
	}

	buildConfig = {
		...productionBaseConfig,
		site: sitePath,
	};
} else if (mode === 'dev') {
	buildConfig = devConfig;
} else {
	printUsage();
	throw new Error(`Invalid mode, ${mode}, must be either dev or production.`);
}

void build(buildConfig, watch);
