import path from 'path';
import rollup, { RollupOptions } from 'rollup';
import pluginTypescript from '@rollup/plugin-typescript';
import { BuildConfig } from './config';

const bundleJs = async (config: BuildConfig) => {
	// Rollup expects tsconfig to produce ES modules, while node (by default)
	// expects CommonJS.
	const tsconfigPath = path.join(path.dirname(__dirname), 'tsconfig.rollup.json');

	const outputOptions: rollup.OutputOptions[] = [{
		file: path.join(config.distDir, 'bundle.js'),

		// self-executing script function.
		format: 'iife'
	}];

	const rollupConfig: RollupOptions = {
		input: path.join(config.sourceDir, 'index.ts'),
		output: outputOptions,
		plugins: [pluginTypescript({ tsconfig: tsconfigPath })]
	};

	let bundle;
	try {
		bundle = await rollup.rollup(rollupConfig);

		for (const outputOption of outputOptions) {
			await bundle.write(outputOption);
		}
	} finally {
		bundle?.close();
	}
}

export default bundleJs;
