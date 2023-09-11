import PluginDataManager from './PluginDataManager';
import testData, { testPlugin1, testPlugin2, testPlugin3, testPlugin4, testPlugin5 } from '../lib/testData';

describe('PluginDataManager', () => {
	it('should sort search results (roughly) in order of relevance', () => {
		const manager = PluginDataManager.fromData(testData);
		const maxResults = 4;

		// testPlugin1 and testPlugin2 should contain an 's', but testPlugin2 is recommended and
		// testPlugin1 is not.
		// testPlugin3 is not recommended, so should be last.
		expect(manager.search('s', maxResults)).toMatchObject([
			testPlugin2,
			testPlugin1,
			testPlugin4,
			testPlugin3,
		]);
	});

	it('should return no matchs when query matches nothing', () => {
		const manager = PluginDataManager.fromData(testData);
		const maxResults = 5;
		expect(manager.search('matchesNothing', maxResults)).toHaveLength(0);
	});

	it('should not return more than maxResults', () => {
		const manager = PluginDataManager.fromData(testData);
		const maxResults = 1;

		// The empty string matches all plugins
		expect(manager.search('', maxResults)).toHaveLength(1);
	});

	it('should rank more recently-updated plugins first', () => {
		const manager = PluginDataManager.fromData(testData);
		const maxResults = 2;

		// testPlugin4 is the same as testPlugin3, but was updated more recently
		expect(manager.search('Fake Plugin', maxResults)).toMatchObject([testPlugin4, testPlugin3]);
	});

	it('should show plugins with invalid update times in the search results', () => {
		// Plugins can sometimes have N/A as the last updated time
		// These plugins should still be able to appear in the search results.
		const manager = PluginDataManager.fromData(testData);
		const maxResults = 1;
		expect(manager.search('Plugin with N/A modified time', maxResults)).toMatchObject([ testPlugin5 ]);
	});
});
