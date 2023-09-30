import { testPlugin1 } from '../../lib/testData';
import { testConfig } from '../config';
import PluginAssetLoader from './PluginAssetLoader';

describe('PluginAssetLoader', () => {
	it('should resolve GitHub repositories from repository URIs', () => {
		const testPluginReadmeUri =
			'https://raw.githubusercontent.com/personalizedrefrigerator/joplin-draw/HEAD/README.md';

		const getFoundReadmeUriForRepository = (repositoryUri: string) => {
			return new PluginAssetLoader(
				{
					...testPlugin1,
					repository_url: repositoryUri,
					homepage_url: repositoryUri,
				},
				testConfig,
			).getReadmeFetchUri();
		};
		expect(new PluginAssetLoader(testPlugin1, testConfig).getReadmeFetchUri()).toBe(
			testPluginReadmeUri,
		);

		expect(
			getFoundReadmeUriForRepository(
				'https://github.com/personalizedrefrigerator/joplin-draw.git/',
			),
		).toBe(testPluginReadmeUri);

		expect(
			getFoundReadmeUriForRepository(
				'https://example.com/personalizedrefrigerator/joplin-draw.git/',
			),
		).toBe(null);
	});
});
