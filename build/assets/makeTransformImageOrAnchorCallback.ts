import imageCouldStoreExternalCookies from '../../lib/imageCouldStoreExternalCookies';
import { MapRelativeLinksCallback } from './types';

// Returns a function that could be passed to html-sanitizer to transform tags.
const makeTransformImageOrAnchorCallback =
	(mapRelativeLink: MapRelativeLinksCallback) =>
	(tagName: string, attribs: Record<string, string>) => {
		attribs = {
			...attribs,
		};

		const mapLink = (link: string) => {
			if (
				link.startsWith('http://') ||
				link.startsWith('https://') ||
				link.startsWith('mailto:') ||
				link.startsWith('#')
			) {
				return link;
			}

			return mapRelativeLink(link);
		};

		if (attribs.href) {
			attribs.href = mapLink(attribs.href);
		}
		if (attribs.src) {
			attribs.src = mapLink(attribs.src);

			// Disable some external images
			if (imageCouldStoreExternalCookies(attribs.src)) {
				attribs['data-original-src'] = attribs.src;
				attribs.src = '#';
			}
		}

		return {
			tagName,
			attribs,
		};
	};

export default makeTransformImageOrAnchorCallback;
