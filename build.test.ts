import { loadTemplate, loadData, Template, Data, renderTemplates } from "./build";
import fs from "fs-extra"

let templates: Template[];
let data: Data;
describe('build', () => {
	test('should load template', () => {
		templates = loadTemplate();
		expect(templates.length).toBeGreaterThan(0);
	});
	test('should load data', async () => {
		data = await loadData();
		expect(data).toBeTruthy();
	});
	test('should gernerate html', () => {
		renderTemplates(templates, data);
		expect(fs.readFileSync('./site/index.html', 'utf8')).toBeTruthy();
	});
});