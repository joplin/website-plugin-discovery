import renderMarkdown from "./renderMarkdown";

describe('renderMarkdown', () => {
	it('should sanitize markdown', () => {
		// Simple checks to verify that the sanitizer is working.
		expect(renderMarkdown('<a href="javascript: alert();">Test</a>')).toBe('<p><a>Test</a></p>\n');
		expect(renderMarkdown('<script>\n\nevil();\n</script>')).toBe('');

		expect(
			renderMarkdown('<a onclick="alert()">a</a><iframe src="http://example.com/"></iframe>')
		).toBe('<p><a>a</a></p>\n');
	});

	it('should convert markdown to HTML', () => {
		expect(
			renderMarkdown('# Test!\n\nThis *is* a test.')
		).toBe(
			'<h1>Test!</h1>\n<p>This <em>is</em> a test.</p>\n'
		);
		expect(
			renderMarkdown('`code`')
		).toBe(
			'<p><code>code</code></p>\n'
		);
	})
});