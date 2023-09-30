import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { MapRelativeLinksCallback } from './types';
import makeTransformImageOrAnchorCallback from './makeTransformImageOrAnchorCallback';

let markdownRenderer: MarkdownIt | null = null;

const renderMarkdown = (markdown: string, mapRelativeLink: MapRelativeLinksCallback) => {
	if (!markdownRenderer) {
		const markdownItOptions = {
			html: true,
		};
		markdownRenderer = new MarkdownIt(markdownItOptions);
	}

	const transformImageOrAnchor = makeTransformImageOrAnchorCallback(mapRelativeLink);

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
			img: ['src', 'alt', 'width', 'height'],
			a: ['href'],
			'*': ['align', 'alt', 'aria-label'],
		},
		transformTags: {
			// The TypeScript definitions aren't correct (or are outdated
			// here).
			img: transformImageOrAnchor as any,
			a: transformImageOrAnchor as any,
		},
	};

	return sanitizeHtml(markdownRenderer.render(markdown), sanitizeOptions);
};

export default renderMarkdown;
