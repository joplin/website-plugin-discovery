import handleRedirects from './handleRedirects';

describe('handleRedirects', () => {
	test.each([
		['https://joplin.github.io/website-plugin-discovery/', 'https://joplinapp.org/plugins/'],
		[
			'https://joplin.github.io/website-plugin-discovery/plugin/joplin.plugin.alondmnt.time-slip/?from-tab=all',
			'https://joplinapp.org/plugins/plugin/joplin.plugin.alondmnt.time-slip/?from-tab=all',
		],
		[
			'https://joplinapp.org/plugins/plugin/joplin.plugin.alondmnt.time-slip/?from-tab=all',
			'https://joplinapp.org/plugins/plugin/joplin.plugin.alondmnt.time-slip/?from-tab=all',
		],
		[
			'https://joplin.github.io/website-plugin-discovery/view-source.html?plugin=joplin.plugin.alondmnt.time-slip?from-tab=all#index.js',
			'https://joplinapp.org/plugins/view-source.html?plugin=joplin.plugin.alondmnt.time-slip?from-tab=all#index.js',
		],
	])(
		'should redirect from joplin.github.io to joplinapp.org/plugins (case %#)',
		(redirectFrom, redirectTo) => {
			globalThis.location = { href: redirectFrom } as Location;
			handleRedirects();
			expect(location.href).toBe(redirectTo);
		},
	);
});
