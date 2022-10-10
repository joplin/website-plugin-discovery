import getPlugins from './plugins'

jest.setTimeout(120000)

let plugins: any

beforeAll(async () => {
	plugins = await getPlugins()
	return plugins
})

describe('plugin data', () => {
	test('should not be empty', async () => {
		expect(plugins).toBeTruthy()
	})
})
