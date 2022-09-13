import getPlugins from './plugins';

let plugins: string[] = [];

beforeAll(async () => {
	plugins = await getPlugins();
	return plugins;
});

describe('plugin data', () => {
	test('should not be empty', async () => {
		expect(plugins.length).toBeGreaterThan(0);
	});
});