import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

let markdownRenderer: MarkdownIt | null = null;

const renderMarkdown = (markdown: string) => {
	if (!markdownRenderer) {
		const markdownItOptions = {
			linkify: true,
			html: true,
		};
		markdownRenderer = new MarkdownIt(markdownItOptions);
	}

	const sanitizeOptions = {
		allowedTags: [
			'b',
			'i',
			'u',
			'em',
			'strong',
			'a',
			'kbd',
			'code',
			'pre',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'ul',
			'ol',
			'li',
			'p',
			'br',
			'div',
			'span',
			'section',
			'blockquote',
			'table',
			'thead',
			'tbody',
			'tr',
			'td',
			'th',
			'center',
			'details',
			'summary',
			'img',
		],
		allowedAttributes: {
			img: ['src', 'width'],
			a: ['href'],
		},
	};

	return sanitizeHtml(markdownRenderer.render(markdown), sanitizeOptions);
};

export default renderMarkdown;
