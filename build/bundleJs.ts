import * as path from 'path';

import webpack from 'webpack';

import { type BuildConfig } from '../lib/types';

const bundleJs = (buildConfig: BuildConfig, watch: boolean): Promise<void> => {
	const runtimeDirectory = path.join(buildConfig.sourceDir, 'runtime');
	const webpackConfig: webpack.Configuration = {
		mode: 'production',
		entry: {
			main: path.join(runtimeDirectory, 'index.ts'),
		},
		output: {
			path: buildConfig.distDir,
			filename: 'bundle-[name].js',

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
					use: [
						{
							loader: 'ts-loader',

							// Specify a custom config file. See
							// https://stackoverflow.com/a/55607159
							options: {
								configFile: 'tsconfig.webpack.json',
							},
						},
					],
					exclude: /node_modules/,
				},
			],
		},
		// Increase the maximum entrypoint size to hide warnings.
		// TODO: Separate CSS from JS to decrease this.
		performance: {
			maxAssetSize: 1 * 1024 * 1024,
			maxEntrypointSize: 1 * 1024 * 1024, // 1 MiB
		},
		resolve: {
			extensions: ['.ts', '.js'],
		},
	};

	const handleCompilerResult = (
		error: Error | null | undefined,
		stats: webpack.Stats | undefined,
	) => {
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

		return failed;
	};

	return new Promise<void>((resolve, reject) => {
		const compiler = webpack(webpackConfig);

		if (watch) {
			const watchOptions = {
				ignored: ['node_modules/'],
			};

			compiler.watch(watchOptions, async (error, stats) => {
				if (handleCompilerResult(error, stats)) {
					console.error('⚠️ Build failed! ⚠️');
				} else {
					console.log('✅ Built!');
				}
			});
		} else {
			compiler.run((error, stats) => {
				const failed = handleCompilerResult(error, stats);

				compiler.close(() => {
					if (!failed) {
						resolve();
					} else {
						reject();
					}
				});
			});
		}
	});
};

export default bundleJs;
