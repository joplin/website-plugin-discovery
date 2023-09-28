let micromarkRenderer: ((markdown: string) => string) | null = null;

const renderMarkdown = async (markdown: string) => {
	// Load micromark
	if (!micromarkRenderer) {
		// Micromark only supports ESM.
		// For ESM-CommonJS interop, we need to use `import`
		// syntax (which returns promises).
		const { micromark } = await eval('import("micromark")');
		const { gfm, gfmHtml } = await eval('import("micromark-extension-gfm")');

		micromarkRenderer = (markdown: string) => {
			return micromark(markdown, {
				extensions: [gfm()],
				htmlExtensions: [gfmHtml()],
			});
		};
	}

	return micromarkRenderer(markdown);
};

export default renderMarkdown;
