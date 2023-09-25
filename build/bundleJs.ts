import * as path from 'path';

import webpack from 'webpack';

import { type BuildConfig } from '../lib/types';

const bundleJs = (buildConfig: BuildConfig): Promise<void> => {
	const webpackConfig: webpack.Configuration = {
		mode: 'production',
		entry: path.join(buildConfig.sourceDir, 'runtime', 'index.ts'),
		output: {
			path: buildConfig.distDir,
			filename: 'bundle.js',

			// self-executing script function.
			iife: true,
		},
		module: {
			rules: [
				{
					test: /\.scss$/i,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				},

				// See https://webpack.js.org/guides/typescript/
				{
					test: /\.ts$/i,
					use: [{
						loader: 'ts-loader',

						// Specify a custom config file. See
						// https://stackoverflow.com/a/55607159
						options: {
							configFile: 'tsconfig.webpack.json',
						}
					}],
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: ['.ts', '.js']
		}
	};

	return new Promise<void>((resolve, reject) => {
		const compiler = webpack(webpackConfig);
		compiler.run((error, stats) => {
			let failed = false;
			if (error) {
				console.error('Error:', error.message, error.stack);
				failed = true;
			}

			const hasErrors = stats?.hasErrors();
			const hasWarnings = stats?.hasWarnings();

			if (stats && (hasErrors || hasWarnings)) {
				if (hasErrors) {
					console.error('Failed with errors.');
					failed = true;
				}

				console.error('Errors and warnings:\n', stats.toString());
			}

			compiler.close(() => {
				if (!failed) {
					resolve();
				} else {
					reject();
				}
			});
		});
	});
};

export default bundleJs;
