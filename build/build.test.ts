import {
	loadTemplate,
	loadData,
	loadTemplatePartials,
	type Template,
	type Data,
	renderTemplates,
} from './build';
import fs from 'fs-extra';
import path from 'path';
import { devConfig } from './config';

const testOutputDir = path.join(__dirname, 'test');
const testDistDir = path.join(testOutputDir, 'dist');
const config = {
	...devConfig,
	distDir: testDistDir
};

jest.setTimeout(120000);

let templates: Template[];
let data: Data;
let partials: Data;
describe('build', () => {
	test('should load template', () => {
		templates = loadTemplate(config);
		expect(templates.length).toBeGreaterThan(0);
	});
	test('should load data', async () => {
		data = await loadData();
		expect(data).toBeTruthy();
	});
	test('should load partials', async () => {
		partials = loadTemplatePartials(config);
		expect(partials).toBeTruthy();
	});
	test('should gernerate html', () => {
		renderTemplates(
			{ ...devConfig, distDir: testDistDir },
			[
				{
					path: path.resolve(path.join(devConfig.sourceDir, './pages')),
					name: 'index',
					content: 'hello, world!',
				},
			],
			{},
			{},
			{
				pluginName: ['com.whatever.quick-links'],
			},
			testDistDir
		);
		expect(fs.readFileSync(path.join(testDistDir, 'index.html'), 'utf8')).toBeTruthy();
	});
});

afterAll(async () => {
	await fs.remove(testOutputDir);
	await fs.remove(testDistDir);
});
