import { LinkRewriter } from './types';

// Returns a function that could be passed to html-sanitizer to transform tags.
const makeTransformImageOrAnchorCallback =
	(mapLinks: LinkRewriter) => (tagName: string, attribs: Record<string, string>) => {
		attribs = {
			...attribs,
		};

		const mapLink = (link: string) => {
			if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:')) {
				return mapLinks.mapAbsoluteLink(link, tagName);
			}

			if (link.startsWith('#')) {
				return mapLinks.mapAnchor(link, tagName);
			}

			return mapLinks.mapRelativeLink(link, tagName);
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

export default makeTransformImageOrAnchorCallback;
