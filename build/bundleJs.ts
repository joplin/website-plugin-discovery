import * as path from 'path';
import { rollup, type RollupOptions, type OutputOptions } from 'rollup';
import pluginTypescript from '@rollup/plugin-typescript';
import { type BuildConfig } from '../lib/types';

const bundleJs = async (config: BuildConfig): Promise<void> => {
	// Rollup expects tsconfig to produce ES modules, while node (by default)
	// expects CommonJS.
	const tsconfigPath = path.join(path.dirname(__dirname), 'tsconfig.rollup.json');

	const outputOptions: OutputOptions[] = [
		{
			file: path.join(config.distDir, 'bundle.js'),

			// self-executing script function.
			format: 'iife',
		},
	];

	const rollupConfig: RollupOptions = {
		input: path.join(config.sourceDir, 'index.ts'),
		output: outputOptions,
		plugins: [pluginTypescript({ tsconfig: tsconfigPath })],
	};

	let bundle;
	try {
		bundle = await rollup(rollupConfig);

		for (const outputOption of outputOptions) {
			await bundle.write(outputOption);
		}
	} finally {
		await bundle?.close();
	}
};

export default bundleJs;
