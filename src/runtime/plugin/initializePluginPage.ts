// pluginPage.ts is bundled separately from index.ts. As such, it's only run
// on plugin pages.

import initializeScreenshotCarousel from './initializeScreenshotCarousel';
import postprocessReadme from './postprocessReadme';

const initializePluginPage = () => {
	// Update screenshot cards
	const screenshotsCards = document.querySelectorAll('#screenshots-container');
	for (const screenshotsCard of screenshotsCards) {
		initializeScreenshotCarousel(screenshotsCard as HTMLElement);
	}

	// Update the README
	const readmeContainer: null | HTMLElement = document.querySelector('#readme');

	if (!readmeContainer) {
		console.error('Unable to find the README container for post-processing!');
	} else {
		postprocessReadme(readmeContainer);
	}

	// Update the nav links to include one of the plugin's tags
	const parentTagLink = document.querySelector<HTMLAnchorElement>('a#current-category-nav-link');
	if (!parentTagLink) {
		console.error('Unable to find the parent tag navigation link');
	} else {
		const sourceTagMatch = location.href.match(/\?from-tab=([a-zA-Z0-9\-_]+)/);

		if (sourceTagMatch) {
			const parentTagId = sourceTagMatch[1];
			parentTagLink.innerText = parentTagId.replace(/-/g, ' ');
			parentTagLink.href += `#tab-${parentTagId}`;
		}
	}
};

export default initializePluginPage;
