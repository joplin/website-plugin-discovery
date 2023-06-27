import Mustache from 'mustache';
import path from 'node:path';
import klawSync from 'klaw-sync';
import fs from 'fs-extra';
import { type JoplinPlugin } from './data/plugins';
import { devConfig, productionConfig, type BuildConfig } from './config';
import bundleJs from './bundleJs';

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
		console.log(err);
	}
}

export async function loadData(): Promise<Data> {
	const dataDir = path.join(__dirname, 'data');
	const dataFiles = klawSync(dataDir, { nodir: true });
	const data: Data = {};
	for (let i = 0; i < dataFiles.length; i++) {
		const file = dataFiles[i];
		if (!file.path.includes('.test') && file.path.endsWith('.js')) {
			data[path.basename(file.path, '.js')] = await (await import(file.path)).default();
		}
	}
	return data;
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
	globalData: Data,
	partials: Data,
	routes: Data,
	distRootPath: string
): void {
	templates.forEach((template) => {
		const outputBasePath = path.join(
			path.resolve(distRootPath),
			path.relative(config.sourceDir, template.path).replace('pages', '')
		);
		
		if (template.name === '[pluginName]') {
			console.log(`Rendering dynamic route pluginName`);
			routes.pluginName.forEach((key: string) => {
				const distPath = path.join(
					outputBasePath,
					key,
					'index.html'
				);
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
			const distPath = path.join(
				outputBasePath,
				template.name + '.html'
			);
			const output = Mustache.render(template.content, globalData, partials);
			fs.mkdirsSync(path.dirname(distPath));
			fs.writeFileSync(distPath, output, 'utf8');
		}
	});
}

export async function build(mode: 'dev' | 'production'): Promise<void> {
	const config = mode === 'dev' ? devConfig : productionConfig;

	fs.ensureDirSync(config.distDir);
	clearBuildPath(config.distDir);
	copyStaticFiles(config);
	const template = loadTemplate(config);
	const globalData: Data = {
		...(await loadData()),
		config,
	};
	const partials = loadTemplatePartials(config);
	const routes = {
		pluginName: globalData.plugins.all.map((plugin: JoplinPlugin) => plugin.id),
	};
	renderTemplates(config, template, globalData, partials, routes, config.distDir);
	await bundleJs(config);
}
