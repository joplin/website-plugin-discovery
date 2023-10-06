import getURLData from '../../util/getURLData';
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

	// Update the link to the pluign's source
	const sourceLink = document.querySelector<HTMLAnchorElement>('a#view-plugin-source-link');
	if (!sourceLink) {
		console.error('Unable to find the plugin view-source link');
	} else {
		const urlData = getURLData(location.href);

		if (urlData.fromTab) {
			sourceLink.href += '?from-tab=' + urlData.fromTab;
		}
	}
};

export default initializePluginPage;
