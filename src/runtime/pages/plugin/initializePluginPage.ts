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
};

export default initializePluginPage;
