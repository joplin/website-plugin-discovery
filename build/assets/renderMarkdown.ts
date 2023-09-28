import MarkdownIt from 'markdown-it';

let markdownRenderer: MarkdownIt | null = null;

const renderMarkdown = async (markdown: string) => {
	if (!markdownRenderer) {
		markdownRenderer = new MarkdownIt();
	}

	return markdownRenderer.render(markdown, {
		linkify: true,
	});
};

export default renderMarkdown;
