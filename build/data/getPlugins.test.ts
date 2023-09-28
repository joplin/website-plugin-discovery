import { testConfig } from '../config';
import getPlugins from './getPlugins';

jest.setTimeout(120000);

let plugins: any;

beforeAll(async () => {
	plugins = await getPlugins(testConfig);
	return plugins;
});

describe('plugin data', () => {
	test('should not be empty', async () => {
		expect(plugins).toBeTruthy();
	});
});
