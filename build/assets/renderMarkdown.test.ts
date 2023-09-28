import renderMarkdown from './renderMarkdown';

const noOpLinkFilter = (link: string) => link;

describe('renderMarkdown', () => {
	it('should sanitize markdown', () => {
		// Simple checks to verify that the sanitizer is working.
		expect(renderMarkdown('<a href="javascript: alert();">Test</a>', noOpLinkFilter)).toBe(
			'<p><a>Test</a></p>\n'
		);
		expect(renderMarkdown('<script>\n\nevil();\n</script>', noOpLinkFilter)).toBe('');

		expect(
			renderMarkdown(
				'<a onclick="alert()">a</a><iframe src="http://example.com/"></iframe>',
				noOpLinkFilter
			)
		).toBe('<p><a>a</a></p>\n');
	});

	it('should convert markdown to HTML', () => {
		expect(renderMarkdown('# Test!\n\nThis *is* a test.', noOpLinkFilter)).toBe(
			'<h1>Test!</h1>\n<p>This <em>is</em> a test.</p>\n'
		);
		expect(renderMarkdown('`code`', noOpLinkFilter)).toBe('<p><code>code</code></p>\n');
	});

	it('should support transforming relative links', () => {
		expect(
			renderMarkdown(
				'[test](./foo.txt)',
				(href) => 'http://example.com/' + href.replace(/^\.\//, '')
			)
		).toBe('<p><a href="http://example.com/foo.txt">test</a></p>\n');

		// Should only transform relative links
		expect(renderMarkdown('[test](https://example.com/foo.txt)', (_href) => 'no')).toBe(
			'<p><a href="https://example.com/foo.txt">test</a></p>\n'
		);
	});
});
