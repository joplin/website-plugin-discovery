import getURLData from './getURLData';

describe('getURLData', () => {
	it('should get plugin ID from URL', () => {
		expect(getURLData('http://example.com/a/b?plugin=a.test')).toMatchObject({
			pluginId: 'a.test',
			fromTab: null,
		});

		expect(getURLData('http://example.com/a/b?plugin=✅?from-tab=a-test')).toMatchObject({
			pluginId: '✅',
			fromTab: 'a-test',
		});
	});

	it('should get containing category from URL', () => {
		expect(getURLData('http://example.com/a/b?from-tab=test')).toMatchObject({
			pluginId: null,
			fromTab: 'test',
		});
	});

	it('should only match URI components after the last /', () => {
		expect(getURLData('http://example.com/a/b?plugin=✅?from-tab=✅✅/')).toMatchObject({
			pluginId: null,
			fromTab: null,
		});
	});
});
