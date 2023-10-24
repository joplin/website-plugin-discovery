import initializeScreenshotCarousel from './initializeScreenshotCarousel';

const initializePluginPage = () => {
	// Update screenshot cards
	const screenshotsCards = document.querySelectorAll('#screenshots-container');
	for (const screenshotsCard of screenshotsCards) {
		initializeScreenshotCarousel(screenshotsCard as HTMLElement);
	}
};

export default initializePluginPage;
