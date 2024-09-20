import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { LinkRewriter } from './types';
import makeTransformImageOrAnchorCallback from './makeTransformImageOrAnchorCallback';
import hljs from 'highlight.js';

let markdownRenderer: MarkdownIt | null = null;

const renderMarkdown = (markdown: string, mapLinks?: LinkRewriter) => {
	if (!markdownRenderer) {
		const markdownItOptions: MarkdownIt.Options = {
			html: true,
			highlight: (code: string, language: string) => {
				const beforeHtml = '<pre class="hljs"><code>';
				const afterHtml = '</code></pre>';

				if (language && hljs.getLanguage(language)) {
					return beforeHtml + hljs.highlight(code, { language }).value + afterHtml;
				}

				// See https://github.com/markdown-it/markdown-it#syntax-highlighting
				return beforeHtml + markdownRenderer?.utils.escapeHtml(code) + afterHtml;
			},
			linkify: true,
		};
		markdownRenderer = new MarkdownIt(markdownItOptions);
		markdownRenderer.linkify.set({
			fuzzyLink: false,
			fuzzyEmail: false,
			fuzzyIP: false,
		});
	}

	const transformImageOrAnchor = mapLinks
		? makeTransformImageOrAnchorCallback(mapLinks)
		: undefined;
	const imageAnchorTransforms = transformImageOrAnchor
		? {
				// The TypeScript definitions aren't correct (or are outdated
				// here).
				img: transformImageOrAnchor as any,
				a: transformImageOrAnchor as any,
			}
		: undefined;

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

			// Used for annotation
			// (E.g. in the Rubi and Furigana plugin README)
			'ruby',
			'rp',
			'rt',
		],
		allowedAttributes: {
			img: ['src', 'alt', 'width', 'height', 'data-original-src'],
			a: ['href'],
			'*': ['align', 'alt', 'aria-label', 'class'],
		},
		transformTags: {
			...imageAnchorTransforms,
			table: (tagName: string, attribs: Record<string, string>) => {
				return {
					tagName,
					attribs: {
						...attribs,
						class: `table table-hover ${attribs.class}`.trim(),
					},
				};
			},
		},
	};

	return sanitizeHtml(markdownRenderer.render(markdown), sanitizeOptions);
};

export default renderMarkdown;
