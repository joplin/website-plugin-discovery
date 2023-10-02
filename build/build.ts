import * as Mustache from 'mustache';
import * as path from 'node:path';
import klawSync from 'klaw-sync';
import * as fs from 'fs-extra';
import getGlobalMarketplaceData from './data/getGlobalMarketplaceData';
import { devConfig, productionConfig } from './config';
import bundleJs from './bundleJs';
import {
	type BuildConfig,
	type JoplinPlugin,
	type MarketplaceData as GlobalMarketplaceData,
	IdToManifestRecord,
} from '../lib/types';

export interface Template {
	path: string;
	name: string;
	content: string;
}

export type Data = Record<string, any>;

function clearBuildPath(buildPath: string): void {
	try {
		fs.rmSync(buildPath, { recursive: true });
	} catch (err) {
		console.log(err);
	}
}

function copyStaticFiles(config: BuildConfig): void {
	try {
		fs.copySync(path.join(config.sourceDir, 'assets'), config.distDir);
	} catch (err) {
		console.log('Error copying static files:', err);
		throw err;
	}
}

export function loadTemplate(config: BuildConfig): Template[] {
	const templateFiles = klawSync(path.join(config.sourceDir, 'pages'), { nodir: true });
	return templateFiles.map((file) => {
		return {
			name: path.basename(file.path, '.mustache'),
			path: path.parse(file.path).dir,
			content: fs.readFileSync(file.path, 'utf8'),
		};
	});
}

export function loadTemplatePartials(config: BuildConfig): Data {
	const partialFiles = klawSync(path.join(config.sourceDir, 'components'), { nodir: true });
	const partialData: Data = {};
	partialFiles.forEach((file) => {
		partialData[path.basename(file.path, '.mustache')] = fs.readFileSync(file.path, 'utf8');
	});
	return partialData;
}

export function renderTemplates(
	config: BuildConfig,
	templates: Template[],
	globalData: GlobalMarketplaceData,
	partials: Data,
	routes: Data,
	distRootPath: string,
): void {
	templates.forEach((template) => {
		const outputBasePath = path.join(
			path.resolve(distRootPath),
			path.relative(path.join(config.sourceDir, 'pages'), template.path),
		);

		if (template.name.indexOf('[pluginName]') !== -1) {
			console.log('Rendering dynamic route pluginName');
			routes.pluginName.forEach((key: string) => {
				const distPath = path.join(outputBasePath, key, 'index.html');
				console.log(`- Rendering ${distPath}`);
				const data = {
					...globalData,
					path: key,
					plugin: {
						...globalData.plugins.raw[key],
					},
				};
				const output = Mustache.render(template.content, data, partials);
				fs.mkdirsSync(path.dirname(distPath));
				fs.writeFileSync(distPath, output, 'utf8');
			});
		} else {
			const distPath = path.join(outputBasePath, template.name + '.html');
			const output = Mustache.render(template.content, globalData, partials);
			fs.mkdirsSync(path.dirname(distPath));
			fs.writeFileSync(distPath, output, 'utf8');
		}
	});
}

function writePluginDataAsJSON(rawPluginData: IdToManifestRecord, config: BuildConfig): void {
	console.log('writing plugin data as JSON');

	const dataToWrite: IdToManifestRecord = Object.create(null);

	// Remove possibly large objects from the data
	for (const key in rawPluginData) {
		dataToWrite[key] = {
			...rawPluginData[key],
			assets: undefined,
		};
	}

	const dataString = JSON.stringify(dataToWrite);
	fs.writeFileSync(path.join(config.distDir, 'pluginData.json'), dataString);
}

export async function build(mode: 'dev' | 'production', watchJs: boolean): Promise<void> {
	const config = mode === 'dev' ? devConfig : productionConfig;

	fs.ensureDirSync(config.distDir);
	clearBuildPath(config.distDir);
	copyStaticFiles(config);
	const template = loadTemplate(config);
	const globalData = await getGlobalMarketplaceData(config);
	const partials = loadTemplatePartials(config);
	const routes = {
		pluginName: globalData.plugins.all.map((plugin: JoplinPlugin) => plugin.id),
	};
	renderTemplates(config, template, globalData, partials, routes, config.distDir);
	writePluginDataAsJSON(globalData.plugins.raw, config);

	await bundleJs(config, watchJs);
}
