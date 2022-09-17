import {
	loadTemplate,
	loadData,
	loadTemplatePartials,
	Template,
	Data,
	renderTemplates,
} from './build'
import fs from 'fs-extra'

jest.setTimeout(120000)

let templates: Template[]
let data: Data
let partials: Data
describe('build', () => {
	test('should load template', () => {
		templates = loadTemplate()
		expect(templates.length).toBeGreaterThan(0)
	})
	test('should load data', async () => {
		data = await loadData()
		expect(data).toBeTruthy()
	})
	test('should load partials', async () => {
		partials = loadTemplatePartials()
		expect(partials).toBeTruthy()
	})
	test('should gernerate html', () => {
		renderTemplates(templates, data, partials, {
			pluginName: ['com.whatever.quick-links'],
		})
		expect(fs.readFileSync('./site/index.html', 'utf8')).toBeTruthy()
	})
})
