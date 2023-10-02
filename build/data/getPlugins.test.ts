import { testConfig } from '../config';
import getPlugins from './getPlugins';

jest.setTimeout(120000);

let plugins: any;

beforeAll(async () => {
	plugins = await getPlugins(testConfig);
});

describe('plugin data', () => {
	test('should not be empty', async () => {
		expect(plugins).toBeTruthy();
	});
});
