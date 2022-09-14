import getConfig from "./config";

jest.setTimeout(120000)

let config: { mode: string, [key: string]: any };

beforeAll(async () => {
	config = await getConfig()
	return config
})

describe('config', () => {
	test('should have rootDir', async () => {
		expect(config.rootDir).toBeTruthy()
	})
	test('should have distDir', async () => {
		expect(config.distDir).toBeTruthy()
	})
})
