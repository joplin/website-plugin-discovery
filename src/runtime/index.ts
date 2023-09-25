import PluginDataManager from './PluginDataManager';
import initializeSearch from './initializeSearch';
import initializeDownloadPage from './initializeDownloadPage';
import initializePluginPage from './initializePluginPage';
import 'bootstrap';

import './style.scss';

// E.g. /site/ or /pluginWebsite/
const siteRoot: string = (window as any).siteRoot;

window.addEventListener('DOMContentLoaded', async () => {
	const pluginDataManager = await PluginDataManager.fromURL(`${siteRoot}/pluginData.json`);

	const page = (window as any).pageId ?? 'default';

	// If initializeDownloadPage was already called
	if (page === 'download') {
		initializeDownloadPage(pluginDataManager);
	}
	else if (page === 'plugin') {
		initializePluginPage();
	}

	initializeSearch(
		pluginDataManager,
		document.querySelector('#search-input')!,
		document.querySelector('#search-results-container')!
	);
});
