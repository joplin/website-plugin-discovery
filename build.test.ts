import {
	loadTemplate,
	loadData,
	loadTemplatePartials,
	Template,
	Data,
	renderTemplates,
} from './build'
import fs from 'fs-extra'
import path from 'path'
import { devConfig } from './config'

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
		renderTemplates(
			devConfig,
			[
				{
					path: path.resolve('./pages'),
					name: 'index',
					content: 'hello, world!',
				},
			],
			{},
			{},
			{
				pluginName: ['com.whatever.quick-links'],
			},
			'./test/dist'
		)
		expect(fs.readFileSync('./test/dist/index.html', 'utf8')).toBeTruthy()
	})
})

afterAll(async () => {
	await fs.remove('./test/dist')
})
