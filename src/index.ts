import PluginDataManager from './PluginDataManager';
import initializeSearch from './initializeSearch';
import initializeDownloadPage from './initializeDownloadPage';

// E.g. /site/ or /pluginWebsite/
const siteRoot: string = (window as any).siteRoot;

let isDownloadPage = false;
(window as any)['initializeDownloadPage'] = () => {
	isDownloadPage = true;
};

void (async () => {
	const pluginDataManager = await PluginDataManager.fromURL(`${siteRoot}/pluginData.json`);
	const doDownloadPageInitialization = () => {
		initializeDownloadPage(pluginDataManager);
	};

	// Provide a method to indicate that the current page is the downloads page.
	(window as any)['initializeDownloadPage'] = () => {
		doDownloadPageInitialization();
	};

	// If initializeDownloadPage was already called
	if (isDownloadPage) {
		doDownloadPageInitialization();
	}

	initializeSearch(
		pluginDataManager,
		document.querySelector('#search-input')!,
		document.querySelector('#search-results-container')!
	);
})();
