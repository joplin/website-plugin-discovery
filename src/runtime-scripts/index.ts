import PluginDataManager from './PluginDataManager';
import initializeSearch from './initializeSearch';
import initializeDownloadPage from './initializeDownloadPage';

// E.g. /site/ or /pluginWebsite/
const siteRoot: string = (window as any).siteRoot;

void (async () => {
	const pluginDataManager = await PluginDataManager.fromURL(`${siteRoot}/pluginData.json`);

	const page = (window as any).pageId ?? 'default';

	// If initializeDownloadPage was already called
	if (page === 'download') {
		initializeDownloadPage(pluginDataManager);
	}
	else if (page === 'plugin') {
		
	}

	initializeSearch(
		pluginDataManager,
		document.querySelector('#search-input')!,
		document.querySelector('#search-results-container')!
	);
})();
