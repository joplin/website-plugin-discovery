import { type Category } from '../../lib/types';
import { testConfig } from '../config';
import getAllPossibleCategories from './getAllPossibleCategories';
import getPlugins from './getPlugins';

jest.setTimeout(120000);

let allPossibleCategories: Category[] = [];

beforeAll(async () => {
	const plugins = await getPlugins(testConfig);
	allPossibleCategories = await getAllPossibleCategories(plugins);
	return allPossibleCategories;
});

describe('allPossibleCategories data', () => {
	test('should not be empty', async () => {
		expect(allPossibleCategories.length).toBeGreaterThan(0);
	});
});
