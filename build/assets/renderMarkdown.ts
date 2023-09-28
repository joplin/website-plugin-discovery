import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

let markdownRenderer: MarkdownIt | null = null;

type MapRelativeLinksCallback = (linkUri: string) => string;

const renderMarkdown = (markdown: string, mapRelativeLink: MapRelativeLinksCallback) => {
	if (!markdownRenderer) {
		const markdownItOptions = {
			html: true,
		};
		markdownRenderer = new MarkdownIt(markdownItOptions);
	}

	const mapLink = (link: string) => {
		if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:')) {
			return link;
		}

		return mapRelativeLink(link);
	};

	const transformImageOrAnchor = (tagName: string, attribs: Record<string, string>) => {
		attribs = {
			...attribs,
		};

		if (attribs.href) {
			attribs.href = mapLink(attribs.href);
		}
		if (attribs.src) {
			attribs.src = mapLink(attribs.src);
		}

		return {
			tagName,
			attribs,
		};
	};

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
